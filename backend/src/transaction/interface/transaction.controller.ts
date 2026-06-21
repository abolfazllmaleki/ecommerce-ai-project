import { Controller, Get, Param } from '@nestjs/common';
import { GetTransactionsByPaymentUseCase } from '../application/use-cases/get-transactions-by-payment.usecase';

@Controller('transactions')
export class TransactionController {

  constructor(
    private readonly getTransactions: GetTransactionsByPaymentUseCase
  ) {}

  @Get('payment/:paymentId')
  async byPayment(@Param('paymentId') paymentId: string) {
    return this.getTransactions.execute(paymentId);
  }
}
