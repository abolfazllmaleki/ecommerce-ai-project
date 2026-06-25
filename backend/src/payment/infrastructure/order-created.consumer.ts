import { Inject, Injectable, Logger, OnModuleInit } from '@nestjs/common';

import {
  EVENT_CONSUMER,
  EventConsumer,
} from '../../shared/messaging/application/ports/event-consumer.port';
import { IntegrationEvent } from '../../shared/messaging/application/ports/integration-event';
import { OrderCreatedPayload } from '../../orders/application/events/order-created.event';
import { StartPaymentUseCase } from '../application/use-cases/start-payment.usecase';

@Injectable()
export class OrderCreatedConsumer implements OnModuleInit {
  private readonly logger = new Logger(OrderCreatedConsumer.name);

  constructor(
    @Inject(EVENT_CONSUMER)
    private readonly eventConsumer: EventConsumer,

    private readonly startPaymentUseCase: StartPaymentUseCase,
  ) {}

  async onModuleInit(): Promise<void> {
    await this.eventConsumer.consume<OrderCreatedPayload>(
      {
        queue: 'payment.order-created.queue',
        routingKeys: ['order.created.v1'],
      },
      async (event) => this.handle(event),
    );
  }

  private async handle(
    event: IntegrationEvent<OrderCreatedPayload>,
  ): Promise<void> {
    this.validate(event);

    await this.startPaymentUseCase.execute({
      orderId: event.payload.orderId,
      userId: event.payload.userId,
    });

    this.logger.log(
      `Payment started for order "${event.payload.orderId}" from event "${event.eventId}"`,
    );
  }

  private validate(event: IntegrationEvent<OrderCreatedPayload>): void {
    if (event.name !== 'order.created') {
      throw new Error(`Invalid event name: ${event.name}`);
    }

    if (event.version !== 1) {
      throw new Error(`Unsupported event version: ${event.version}`);
    }

    if (!event.payload?.orderId) {
      throw new Error('orderId is required');
    }

    if (!event.payload?.userId) {
      throw new Error('userId is required');
    }

    if (!Number.isFinite(event.payload.totalPrice)) {
      throw new Error('totalPrice is invalid');
    }
  }
}
