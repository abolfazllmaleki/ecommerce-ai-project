import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';

import { IPaymentRepository } from '../../domain/payment.repository.port';
import { CreateTransactionUseCase } from '../../../transaction/application/use-cases/create-transaction.usecase';
import {
  TransactionStatus,
  TransactionType,
} from '../../../transaction/domain/transaction.entity';
import {
  EVENT_PUBLISHER,
  EventPublisher,
} from '../../../shared/messaging/application/ports/event-publisher.port';
import { PaymentFailedPayload } from '../events/payment-failed.event';

@Injectable()
export class FailPaymentUseCase {
  constructor(
    @Inject('IPaymentRepository')
    private readonly paymentRepo: IPaymentRepository,

    private readonly createTransaction: CreateTransactionUseCase,

    @Inject(EVENT_PUBLISHER)
    private readonly eventPublisher: EventPublisher,
  ) {}

  async execute(paymentId: string, reason = 'manual_fail') {
    const payment = await this.paymentRepo.findById(paymentId);

    if (!payment) {
      throw new BadRequestException('Payment not found');
    }

    if (payment.isCompleted()) {
      throw new BadRequestException('Payment already completed');
    }

    payment.markFailed(reason);

    const updatedPayment = await this.paymentRepo.update(payment);

    await this.createTransaction.execute({
      paymentId: updatedPayment.id!,
      orderId: updatedPayment.orderId,
      amount: updatedPayment.amount,
      type: TransactionType.VERIFY,
      status: TransactionStatus.FAILED,
      gatewayResponse: { reason },
    });

    await this.eventPublisher.publish<PaymentFailedPayload>({
      eventId: randomUUID(),
      name: 'payment.failed',
      version: 1,
      occurredAt: new Date().toISOString(),
      payload: {
        paymentId: updatedPayment.id!,
        orderId: updatedPayment.orderId,
        userId: updatedPayment.userId,
        amount: updatedPayment.amount,
        reason,
      },
    });

    return {
      success: false,
      paymentId: updatedPayment.id,
      reason,
    };
  }
}
