import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { PaymentSchema } from './schemas/payment.schema';
import { PaymentRepository } from './infrastructure/payment.repository';

import { StartPaymentUseCase } from './application/use-cases/start-payment.usecase';
import { VerifyPaymentUseCase } from './application/use-cases/verify-payment.usecase';
import { FailPaymentUseCase } from './application/use-cases/fail-payment.usecase';

import { PaymentController } from './interface/payment.controller';
import { PaymentWebhookController } from './interface/webhooks.controller';

import { ZarinpalGateway } from './infrastructure/gateways/zarinpal.gateway';
import { OrdersModule } from '../orders/orders.module';
import { TransactionModule } from '../transaction/transaction.module';
import { MockGateway } from './infrastructure/gateways/mock-gateway.service';
import { MockGatewayController } from './interface/mock-gateway.controller';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Payment', schema: PaymentSchema }]),
    OrdersModule,
    TransactionModule,
  ],
  controllers: [PaymentController, PaymentWebhookController,  MockGatewayController],
  providers: [
    {
      provide: 'IPaymentRepository',
      useClass: PaymentRepository,
    },
    {
      provide: 'PAYMENT_GATEWAY',
      useClass: MockGateway,
    },
    StartPaymentUseCase,
    VerifyPaymentUseCase,
    FailPaymentUseCase,
  ],
})
export class PaymentModule {}
