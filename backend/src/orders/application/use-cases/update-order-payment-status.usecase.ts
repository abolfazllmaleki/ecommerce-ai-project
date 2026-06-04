import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { IOrderRepository } from '../../domain/order.repository.port';
import { Order } from '../../domain/order.entity';

@Injectable()
export class UpdateOrderPaymentStatusUseCase {
  constructor(@Inject('IOrderRepository') private readonly repo: IOrderRepository) {}

  async execute(id: string, paymentStatus: string): Promise<Order> {
    const current = await this.repo.findById(id);
    if (!current) throw new NotFoundException('Order not found');

    current.updatePaymentStatus(paymentStatus);
    const saved = await this.repo.update(current);
    if (!saved) throw new NotFoundException('Order not found');
    return saved;
  }
}
