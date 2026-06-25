import { Inject, Injectable } from '@nestjs/common';
import { IOrderRepository } from '../../domain/order.repository.port';
import { Order } from '../../domain/order.entity';
import { CreateOrderDto } from '../../dto/create-order.dto';

import { EventPublisher } from '../../../shared/messaging/application/ports/event-publisher.port';
import { EVENT_PUBLISHER } from '../../../shared/messaging/application/ports/event-publisher.port';


export interface OrderCreatedPayload {
  orderId: any;
  userId: string;
  totalPrice: number;
}

@Injectable()
export class CreateOrderUseCase {
  constructor(
    @Inject('IOrderRepository')
    private readonly repo: IOrderRepository,

    @Inject(EVENT_PUBLISHER)
    private readonly eventPublisher: EventPublisher,
  ) {}

  async execute(dto: CreateOrderDto): Promise<Order> {
    const order = new Order({
      userId: dto.userId,
      products: dto.products,
      totalPrice: dto.totalPrice,
      shippingAddress: dto.shippingAddress,
      contactInfo: dto.contactInfo,
      paymentMethod: dto.paymentMethod,
    });
    

    const created = await this.repo.create(order);
    console.log('first')
    await this.eventPublisher.publish<OrderCreatedPayload>({
      eventId: crypto.randomUUID(),
      name: 'order.created',
      version: 1,
      occurredAt: new Date().toISOString(),
      payload: {
          orderId: created.id!,
          userId: created.userId,
        totalPrice: created.totalPrice,
      },
    });
    console.log('second:')

    return created;
  }
}
