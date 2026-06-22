import { Payment } from './payment.entity';

export interface IPaymentRepository {
  create(payment: Payment): Promise<Payment>;
  update(payment: Payment): Promise<Payment>;
  findById(id: string): Promise<Payment | null>;
  findByAuthority(authority: string): Promise<Payment | null>;
  findActiveByOrderId(orderId: string): Promise<Payment | null>;
  acquireForVerification(authority: string): Promise<Payment | null>;
}
