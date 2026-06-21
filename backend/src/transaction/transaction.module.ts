import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TransactionSchema } from './schemas/transaction.schema';
import { TransactionRepository } from './infrastructure/transaction.repository';

import { TransactionController } from './interface/transaction.controller';

import { CreateTransactionUseCase } from './application/use-cases/create-transaction.usecase';
import { GetTransactionsByPaymentUseCase } from './application/use-cases/get-transactions-by-payment.usecase';

@Module({

  imports: [
    MongooseModule.forFeature([
      { name: 'Transaction', schema: TransactionSchema }
    ])
  ],

  controllers: [TransactionController],

  providers: [

    {
      provide: 'ITransactionRepository',
      useClass: TransactionRepository
    },

    CreateTransactionUseCase,
    GetTransactionsByPaymentUseCase
  ],

  exports: [
    CreateTransactionUseCase
  ]

})
export class TransactionModule {}
