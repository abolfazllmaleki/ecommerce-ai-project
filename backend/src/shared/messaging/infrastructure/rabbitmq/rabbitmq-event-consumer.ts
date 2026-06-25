import { Inject, Injectable, Logger } from '@nestjs/common';
import { Channel, ConsumeMessage } from 'amqplib';

import {
  ConsumeOptions,
  EventConsumer,
  EventHandler,
} from '../../application/ports/event-consumer.port';
import { IntegrationEvent } from '../../application/ports/integration-event';
import { getRabbitMqConfig } from './rabbitmq.config';
import { RABBITMQ_CHANNEL } from './rabbitmq.constants';

@Injectable()
export class RabbitMqEventConsumer implements EventConsumer {
  private readonly logger = new Logger(RabbitMqEventConsumer.name);

  constructor(
    @Inject(RABBITMQ_CHANNEL)
    private readonly channel: Channel,
  ) {}

  async consume<TPayload>(
    options: ConsumeOptions,
    handler: EventHandler<TPayload>,
  ): Promise<void> {
    const config = getRabbitMqConfig();

    await this.channel.assertQueue(options.queue, {
      durable: true,
    });

    for (const routingKey of options.routingKeys) {
      await this.channel.bindQueue(
        options.queue,
        config.exchange,
        routingKey,
      );
    }

    await this.channel.prefetch(10);

    await this.channel.consume(options.queue, async (message) => {
      if (!message) return;

      await this.handleMessage(message, handler);
    });

    this.logger.log(
      `Started consuming queue "${options.queue}" with routing keys: ${options.routingKeys.join(', ')}`,
    );
  }

  private async handleMessage<TPayload>(
    message: ConsumeMessage,
    handler: EventHandler<TPayload>,
  ): Promise<void> {
    try {
      const rawMessage = message.content.toString('utf8');
      const event = JSON.parse(rawMessage) as IntegrationEvent<TPayload>;

      await handler(event);

      this.channel.ack(message);
    } catch (error) {
      const err = error as Error;

      this.logger.error(
        `Failed to consume RabbitMQ message: ${err.message}`,
        err.stack,
      );

      this.channel.nack(message, false, false);
    }
  }
}
