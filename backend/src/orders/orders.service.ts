import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Order } from './schemas/order.schema';

@Injectable()
export class OrdersService {
  constructor(
    @InjectModel('Order') private readonly orderModel: Model<Order>,
  ) {}

  async create(order: Order): Promise<Order> {
    const newOrder = new this.orderModel(order);
    return newOrder.save();
  }

  async findAll(): Promise<Order[]> {
    return this.orderModel.find().exec();
  }

  async findOne(id: string): Promise<Order | null> {
    // <-- اضافه کردن null
    return this.orderModel.findById(id).exec();
  }

  async update(id: string, order: Order): Promise<Order | null> {
    // <-- اضافه کردن null
    return this.orderModel.findByIdAndUpdate(id, order, { new: true }).exec();
  }

  async delete(id: string): Promise<Order | null> {
    // <-- تغییر متد به findByIdAndDelete
    return this.orderModel.findByIdAndDelete(id).exec();
  }
}
