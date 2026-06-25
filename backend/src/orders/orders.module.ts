import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { MessagingModule } from '../shared/messaging/messaging.module';

import { OrderSchema } from './schemas/order.schema';
import { OrderRepository } from './infrastructure/order.repository';

import { CreateOrderUseCase } from './application/use-cases/create-order.usecase';
import { FindAllOrdersUseCase } from './application/use-cases/find-all-orders.usecase';
import { FindOrderByIdUseCase } from './application/use-cases/find-order-by-id.usecase';
import { FindOrdersByUserUseCase } from './application/use-cases/find-orders-by-user.usecase';
import { UpdateOrderStatusUseCase } from './application/use-cases/update-order-status.usecase';
import { UpdateOrderPaymentStatusUseCase } from './application/use-cases/update-order-payment-status.usecase';
import { DeleteOrderUseCase } from './application/use-cases/delete-order.usecase';
import { OrdersController } from './interface/orders.controller';
import { PaymentResultConsumer } from './infrastructure/payment-result.consumer';
import { UpdateOrderUseCase } from './application/use-cases/update-order.usecase';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Order', schema: OrderSchema }]),
    MessagingModule,
  ],
  controllers: [OrdersController],
  providers: [
    {
      provide: 'IOrderRepository',
      useClass: OrderRepository,
    },
    CreateOrderUseCase,
    FindAllOrdersUseCase,
    FindOrderByIdUseCase,
    FindOrdersByUserUseCase,
    UpdateOrderStatusUseCase,
    UpdateOrderPaymentStatusUseCase,
    DeleteOrderUseCase,
    PaymentResultConsumer,
    UpdateOrderUseCase
  ],
  exports: ['IOrderRepository', UpdateOrderPaymentStatusUseCase],
})
export class OrdersModule {}
