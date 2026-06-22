import { Inject, Injectable } from '@nestjs/common';

import { ITransactionRepository } from '../../domain/transaction.repository.port';

@Injectable()
export class GetTransactionsByPaymentUseCase {
  constructor(
    @Inject('ITransactionRepository')
    private readonly transactionRepo: ITransactionRepository,
  ) {}

  async execute(paymentId: string) {
    return this.transactionRepo.findByPaymentId(paymentId);
  }
}
