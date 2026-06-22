import { Transaction } from '../domain/transaction.entity';

export class TransactionMapper {
  static toDomain(data: any): Transaction {
    return new Transaction({
      id: data._id?.toString(),
      paymentId: data.paymentId,
      orderId: data.orderId,
      type: data.type,
      amount: data.amount,
      status: data.status,
      gatewayResponse: data.gatewayResponse,
      createdAt: data.createdAt,
    });
  }

  static toPersistence(entity: Transaction) {
    return entity.toObject();
  }
}
