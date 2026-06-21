import { Transaction } from './transaction.entity';

export interface ITransactionRepository {

  create(transaction: Transaction): Promise<Transaction>;

  update(transaction: Transaction): Promise<Transaction>;

  findById(id: string): Promise<Transaction | null>;

  findByPaymentId(paymentId: string): Promise<Transaction[]>;
}
