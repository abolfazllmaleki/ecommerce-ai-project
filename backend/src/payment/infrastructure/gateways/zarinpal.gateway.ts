import { Injectable, InternalServerErrorException } from '@nestjs/common';
import axios from 'axios';

import {
  CreateGatewayPaymentResult,
  PaymentGatewayPort,
  VerifyGatewayPaymentResult,
} from '../../domain/payment-gateway.port';

@Injectable()
export class ZarinpalGateway implements PaymentGatewayPort {
  private readonly merchantId = process.env.ZARINPAL_MERCHANT_ID;
  private readonly requestUrl = 'https://api.zarinpal.com/pg/v4/payment/request.json';
  private readonly verifyUrl = 'https://api.zarinpal.com/pg/v4/payment/verify.json';
  private readonly startPayUrl = 'https://www.zarinpal.com/pg/StartPay';

  async createPayment(
    amount: number,
    callbackUrl: string,
    description: string,
  ): Promise<CreateGatewayPaymentResult> {
    if (!this.merchantId) {
      throw new InternalServerErrorException('Zarinpal merchant id is not configured');
    }

    try {
      const response = await axios.post(
        this.requestUrl,
        {
          merchant_id: this.merchantId,
          amount,
          callback_url: callbackUrl,
          description,
        },
        {
          timeout: 10000,
        },
      );

      const data = response.data?.data;
      const errors = response.data?.errors;

      if (data?.code !== 100 || !data?.authority) {
        throw new InternalServerErrorException({
          message: 'Zarinpal create payment failed',
          errors,
          response: response.data,
        });
      }

      return {
        authority: data.authority,
        paymentUrl: `${this.startPayUrl}/${data.authority}`,
        rawResponse: response.data,
      };
    } catch (error) {
      throw new InternalServerErrorException({
        message: 'Zarinpal create payment request failed',
        error: error?.response?.data ?? error.message,
      });
    }
  }

  async verifyPayment(
    authority: string,
    amount: number,
  ): Promise<VerifyGatewayPaymentResult> {
    if (!this.merchantId) {
      throw new InternalServerErrorException('Zarinpal merchant id is not configured');
    }

    try {
      const response = await axios.post(
        this.verifyUrl,
        {
          merchant_id: this.merchantId,
          amount,
          authority,
        },
        {
          timeout: 10000,
        },
      );

      const data = response.data?.data;
      const errors = response.data?.errors;

      if (data?.code === 100 || data?.code === 101) {
        return {
          success: true,
          transactionId: data.ref_id?.toString(),
          code: data.code,
          message: data.code === 101 ? 'Already verified' : 'Verified',
          rawResponse: response.data,
          retryable: false,
        };
      }

      return {
        success: false,
        code: data?.code,
        message: errors?.message ?? 'Payment verification failed',
        rawResponse: response.data,
        retryable: false,
      };
    } catch (error) {
      return {
        success: false,
        message: 'Zarinpal verify request failed',
        rawResponse: error?.response?.data ?? { message: error.message },
        retryable: true,
      };
    }
  }
}
