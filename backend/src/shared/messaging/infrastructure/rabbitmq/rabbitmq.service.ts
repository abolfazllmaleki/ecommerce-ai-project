import { Inject, Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { EVENT_PUBLISHER } from '../../application/ports/event-publisher.port';
import { EventPublisher } from '../../application/ports/event-publisher.port';



@Injectable()
export class CreateOrderService {
  constructor(
    @Inject(EVENT_PUBLISHER)
    private readonly eventPublisher: EventPublisher,
  ) {}

  async execute() {
    // اینجا فرضاً order در MongoDB ذخیره شده

    await this.eventPublisher.publish({
      eventId: randomUUID(),
      name: 'order.created',
      version: 1,
      occurredAt: new Date().toISOString(),
      payload: {
        orderId: randomUUID(),
        userId: randomUUID(),
        totalAmount: 250000,
        currency: 'IRR',
      },
    });

    return {
      message: 'Order created and event published',
    };
  }
}
