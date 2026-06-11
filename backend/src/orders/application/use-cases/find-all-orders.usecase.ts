import { Inject, Injectable } from '@nestjs/common';
import { IOrderRepository } from '../../domain/order.repository.port';
import { Order } from '../../domain/order.entity';

@Injectable()
export class FindAllOrdersUseCase {
  constructor(@Inject('IOrderRepository') private readonly repo: IOrderRepository) {}

  async execute(): Promise<Order[]> {
    return this.repo.findAll();
  }
}
