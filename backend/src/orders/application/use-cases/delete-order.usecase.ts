import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { IOrderRepository } from '../../domain/order.repository.port';

@Injectable()
export class DeleteOrderUseCase {
  constructor(@Inject('IOrderRepository') private readonly repo: IOrderRepository) {}

  async execute(id: string): Promise<void> {
    const deleted = await this.repo.delete(id);
    if (!deleted) throw new NotFoundException('Order not found');
  }
}
