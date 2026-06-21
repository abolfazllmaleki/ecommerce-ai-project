import { Controller, Post, Body, Headers } from '@nestjs/common';
import { VerifyPaymentUseCase } from '../application/use-cases/verify-payment.usecase';

@Controller('payments/webhook')
export class PaymentWebhookController {

  constructor(
    private readonly verifyPayment: VerifyPaymentUseCase
  ) {}

  @Post('zarinpal')
  async handleZarinpalWebhook(
    @Body() body: any,
  ) {

    const authority = body.Authority;

    return this.verifyPayment.execute(authority);
  }
}
