import { Inject, Injectable } from '@nestjs/common';
import { ITransactionRepository } from 'src/transaction/domain/transaction.repository.port';
import { Transaction } from 'src/transaction/domain/transaction.entity';

import { CreateTransactionDto } from '../dto/create-transaction.dto';

@Injectable()
export class CreateTransactionUseCase {

  constructor(
    @Inject('ITransactionRepository')
    private readonly transactionRepo: ITransactionRepository
  ) {}

  async execute(dto: CreateTransactionDto) {

    const transaction = new Transaction({
      paymentId: dto.paymentId,
      orderId: dto.orderId,
      amount: dto.amount,
      type: dto.type
    });

    return this.transactionRepo.create(transaction);
  }
}
