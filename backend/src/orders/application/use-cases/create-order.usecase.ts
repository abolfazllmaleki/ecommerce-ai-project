import { Inject, Injectable } from '@nestjs/common';
import { IOrderRepository } from '../../domain/order.repository.port';
import { Order } from '../../domain/order.entity';
import { CreateOrderDto } from '../../dto/create-order.dto';

@Injectable()
export class CreateOrderUseCase {
  constructor(@Inject('IOrderRepository') private readonly repo: IOrderRepository) {}

  async execute(dto: CreateOrderDto): Promise<Order> {
    const order = new Order({
      userId: dto.userId,
      products: dto.products,
      totalPrice: dto.totalPrice,
      shippingAddress: dto.shippingAddress,
      contactInfo: dto.contactInfo,
      paymentMethod: dto.paymentMethod,
    });
    return this.repo.create(order);
  }
}
