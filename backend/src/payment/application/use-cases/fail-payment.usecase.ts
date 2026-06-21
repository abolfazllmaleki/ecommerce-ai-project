import { Inject, Injectable, BadRequestException } from '@nestjs/common';

import { IPaymentRepository } from '../../domain/payment.repository.port';
import { CreateTransactionUseCase } from '../../../transaction/application/use-cases/create-transaction.usecase';
import { TransactionType } from 'src/transaction/domain/transaction.entity';

@Injectable()
export class FailPaymentUseCase {

  constructor(
    @Inject('IPaymentRepository')
    private readonly repo: IPaymentRepository,

    private readonly createTransaction: CreateTransactionUseCase
  ) {}

  async execute(paymentId: string) {

    const payment = await this.repo.findById(paymentId);

    if (!payment) {
      throw new BadRequestException('Payment not found');
    }

    if (payment.isCompleted()) {
      throw new BadRequestException('Payment already completed');
    }

    payment.markFailed();

    await this.repo.update(payment);

    await this.createTransaction.execute({
      paymentId: payment.id!,
      orderId: payment.orderId,
      amount: payment.amount,
      type: TransactionType.CHARGEBACK
    });

    return {
      success: false
    };
  }
}
