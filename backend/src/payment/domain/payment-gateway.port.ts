export interface PaymentGatewayPort {

  createPayment(
    amount: number,
    callbackUrl: string,
    description: string
  ): Promise<{
    authority: string
    paymentUrl: string
  }>;

  verifyPayment(
    authority: string,
    amount: number
  ): Promise<{
    success: boolean
    transactionId?: string
  }>;
}
