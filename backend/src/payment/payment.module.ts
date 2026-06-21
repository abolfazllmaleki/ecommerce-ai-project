import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { PaymentSchema } from './schemas/payment.schema';
import { PaymentRepository } from './infrastructure/payment.repository';

import { StartPaymentUseCase } from './application/use-cases/start-payment.usecase';
import { VerifyPaymentUseCase } from './application/use-cases/verify-payment.usecase';

import { PaymentController } from './interface/payment.controller';
import { PaymentWebhookController } from './interface/webhooks.controller';

import { ZarinpalGateway } from './infrastructure/gateways/zarinpal.gateway';
import { OrdersModule } from '../orders/orders.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'Payment', schema: PaymentSchema }
    ]),
    OrdersModule
  ],

  controllers: [
    PaymentController,
    PaymentWebhookController
  ],

  providers: [
    {
      provide: 'IPaymentRepository',
      useClass: PaymentRepository
    },

    // ✅ gateway abstraction
    {
      provide: 'PAYMENT_GATEWAY',
      useClass: ZarinpalGateway
    },

    StartPaymentUseCase,
    VerifyPaymentUseCase
  ]
})
export class PaymentModule {}
