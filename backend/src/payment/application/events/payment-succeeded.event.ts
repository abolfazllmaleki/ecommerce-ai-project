export interface PaymentSucceededPayload {
  paymentId: string;
  orderId: string;
  userId: string;
  amount: number;
  transactionId: string;
}
