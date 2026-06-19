import { Inject, Injectable } from '@nestjs/common';
import { Channel } from 'amqplib';
import { EventPublisher } from '../../application/ports/event-publisher.port';
import { IntegrationEvent } from '../../application/ports/integration-event';
import { getRabbitMqConfig } from './rabbitmq.config';
import { RABBITMQ_CHANNEL } from './rabbitmq.constants';

@Injectable()
export class RabbitMqEventPublisher implements EventPublisher {
  constructor(
    @Inject(RABBITMQ_CHANNEL)
    private readonly channel: Channel,
  ) {}

  async publish<TPayload>(event: IntegrationEvent<TPayload>): Promise<void> {
    const config = getRabbitMqConfig();

    const routingKey = `${event.name}.v${event.version}`;

    const messageBuffer = Buffer.from(JSON.stringify(event));

    const published = this.channel.publish(
      config.exchange,
      routingKey,
      messageBuffer,
      {
        persistent: true,
        contentType: 'application/json',
        messageId: event.eventId,
        timestamp: Date.now(),
        type: routingKey,
      },
    );

    if (!published) {
      // این یعنی internal buffer پر شده.
      // برای شروع فقط error می‌دهیم، بعداً بهترش می‌کنیم.
      throw new Error(`Failed to publish event: ${routingKey}`);
    }
  }
}
