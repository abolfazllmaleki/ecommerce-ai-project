import { Inject, Injectable, Logger, OnModuleInit } from '@nestjs/common';

import {
  EVENT_CONSUMER,
  EventConsumer,
} from '../../shared/messaging/application/ports/event-consumer.port';
import { IntegrationEvent } from '../../shared/messaging/application/ports/integration-event';
import { PaymentSucceededPayload } from '../application/events/payment-succeeded.event';
import { PaymentFailedPayload } from '../application/events/payment-failed.event';

import { UpdateOrderPaymentStatusUseCase } from '../application/use-cases/update-order-payment-status.usecase';

type PaymentResultPayload = PaymentSucceededPayload | PaymentFailedPayload;

@Injectable()
export class PaymentResultConsumer implements OnModuleInit {
  private readonly logger = new Logger(PaymentResultConsumer.name);

  constructor(
    @Inject(EVENT_CONSUMER)
    private readonly eventConsumer: EventConsumer,

    private readonly updateOrderPaymentStatusUseCase: UpdateOrderPaymentStatusUseCase,
  ) {}

  async onModuleInit(): Promise<void> {
    await this.eventConsumer.consume<PaymentResultPayload>(
      {
        queue: 'order.payment-result.queue',
        routingKeys: ['payment.succeeded.v1', 'payment.failed.v1'],
      },
      async (event) => this.handle(event),
    );
  }

  private async handle(
    event: IntegrationEvent<PaymentResultPayload>,
  ): Promise<void> {
    this.validate(event);

    if (event.name === 'payment.succeeded') {
      await this.updateOrderPaymentStatusUseCase.execute(
        event.payload.orderId,
        'completed',
      );

      this.logger.log(
        `Order "${event.payload.orderId}" marked as completed from payment event "${event.eventId}"`,
      );

      return;
    }

    if (event.name === 'payment.failed') {
      await this.updateOrderPaymentStatusUseCase.execute(
        event.payload.orderId,
        'failed',
      );

      this.logger.log(
        `Order "${event.payload.orderId}" marked as failed from payment event "${event.eventId}"`,
      );

      return;
    }

    throw new Error(`Unsupported payment event: ${event.name}`);
  }

  private validate(event: IntegrationEvent<PaymentResultPayload>): void {
    if (!['payment.succeeded', 'payment.failed'].includes(event.name)) {
      throw new Error(`Invalid event name: ${event.name}`);
    }

    if (event.version !== 1) {
      throw new Error(`Unsupported event version: ${event.version}`);
    }

    if (!event.payload?.paymentId) {
      throw new Error('paymentId is required');
    }

    if (!event.payload?.orderId) {
      throw new Error('orderId is required');
    }

    if (!event.payload?.userId) {
      throw new Error('userId is required');
    }

    if (!Number.isFinite(event.payload.amount)) {
      throw new Error('amount is invalid');
    }
  }
}
