import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { IPaymentRepository } from '../domain/payment.repository.port';
import { Payment as PaymentEntity } from '../domain/payment.entity';
import { Payment } from '../schemas/payment.schema';
import { PaymentMapper } from './payment.mapper';

@Injectable()
export class PaymentRepository implements IPaymentRepository {
  constructor(
    @InjectModel('Payment')
    private readonly model: Model<Payment>,
  ) {}

  async create(payment: PaymentEntity): Promise<PaymentEntity> {
    const data = PaymentMapper.toPersistence(payment);
    const created = new this.model(data);
    const saved = await created.save();
    return PaymentMapper.toDomain(saved);
  }

  async update(payment: PaymentEntity): Promise<PaymentEntity> {
    const data = PaymentMapper.toPersistence(payment);

    const updated = await this.model.findByIdAndUpdate(
      payment.id,
      data,
      { new: true }
    );

    return PaymentMapper.toDomain(updated);
  }

  async findById(id: string): Promise<PaymentEntity | null> {
    const payment = await this.model.findById(id);

    if (!payment) return null;

    return PaymentMapper.toDomain(payment);
  }

  async findByAuthority(authority: string): Promise<PaymentEntity | null> {
    const payment = await this.model.findOne({ authority });

    if (!payment) return null;

    return PaymentMapper.toDomain(payment);
  }
}
