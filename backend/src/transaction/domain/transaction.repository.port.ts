import {
  Transaction,
  TransactionType,
} from './transaction.entity';

export interface ITransactionRepository {
  create(transaction: Transaction): Promise<Transaction>;
  update(transaction: Transaction): Promise<Transaction>;
  findById(id: string): Promise<Transaction | null>;
  findByPaymentId(paymentId: string): Promise<Transaction[]>;
  findByPaymentIdAndType(
    paymentId: string,
    type: TransactionType,
  ): Promise<Transaction | null>;
}
