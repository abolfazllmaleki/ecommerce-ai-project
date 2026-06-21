import { Payment as PaymentEntity } from '../domain/payment.entity';

export class PaymentMapper {
  static toDomain(data: any): PaymentEntity {
    return new PaymentEntity({
      id: data._id?.toString(),
      orderId: data.orderId,
      userId: data.userId,
      amount: data.amount,
      gateway: data.gateway,
      authority: data.authority,
      transactionId: data.transactionId,
      status: data.status,
      createdAt: data.createdAt,
      paidAt: data.paidAt,
    });
  }

  static toPersistence(entity: PaymentEntity) {
    return {
      orderId: entity.orderId,
      userId: entity.userId,
      amount: entity.amount,
      gateway: entity.gateway,
      authority: entity.authority,
      transactionId: entity.transactionId,
      status: entity.status,
      createdAt: entity.createdAt,
      paidAt: entity.paidAt,
    };
  }
}
