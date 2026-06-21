import { Injectable } from '@nestjs/common';
import axios from 'axios';

import { PaymentGatewayPort } from '../../domain/payment-gateway.port';

@Injectable()
export class ZarinpalGateway implements PaymentGatewayPort {

  private merchantId = process.env.ZARINPAL_MERCHANT_ID;

  async createPayment(
    amount: number,
    callbackUrl: string,
    description: string
  ) {

    const response = await axios.post(
      'https://api.zarinpal.com/pg/v4/payment/request.json',
      {
        merchant_id: this.merchantId,
        amount,
        callback_url: callbackUrl,
        description,
      }
    );

    const authority = response.data.data.authority;

    return {
      authority,
      paymentUrl:
        `https://www.zarinpal.com/pg/StartPay/${authority}`
    };
  }

  async verifyPayment(
    authority: string,
    amount: number
  ) {

    const response = await axios.post(
      'https://api.zarinpal.com/pg/v4/payment/verify.json',
      {
        merchant_id: this.merchantId,
        amount,
        authority
      }
    );

    const data = response.data.data;

    if (data.code === 100) {
      return {
        success: true,
        transactionId: data.ref_id.toString()
      };
    }

    return { success: false };
  }
}
