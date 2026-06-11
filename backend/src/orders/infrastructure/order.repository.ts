import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { IOrderRepository } from '../domain/order.repository.port';
import { Order as OrderEntity } from '../domain/order.entity';
import { Order } from '../schemas/order.schema';
import { OrderMapper } from './order.mapper';

@Injectable()
export class OrderRepository implements IOrderRepository {
  constructor(
    @InjectModel('Order')
    private readonly model: Model<Order>,
  ) {}

  async create(order: OrderEntity): Promise<OrderEntity> {
    const data = OrderMapper.toPersistence(order);
    const created = new this.model(data);
    const saved = await created.save();
    return OrderMapper.toDomain(saved);
  }

  async findAll(): Promise<OrderEntity[]> {
    const docs = await this.model.find().sort({ orderDate: -1 }).exec();
    return docs.map(doc => OrderMapper.toDomain(doc));
  }

  async findById(id: string): Promise<OrderEntity | null> {
    if (!Types.ObjectId.isValid(id)) return null;
    const doc = await this.model.findById(id).exec();
    return doc ? OrderMapper.toDomain(doc) : null;
  }

  async findByUserId(userId: string): Promise<OrderEntity[]> {
    const docs = await this.model.find({ userId }).sort({ orderDate: -1 }).exec();
    return docs.map(doc => OrderMapper.toDomain(doc));
  }

  async update(order: OrderEntity): Promise<OrderEntity | null> {
    if (!order.id || !Types.ObjectId.isValid(order.id)) return null;

    const updated = await this.model
      .findByIdAndUpdate(order.id, { $set: OrderMapper.toPersistence(order) }, { new: true })
      .exec();

    return updated ? OrderMapper.toDomain(updated) : null;
  }

  async delete(id: string): Promise<boolean> {
    if (!Types.ObjectId.isValid(id)) return false;
    const result = await this.model.findByIdAndDelete(id).exec();
    return !!result;
  }
}
