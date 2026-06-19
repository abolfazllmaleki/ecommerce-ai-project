import { Module, OnApplicationShutdown, Inject } from '@nestjs/common';
import * as amqp from 'amqplib';
import type { Channel, ChannelModel } from 'amqplib';

import { getRabbitMqConfig } from './rabbitmq.config';
import {
  RABBITMQ_CHANNEL,
  RABBITMQ_CONNECTION,
} from './rabbitmq.constants';

@Module({
  providers: [
    {
      provide: RABBITMQ_CONNECTION,
      useFactory: async (): Promise<ChannelModel> => {
        const config = getRabbitMqConfig();

        const connection = await amqp.connect(config.url);

        return connection;
      },
    },
    {
      provide: RABBITMQ_CHANNEL,
      useFactory: async (connection: ChannelModel): Promise<Channel> => {
        const config = getRabbitMqConfig();

        const channel = await connection.createChannel();

        await channel.assertExchange(config.exchange, 'topic', {
          durable: true,
        });

        return channel;
      },
      inject: [RABBITMQ_CONNECTION],
    },
  ],
  exports: [RABBITMQ_CONNECTION, RABBITMQ_CHANNEL],
})
export class RabbitMqModule implements OnApplicationShutdown {
  constructor(
    @Inject(RABBITMQ_CONNECTION)
    private readonly connection: ChannelModel,
  ) {}

  async onApplicationShutdown() {
    await this.connection.close();
  }
}
