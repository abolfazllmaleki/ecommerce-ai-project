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
    const created = new this.model(PaymentMapper.toPersistence(payment));
    const saved = await created.save();

    return PaymentMapper.toDomain(saved);
  }

  async update(payment: PaymentEntity): Promise<PaymentEntity> {
    const updated = await this.model.findByIdAndUpdate(
      payment.id,
      PaymentMapper.toPersistence(payment),
      { new: true },
    );

    if (!updated) {
      throw new Error('Payment update failed');
    }

    return PaymentMapper.toDomain(updated);
  }

  async findById(id: string): Promise<PaymentEntity | null> {
    const payment = await this.model.findById(id);

    return payment ? PaymentMapper.toDomain(payment) : null;
  }

  async findByAuthority(authority: string): Promise<PaymentEntity | null> {
    const payment = await this.model.findOne({ authority });

    return payment ? PaymentMapper.toDomain(payment) : null;
  }

  async findActiveByOrderId(orderId: string): Promise<PaymentEntity | null> {
    const payment = await this.model
      .findOne({
        orderId,
        status: { $in: ['pending', 'initiated', 'verifying'] },
      })
      .sort({ createdAt: -1 });

    return payment ? PaymentMapper.toDomain(payment) : null;
  }

  async acquireForVerification(authority: string): Promise<PaymentEntity | null> {
    const payment = await this.model.findOneAndUpdate(
      {
        authority,
        status: 'initiated',
        $or: [
          { expiresAt: { $exists: false } },
          { expiresAt: null },
          { expiresAt: { $gt: new Date() } },
        ],
      },
      {
        $set: {
          status: 'verifying',
        },
      },
      {
        new: true,
      },
    );

    return payment ? PaymentMapper.toDomain(payment) : null;
  }
}
