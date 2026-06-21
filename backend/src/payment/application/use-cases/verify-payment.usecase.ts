import { Inject, Injectable, BadRequestException } from '@nestjs/common';

import { IPaymentRepository } from '../../domain/payment.repository.port';
import { PaymentGatewayPort } from '../../domain/payment-gateway.port';
import { IOrderRepository } from '../../../orders/domain/order.repository.port';

import { CreateTransactionUseCase } from '../../../transaction/application/use-cases/create-transaction.usecase';
import { TransactionType } from 'src/transaction/domain/transaction.entity';

@Injectable()
export class VerifyPaymentUseCase {

  constructor(
    @Inject('IPaymentRepository')
    private readonly repo: IPaymentRepository,

    @Inject('PAYMENT_GATEWAY')
    private readonly gateway: PaymentGatewayPort,

    @Inject('IOrderRepository')
    private readonly orderRepo: IOrderRepository,

    private readonly createTransaction: CreateTransactionUseCase
  ) {}

  async execute(authority: string) {

    const payment = await this.repo.findByAuthority(authority);

    if (!payment) {
      throw new BadRequestException('Payment not found');
    }

    if (payment.isCompleted()) {
      return { success: true };
    }

    const result = await this.gateway.verifyPayment(
      authority,
      payment.amount
    );

    // ✅ ثبت transaction verify
    const transaction = await this.createTransaction.execute({
      paymentId: payment.id!,
      orderId: payment.orderId,
      amount: payment.amount,
      type: TransactionType.VERIFY
    });

    if (!result.success) {

      payment.markFailed();
      await this.repo.update(payment);

      return { success: false };
    }

    payment.markCompleted(result.transactionId!);

    await this.repo.update(payment);

    const order = await this.orderRepo.findById(payment.orderId);

    if (order) {
      order.updatePaymentStatus('completed');
      await this.orderRepo.update(order);
    }

    return { success: true };
  }
}
