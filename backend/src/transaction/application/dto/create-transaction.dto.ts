import { TransactionType } from "src/transaction/domain/transaction.entity";

export class CreateTransactionDto {

  paymentId: string;

  orderId: string;

  amount: number;

  type: TransactionType;
}
