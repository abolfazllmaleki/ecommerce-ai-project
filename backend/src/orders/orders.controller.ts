import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
  NotFoundException,
  Query,
} from '@nestjs/common';
import { OrdersService } from './orders.service';
import { Order, CreateOrderDto } from './schemas/order.schema';
// import { Roles } from 'src/auth/decorators/roles.decorator';
// import { UseGuards } from '@nestjs/common';
// import { RolesGuard } from 'src/auth/guards/roles.guard';
// import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
// import { UserRole } from 'src/users/schemas/user.schema';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  async create(@Body() createOrderDto: CreateOrderDto): Promise<Order> {
    return this.ordersService.create(createOrderDto);
  }

  @Get()
  async findAll(): Promise<Order[]> {
    return this.ordersService.findAll();
  }

  @Get('user/:userId')
  async findByUserId(@Param('userId') userId: string): Promise<Order[]> {
    return this.ordersService.findByUserId(userId);
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Order> {
    return this.ordersService.findOne(id);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateData: Partial<Order>,
  ): Promise<Order> {
    return this.ordersService.update(id, updateData);
  }

  @Put(':id/status')
  async updateStatus(
    @Param('id') id: string,
    @Body('status') status: string,
  ): Promise<Order> {
    return this.ordersService.updateStatus(id, status);
  }

  @Put(':id/payment-status')
  async updatePaymentStatus(
    @Param('id') id: string,
    @Body('paymentStatus') paymentStatus: string,
  ): Promise<Order> {
    return this.ordersService.updatePaymentStatus(id, paymentStatus);
  }

  @Delete(':id')
  async delete(@Param('id') id: string): Promise<{ message: string }> {
    await this.ordersService.delete(id);
    return { message: 'Order deleted successfully' };
  }
}