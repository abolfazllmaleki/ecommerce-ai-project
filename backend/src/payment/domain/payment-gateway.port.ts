export interface CreateGatewayPaymentResult {
  authority: string;
  paymentUrl: string;
  rawResponse?: any;
}

export interface VerifyGatewayPaymentResult {
  success: boolean;
  transactionId?: string;
  code?: number;
  message?: string;
  rawResponse?: any;
  retryable?: boolean;
}

export interface PaymentGatewayPort {
  createPayment(
    amount: number,
    callbackUrl: string,
    description: string,
  ): Promise<CreateGatewayPaymentResult>;

  verifyPayment(
    authority: string,
    amount: number,
  ): Promise<VerifyGatewayPaymentResult>;
}
