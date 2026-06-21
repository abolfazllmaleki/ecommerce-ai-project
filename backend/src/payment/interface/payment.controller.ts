import { Controller, Post, Param, Get, Query } from '@nestjs/common';

import { StartPaymentUseCase } from '../application/use-cases/start-payment.usecase';
import { VerifyPaymentUseCase } from '../application/use-cases/verify-payment.usecase';

@Controller('payments')
export class PaymentController {

  constructor(
    private readonly startPayment: StartPaymentUseCase,
    private readonly verifyPayment: VerifyPaymentUseCase,
  ) {}

  @Post(':orderId/start')
  async start(@Param('orderId') orderId: string) {
    return this.startPayment.execute(orderId);
  }

  @Get('verify')
  async verify(@Query('Authority') authority: string) {
    return this.verifyPayment.execute(authority);
  }
}
