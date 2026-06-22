import { Injectable, InternalServerErrorException } from '@nestjs/common';
import {
  PaymentGatewayPort,
  CreateGatewayPaymentResult,
  VerifyGatewayPaymentResult,
} from '../../domain/payment-gateway.port';

@Injectable()
export class MockGateway implements PaymentGatewayPort {
  async createPayment(
    amount: number,
    callbackUrl: string,
    description: string,
  ): Promise<CreateGatewayPaymentResult> {
    const backendUrl = process.env.BACKEND_URL;

    if (!backendUrl) {
      throw new InternalServerErrorException('BACKEND_URL is not defined');
    }

    if (!callbackUrl) {
      throw new InternalServerErrorException('callbackUrl is not defined');
    }

    const normalizedBackendUrl = backendUrl.replace(/\/$/, '');
    const authority = `MOCK_${Math.random().toString(36).substring(2, 10)}`;

    const paymentUrl = new URL(`${normalizedBackendUrl}/mock-gateway/pay`);
    paymentUrl.searchParams.set('authority', authority);
    paymentUrl.searchParams.set('callback', callbackUrl);

    return {
      authority,
      paymentUrl: paymentUrl.toString(),
      rawResponse: {
        mock: true,
        amount,
        description,
        callbackUrl,
      },
    };
  }

  async verifyPayment(
    authority: string,
    amount: number,
  ): Promise<VerifyGatewayPaymentResult> {
    if (!authority) {
      return {
        success: false,
        message: 'Authority is required',
        code: -1,
      };
    }

    if (authority.includes('FAIL')) {
      return {
        success: false,
        message: 'Mock payment failed',
        code: -1,
      };
    }

    return {
      success: true,
      transactionId: `REF_${Math.floor(Math.random() * 1000000)}`,
      code: 100,
      rawResponse: {
        mock: true,
        authority,
        amount,
      },
    };
  }
}
