import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
} from '@nestjs/common';
import { CreateOrderDto } from '../dto/create-order.dto';
import { CreateOrderUseCase } from '../application/use-cases/create-order.usecase';
import { FindAllOrdersUseCase } from '../application/use-cases/find-all-orders.usecase';
import { FindOrderByIdUseCase } from '../application/use-cases/find-order-by-id.usecase';
import { FindOrdersByUserUseCase } from '../application/use-cases/find-orders-by-user.usecase';
import { UpdateOrderUseCase } from '../application/use-cases/update-order.usecase';
import { UpdateOrderStatusUseCase } from '../application/use-cases/update-order-status.usecase';
import { UpdateOrderPaymentStatusUseCase } from '../application/use-cases/update-order-payment-status.usecase';
import { DeleteOrderUseCase } from '../application/use-cases/delete-order.usecase';

@Controller('orders')
export class OrdersController {
  constructor(
    private readonly createOrder: CreateOrderUseCase,
    private readonly findAllOrders: FindAllOrdersUseCase,
    private readonly findOrderById: FindOrderByIdUseCase,
    private readonly findOrdersByUser: FindOrdersByUserUseCase,
    private readonly updateOrder: UpdateOrderUseCase,
    private readonly updateOrderStatus: UpdateOrderStatusUseCase,
    private readonly updateOrderPaymentStatus: UpdateOrderPaymentStatusUseCase,
    private readonly deleteOrder: DeleteOrderUseCase,
  ) {}

  @Post()
  async create(@Body() dto: CreateOrderDto) {
    const order = await this.createOrder.execute(dto);
    return order.toPlainObject();
  }

  @Get()
  async findAll() {
    const orders = await this.findAllOrders.execute();
    return orders.map(o => o.toPlainObject());
  }

  @Get('user/:userId')
  async findByUserId(@Param('userId') userId: string) {
    const orders = await this.findOrdersByUser.execute(userId);
    return orders.map(o => o.toPlainObject());
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const order = await this.findOrderById.execute(id);
    return order.toPlainObject();
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() updateData: Record<string, unknown>) {
    const order = await this.updateOrder.execute(id, updateData);
    return order.toPlainObject();
  }

  @Put(':id/status')
  async updateStatus(@Param('id') id: string, @Body('status') status: string) {
    const order = await this.updateOrderStatus.execute(id, status);
    return order.toPlainObject();
  }

  @Put(':id/payment-status')
  async updatePaymentStatus(
    @Param('id') id: string,
    @Body('paymentStatus') paymentStatus: string,
  ) {
    const order = await this.updateOrderPaymentStatus.execute(id, paymentStatus);
    return order.toPlainObject();
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    await this.deleteOrder.execute(id);
    return { message: 'Order deleted successfully' };
  }
}
