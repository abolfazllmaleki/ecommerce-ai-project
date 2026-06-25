import {
  BadRequestException,
  ConflictException,
  Inject,
  Injectable,
} from '@nestjs/common';
import { randomUUID } from 'crypto';

import { IPaymentRepository } from '../../domain/payment.repository.port';
import { PaymentGatewayPort } from '../../domain/payment-gateway.port';
import { IOrderRepository } from '../../../orders/domain/order.repository.port';
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
import { PaymentSucceededPayload } from '../events/payment-succeeded.event';

interface VerifyPaymentInput {
  authority: string;
  callbackStatus?: string;
}

@Injectable()
export class VerifyPaymentUseCase {
  constructor(
    @Inject('IPaymentRepository')
    private readonly paymentRepo: IPaymentRepository,

    @Inject('PAYMENT_GATEWAY')
    private readonly gateway: PaymentGatewayPort,

    @Inject('IOrderRepository')
    private readonly orderRepo: IOrderRepository,

    private readonly createTransaction: CreateTransactionUseCase,

    @Inject(EVENT_PUBLISHER)
    private readonly eventPublisher: EventPublisher,
  ) {}

  async execute(input: VerifyPaymentInput) {
    const existingPayment = await this.paymentRepo.findByAuthority(
      input.authority,
    );

    if (!existingPayment) {
      throw new BadRequestException('Payment not found');
    }

    if (existingPayment.isCompleted()) {
      return {
        success: true,
        alreadyVerified: true,
        paymentId: existingPayment.id,
        orderId: existingPayment.orderId,
        transactionId: existingPayment.transactionId,
      };
    }

    if (existingPayment.status === 'verifying') {
      throw new ConflictException('Payment verification is already in progress');
    }

    if (existingPayment.isExpired()) {
      existingPayment.markExpired();
      const updatedPayment = await this.paymentRepo.update(existingPayment);

      await this.publishPaymentFailed(updatedPayment, 'payment_expired');

      return {
        success: false,
        reason: 'payment_expired',
        paymentId: updatedPayment.id,
        orderId: updatedPayment.orderId,
      };
    }

    if (input.callbackStatus && input.callbackStatus !== 'OK') {
      existingPayment.markFailed('gateway_callback_not_ok', {
        callbackStatus: input.callbackStatus,
      });

      const updatedPayment = await this.paymentRepo.update(existingPayment);

      await this.createTransaction.execute({
        paymentId: updatedPayment.id!,
        orderId: updatedPayment.orderId,
        amount: updatedPayment.amount,
        type: TransactionType.VERIFY,
        status: TransactionStatus.FAILED,
        gatewayResponse: {
          callbackStatus: input.callbackStatus,
        },
      });

      await this.publishPaymentFailed(
        updatedPayment,
        'payment_cancelled_or_failed',
      );

      return {
        success: false,
        reason: 'payment_cancelled_or_failed',
        paymentId: updatedPayment.id,
        orderId: updatedPayment.orderId,
      };
    }

    const payment = await this.paymentRepo.acquireForVerification(
      input.authority,
    );

    if (!payment) {
      const refreshedPayment = await this.paymentRepo.findByAuthority(
        input.authority,
      );

      if (refreshedPayment?.isCompleted()) {
        return {
          success: true,
          alreadyVerified: true,
          paymentId: refreshedPayment.id,
          orderId: refreshedPayment.orderId,
          transactionId: refreshedPayment.transactionId,
        };
      }

      throw new ConflictException('Payment cannot be acquired for verification');
    }

    const result = await this.gateway.verifyPayment(
      input.authority,
      payment.amount,
    );

    if (!result.success && result.retryable) {
      await this.createTransaction.execute({
        paymentId: payment.id!,
        orderId: payment.orderId,
        amount: payment.amount,
        type: TransactionType.VERIFY,
        status: TransactionStatus.FAILED,
        gatewayResponse: result.rawResponse,
      });

      return {
        success: false,
        retryable: true,
        reason: result.message ?? 'gateway_verify_retryable_error',
        paymentId: payment.id,
        orderId: payment.orderId,
      };
    }

    if (!result.success) {
      payment.markFailed(
        result.message ?? 'gateway_verify_failed',
        result.rawResponse,
      );

      const updatedPayment = await this.paymentRepo.update(payment);

      await this.createTransaction.execute({
        paymentId: updatedPayment.id!,
        orderId: updatedPayment.orderId,
        amount: updatedPayment.amount,
        type: TransactionType.VERIFY,
        status: TransactionStatus.FAILED,
        gatewayResponse: result.rawResponse,
      });

      await this.publishPaymentFailed(
        updatedPayment,
        result.message ?? 'verify_failed',
      );

      return {
        success: false,
        reason: result.message ?? 'verify_failed',
        paymentId: updatedPayment.id,
        orderId: updatedPayment.orderId,
      };
    }

    payment.markCompleted(result.transactionId!, result.rawResponse);

    const updatedPayment = await this.paymentRepo.update(payment);

    await this.createTransaction.execute({
      paymentId: updatedPayment.id!,
      orderId: updatedPayment.orderId,
      amount: updatedPayment.amount,
      type: TransactionType.VERIFY,
      status: TransactionStatus.SUCCESS,
      gatewayResponse: result.rawResponse,
    });

    const order = await this.orderRepo.findById(updatedPayment.orderId);

    if (order && !this.isOrderPaid(order.paymentStatus)) {
      order.updatePaymentStatus('completed');
      await this.orderRepo.update(order);
    }

    await this.publishPaymentSucceeded(updatedPayment);

    return {
      success: true,
      alreadyVerified: false,
      paymentId: updatedPayment.id,
      orderId: updatedPayment.orderId,
      transactionId: updatedPayment.transactionId,
    };
  }

private async publishPaymentSucceeded(payment: {
  id: string | null;
  orderId: string;
  userId: string;
  amount: number;
  transactionId?: string | null;
}): Promise<void> {
  if (!payment.id) {
    throw new Error('Cannot publish payment.succeeded event without paymentId');
  }

  if (!payment.transactionId) {
    throw new Error(
      'Cannot publish payment.succeeded event without transactionId',
    );
  }

  const payload: PaymentSucceededPayload = {
    paymentId: payment.id,
    orderId: payment.orderId,
    userId: payment.userId,
    amount: payment.amount,
    transactionId: payment.transactionId,
  };

  await this.eventPublisher.publish<PaymentSucceededPayload>({
    eventId: randomUUID(),
    name: 'payment.succeeded',
    version: 1,
    occurredAt: new Date().toISOString(),
    payload,
  });
}

private async publishPaymentFailed(
  payment: {
    id: string | null;
    orderId: string;
    userId: string;
    amount: number;
  },
  reason: string,
): Promise<void> {
  if (!payment.id) {
    throw new Error('Cannot publish payment.failed event without paymentId');
  }

  const payload: PaymentFailedPayload = {
    paymentId: payment.id,
    orderId: payment.orderId,
    userId: payment.userId,
    amount: payment.amount,
    reason,
  };

  await this.eventPublisher.publish<PaymentFailedPayload>({
    eventId: randomUUID(),
    name: 'payment.failed',
    version: 1,
    occurredAt: new Date().toISOString(),
    payload,
  });
}




  private isOrderPaid(paymentStatus: string): boolean {
    return ['paid', 'completed'].includes(paymentStatus);
  }
}
