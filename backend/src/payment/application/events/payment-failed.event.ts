export interface PaymentFailedPayload {
  paymentId: string;
  orderId: string;
  userId: string;
  amount: number;
  reason: string;
}
