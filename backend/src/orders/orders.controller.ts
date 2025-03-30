import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
  NotFoundException,
} from '@nestjs/common';
import { OrdersService } from './orders.service';
import { Order } from './schemas/order.schema';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  async create(@Body() order: Order): Promise<Order> {
    return this.ordersService.create(order);
  }

  @Get()
  async findAll(): Promise<Order[]> {
    return this.ordersService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Order> {
    const order = await this.ordersService.findOne(id);
    if (!order) {
      throw new NotFoundException('سفارش مورد نظر یافت نشد');
    }
    return order;
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() order: Order): Promise<Order> {
    const updatedOrder = await this.ordersService.update(id, order);
    if (!updatedOrder) {
      throw new NotFoundException('سفارش مورد نظر یافت نشد');
    }
    return updatedOrder;
  }

  @Delete(':id')
  async delete(@Param('id') id: string): Promise<{ message: string }> {
    const deletedOrder = await this.ordersService.delete(id);
    if (!deletedOrder) {
      throw new NotFoundException('سفارش مورد نظر یافت نشد');
    }
    return { message: 'سفارش با موفقیت حذف شد' };
  }
}
