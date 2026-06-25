import { Inject, Injectable } from '@nestjs/common';

import { ITransactionRepository } from '../../domain/transaction.repository.port';
import {
  Transaction,
  TransactionStatus,
  TransactionType,
} from '../../domain/transaction.entity';

interface CreateTransactionInput {
  paymentId: string;
  orderId: string;
  type: TransactionType;
  amount: number;
  status?: TransactionStatus;
  gatewayResponse?: any;
}

@Injectable()
export class CreateTransactionUseCase {
  constructor(
    @Inject('ITransactionRepository')
    private readonly transactionRepo: ITransactionRepository,
  ) {}

  async execute(input: CreateTransactionInput): Promise<Transaction> {
    if (input.type === TransactionType.REQUEST) {
      const existingTransaction =
        await this.transactionRepo.findByPaymentIdAndType(
          input.paymentId,
          input.type,
        );

      if (existingTransaction) {
        return existingTransaction;
      }
    }

    const transaction = new Transaction({
      paymentId: input.paymentId,
      orderId: input.orderId,
      type: input.type,
      amount: input.amount,
      status: input.status ?? TransactionStatus.PENDING,
      gatewayResponse: input.gatewayResponse,
    });

    try {
      return await this.transactionRepo.create(transaction);
    } catch (error) {
      if (error?.code === 11000 && input.type === TransactionType.REQUEST) {
        const existingTransaction =
          await this.transactionRepo.findByPaymentIdAndType(
            input.paymentId,
            input.type,
          );

        if (existingTransaction) {
          return existingTransaction;
        }
      }

      throw error;
    }
  }
}
