import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { OrdersModule } from '../orders/orders.module';
import { TransactionModule } from '../transaction/transaction.module';
import { MessagingModule } from '../shared/messaging/messaging.module';

import { PaymentSchema } from './schemas/payment.schema';
import { PaymentRepository } from './infrastructure/payment.repository';
import { MockGateway } from './infrastructure/gateways/mock-gateway.service';

import { StartPaymentUseCase } from './application/use-cases/start-payment.usecase';
import { VerifyPaymentUseCase } from './application/use-cases/verify-payment.usecase';
import { FailPaymentUseCase } from './application/use-cases/fail-payment.usecase';
import { PaymentController } from './interface/payment.controller';
import { OrderCreatedConsumer } from './infrastructure/order-created.consumer';
import { MockGatewayController } from './interface/mock-gateway.controller';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Payment', schema: PaymentSchema }]),
    OrdersModule,
    TransactionModule,
    MessagingModule,
  ],
  controllers: [PaymentController,MockGatewayController],
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
    OrderCreatedConsumer,
  ],
})
export class PaymentModule {}
