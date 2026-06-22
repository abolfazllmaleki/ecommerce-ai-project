import {
  BadRequestException,
  ConflictException,
  Inject,
  Injectable,
} from '@nestjs/common';

import { IPaymentRepository } from '../../domain/payment.repository.port';
import { PaymentGatewayPort } from '../../domain/payment-gateway.port';
import { IOrderRepository } from '../../../orders/domain/order.repository.port';

import { CreateTransactionUseCase } from '../../../transaction/application/use-cases/create-transaction.usecase';
import {
  TransactionStatus,
  TransactionType,
} from '../../../transaction/domain/transaction.entity';

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
  ) {}

  async execute(input: VerifyPaymentInput) {
    const existingPayment = await this.paymentRepo.findByAuthority(input.authority);

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
      await this.paymentRepo.update(existingPayment);

      return {
        success: false,
        reason: 'payment_expired',
        paymentId: existingPayment.id,
        orderId: existingPayment.orderId,
      };
    }

    if (input.callbackStatus && input.callbackStatus !== 'OK') {
      existingPayment.markFailed('gateway_callback_not_ok', {
        callbackStatus: input.callbackStatus,
      });

      await this.paymentRepo.update(existingPayment);

      await this.createTransaction.execute({
        paymentId: existingPayment.id!,
        orderId: existingPayment.orderId,
        amount: existingPayment.amount,
        type: TransactionType.VERIFY,
        status: TransactionStatus.FAILED,
        gatewayResponse: {
          callbackStatus: input.callbackStatus,
        },
      });

      return {
        success: false,
        reason: 'payment_cancelled_or_failed',
        paymentId: existingPayment.id,
        orderId: existingPayment.orderId,
      };
    }

    const payment = await this.paymentRepo.acquireForVerification(input.authority);

    if (!payment) {
      const refreshedPayment = await this.paymentRepo.findByAuthority(input.authority);

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

      await this.paymentRepo.update(payment);

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
        reason: result.message ?? 'verify_failed',
        paymentId: payment.id,
        orderId: payment.orderId,
      };
    }

    payment.markCompleted(
      result.transactionId!,
      result.rawResponse,
    );

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

    return {
      success: true,
      alreadyVerified: false,
      paymentId: updatedPayment.id,
      orderId: updatedPayment.orderId,
      transactionId: updatedPayment.transactionId,
    };
  }

  private isOrderPaid(paymentStatus: string): boolean {
    return ['paid', 'completed'].includes(paymentStatus);
  }
}
