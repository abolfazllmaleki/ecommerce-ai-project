import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Order, CreateOrderDto } from './schemas/order.schema';

@Injectable()
export class OrdersService {
  constructor(
    @InjectModel('Order') private readonly orderModel: Model<Order>,
  ) {}

  async create(createOrderDto: CreateOrderDto): Promise<Order> {
    const newOrder = new this.orderModel(createOrderDto);
    return newOrder.save();
  }

  async findAll(): Promise<Order[]> {
    return this.orderModel.find().sort({ orderDate: -1 }).exec();
  }

  async findOne(id: string): Promise<Order> {
    const order = await this.orderModel.findById(id).exec();
    if (!order) {
      throw new NotFoundException('Order not found');
    }
    return order;
  }

  async findByUserId(userId: string): Promise<Order[]> {
    return this.orderModel.find({ userId }).sort({ orderDate: -1 }).exec();
  }

  async update(id: string, updateData: Partial<Order>): Promise<Order> {
    const updatedOrder = await this.orderModel
      .findByIdAndUpdate(id, updateData, { new: true })
      .exec();
    
    if (!updatedOrder) {
      throw new NotFoundException('Order not found');
    }
    
    return updatedOrder;
  }

  async updateStatus(id: string, status: string): Promise<Order> {
    const updateData: Partial<Order> = { status };
    
    // Set appropriate dates based on status changes
    if (status === 'shipped') {
      updateData.shippedDate = new Date();
    } else if (status === 'delivered') {
      updateData.deliveredDate = new Date();
    }
    
    return this.update(id, updateData);
  }

  async updatePaymentStatus(id: string, paymentStatus: string): Promise<Order> {
    return this.update(id, { paymentStatus });
  }

  async delete(id: string): Promise<Order> {
    const deletedOrder = await this.orderModel.findByIdAndDelete(id).exec();
    
    if (!deletedOrder) {
      throw new NotFoundException('Order not found');
    }
    
    return deletedOrder;
  }
}