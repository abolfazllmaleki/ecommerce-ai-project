import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { OrderSchema } from './schemas/order.schema';
import { OrdersController } from './interface/orders.controller';
import { OrderRepository } from './infrastructure/order.repository';
import { CreateOrderUseCase } from './application/use-cases/create-order.usecase';
import { FindAllOrdersUseCase } from './application/use-cases/find-all-orders.usecase';
import { FindOrderByIdUseCase } from './application/use-cases/find-order-by-id.usecase';
import { FindOrdersByUserUseCase } from './application/use-cases/find-orders-by-user.usecase';
import { UpdateOrderUseCase } from './application/use-cases/update-order.usecase';
import { UpdateOrderStatusUseCase } from './application/use-cases/update-order-status.usecase';
import { UpdateOrderPaymentStatusUseCase } from './application/use-cases/update-order-payment-status.usecase';
import { DeleteOrderUseCase } from './application/use-cases/delete-order.usecase';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Order', schema: OrderSchema }]),
  ],
  controllers: [OrdersController],
  providers: [
    { provide: 'IOrderRepository', useClass: OrderRepository },
    CreateOrderUseCase,
    FindAllOrdersUseCase,
    FindOrderByIdUseCase,
    FindOrdersByUserUseCase,
    UpdateOrderUseCase,
    UpdateOrderStatusUseCase,
    UpdateOrderPaymentStatusUseCase,
    DeleteOrderUseCase,
  ],
  exports: ['IOrderRepository'],
})
export class OrdersModule {}
