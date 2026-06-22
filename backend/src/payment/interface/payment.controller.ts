import {
  BadRequestException,
  Controller,
  Get,
  Param,
  Post,
  Query,
  Req,
} from '@nestjs/common';
import { Request } from 'express';

import { StartPaymentUseCase } from '../application/use-cases/start-payment.usecase';
import { VerifyPaymentUseCase } from '../application/use-cases/verify-payment.usecase';

@Controller('payments')
export class PaymentController {
  constructor(
    private readonly startPayment: StartPaymentUseCase,
    private readonly verifyPayment: VerifyPaymentUseCase,
  ) {}

  @Post(':orderId/start')
  async start(@Param('orderId') orderId: string, @Req() req: Request) {
    if (!orderId) {
      throw new BadRequestException('orderId is required');
    }

    const userId = (req as any).user?.id;

    return this.startPayment.execute({
      orderId,
      userId,
    });
  }

  @Get('verify')
  async verify(
    @Query('Authority') authority: string,
    @Query('Status') status: string,
  ) {
    if (!authority) {
      throw new BadRequestException('Authority is required');
    }

    return this.verifyPayment.execute({
      authority,
      callbackStatus: status,
    });
  }
}
