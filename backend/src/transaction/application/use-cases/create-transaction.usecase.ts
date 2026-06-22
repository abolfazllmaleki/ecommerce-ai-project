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
    const transaction = new Transaction({
      paymentId: input.paymentId,
      orderId: input.orderId,
      type: input.type,
      amount: input.amount,
      status: input.status ?? TransactionStatus.PENDING,
      gatewayResponse: input.gatewayResponse,
    });

    return this.transactionRepo.create(transaction);
  }
}
