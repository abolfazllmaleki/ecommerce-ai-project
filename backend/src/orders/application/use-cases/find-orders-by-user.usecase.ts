import { Inject, Injectable } from '@nestjs/common';
import { IOrderRepository } from '../../domain/order.repository.port';
import { Order } from '../../domain/order.entity';

@Injectable()
export class FindOrdersByUserUseCase {
  constructor(@Inject('IOrderRepository') private readonly repo: IOrderRepository) {}

  async execute(userId: string): Promise<Order[]> {
    return this.repo.findByUserId(userId);
  }
}
