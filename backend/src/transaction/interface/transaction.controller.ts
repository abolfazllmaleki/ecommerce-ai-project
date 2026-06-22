import { BadRequestException, Controller, Get, Param } from '@nestjs/common';

import { GetTransactionsByPaymentUseCase } from '../application/use-cases/get-transactions-by-payment.usecase';

@Controller('transactions')
export class TransactionController {
  constructor(
    private readonly getTransactionsByPayment: GetTransactionsByPaymentUseCase,
  ) {}

  @Get('payment/:paymentId')
  async findByPaymentId(@Param('paymentId') paymentId: string) {
    if (!paymentId) {
      throw new BadRequestException('paymentId is required');
    }

    return this.getTransactionsByPayment.execute(paymentId);
  }
}
