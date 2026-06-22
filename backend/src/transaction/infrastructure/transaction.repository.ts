import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { ITransactionRepository } from '../domain/transaction.repository.port';
import { Transaction as TransactionEntity } from '../domain/transaction.entity';
import { Transaction } from '../schemas/transaction.schema';
import { TransactionMapper } from './transaction.mapper';

@Injectable()
export class TransactionRepository implements ITransactionRepository {
  constructor(
    @InjectModel('Transaction')
    private readonly model: Model<Transaction>,
  ) {}

  async create(transaction: TransactionEntity): Promise<TransactionEntity> {
    const created = new this.model(TransactionMapper.toPersistence(transaction));
    const saved = await created.save();

    return TransactionMapper.toDomain(saved);
  }

  async update(transaction: TransactionEntity): Promise<TransactionEntity> {
    const updated = await this.model.findByIdAndUpdate(
      transaction.id,
      TransactionMapper.toPersistence(transaction),
      { new: true },
    );

    if (!updated) {
      throw new Error('Transaction update failed');
    }

    return TransactionMapper.toDomain(updated);
  }

  async findById(id: string): Promise<TransactionEntity | null> {
    const transaction = await this.model.findById(id);

    return transaction ? TransactionMapper.toDomain(transaction) : null;
  }

  async findByPaymentId(paymentId: string): Promise<TransactionEntity[]> {
    const transactions = await this.model
      .find({ paymentId })
      .sort({ createdAt: -1 });

    return transactions.map(TransactionMapper.toDomain);
  }
}
