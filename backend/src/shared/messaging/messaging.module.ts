import { Module } from '@nestjs/common';

import { EVENT_CONSUMER } from './application/ports/event-consumer.port';
import { EVENT_PUBLISHER } from './application/ports/event-publisher.port';
import { RabbitMqEventConsumer } from './infrastructure/rabbitmq/rabbitmq-event-consumer';
import { RabbitMqEventPublisher } from './infrastructure/rabbitmq/rabbitmq-event-publisher';
import { RabbitMqModule } from './infrastructure/rabbitmq/rabbitmq.module';

@Module({
  imports: [RabbitMqModule],
  providers: [
    RabbitMqEventPublisher,
    RabbitMqEventConsumer,
    {
      provide: EVENT_PUBLISHER,
      useExisting: RabbitMqEventPublisher,
    },
    {
      provide: EVENT_CONSUMER,
      useExisting: RabbitMqEventConsumer,
    },
  ],
  exports: [EVENT_PUBLISHER, EVENT_CONSUMER],
})
export class MessagingModule {}
