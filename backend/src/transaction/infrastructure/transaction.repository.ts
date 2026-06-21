import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Transaction } from '../domain/transaction.entity';
import { ITransactionRepository } from '../domain/transaction.repository.port';


export class TransactionRepository implements ITransactionRepository {

  constructor(
    @InjectModel('Transaction')
    private readonly model: Model<any>
  ) {}

  async create(transaction: Transaction): Promise<Transaction> {

    const created = await this.model.create(transaction.toObject());

    return new Transaction({ ...created.toObject(), id: created._id });
  }

  async update(transaction: Transaction): Promise<Transaction> {

    const updated = await this.model.findByIdAndUpdate(
      transaction.id,
      transaction.toObject(),
      { new: true }
    );

    return new Transaction({ ...updated.toObject(), id: updated._id });
  }

  async findById(id: string): Promise<Transaction | null> {

    const doc = await this.model.findById(id);

    if (!doc) return null;

    return new Transaction({ ...doc.toObject(), id: doc._id });
  }

  async findByPaymentId(paymentId: string): Promise<Transaction[]> {

    const docs = await this.model.find({ paymentId });

    return docs.map(d => new Transaction({ ...d.toObject(), id: d._id }));
  }
}
