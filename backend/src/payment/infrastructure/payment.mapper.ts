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
      paymentUrl: data.paymentUrl,
      transactionId: data.transactionId,
      status: data.status,
      failureReason: data.failureReason,
      gatewayRawResponse: data.gatewayRawResponse,
      createdAt: data.createdAt,
      initiatedAt: data.initiatedAt,
      paidAt: data.paidAt,
      failedAt: data.failedAt,
      expiresAt: data.expiresAt,
    });
  }

  static toPersistence(entity: PaymentEntity) {
    return {
      orderId: entity.orderId,
      userId: entity.userId,
      amount: entity.amount,
      gateway: entity.gateway,
      authority: entity.authority,
      paymentUrl: entity.paymentUrl,
      transactionId: entity.transactionId,
      status: entity.status,
      failureReason: entity.failureReason,
      gatewayRawResponse: entity.gatewayRawResponse,
      createdAt: entity.createdAt,
      initiatedAt: entity.initiatedAt,
      paidAt: entity.paidAt,
      failedAt: entity.failedAt,
      expiresAt: entity.expiresAt,
    };
  }
}
