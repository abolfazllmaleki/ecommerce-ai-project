import { BadRequestException, Inject, Injectable } from '@nestjs/common';

import { IPaymentRepository } from '../../domain/payment.repository.port';
import { CreateTransactionUseCase } from '../../../transaction/application/use-cases/create-transaction.usecase';
import {
  TransactionStatus,
  TransactionType,
} from '../../../transaction/domain/transaction.entity';

@Injectable()
export class FailPaymentUseCase {
  constructor(
    @Inject('IPaymentRepository')
    private readonly paymentRepo: IPaymentRepository,

    private readonly createTransaction: CreateTransactionUseCase,
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

    await this.paymentRepo.update(payment);

    await this.createTransaction.execute({
      paymentId: payment.id!,
      orderId: payment.orderId,
      amount: payment.amount,
      type: TransactionType.VERIFY,
      status: TransactionStatus.FAILED,
      gatewayResponse: { reason },
    });

    return {
      success: false,
      paymentId: payment.id,
      reason,
    };
  }
}
