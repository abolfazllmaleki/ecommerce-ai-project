import { BadRequestException, Body, Controller, Post } from '@nestjs/common';

import { VerifyPaymentUseCase } from '../application/use-cases/verify-payment.usecase';

@Controller('payments/webhook')
export class PaymentWebhookController {
  constructor(private readonly verifyPayment: VerifyPaymentUseCase) {}

  @Post('zarinpal')
  async handleZarinpalWebhook(@Body() body: any) {
    const authority = body.Authority ?? body.authority;
    const status = body.Status ?? body.status;

    if (!authority) {
      throw new BadRequestException('Authority is required');
    }

    return this.verifyPayment.execute({
      authority,
      callbackStatus: status,
    });
  }
}
