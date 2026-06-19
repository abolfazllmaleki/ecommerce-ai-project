import { Module } from '@nestjs/common';
import { EVENT_PUBLISHER } from './application/ports/event-publisher.port';
import { RabbitMqModule } from './infrastructure/rabbitmq/rabbitmq.module';
import { RabbitMqEventPublisher } from './infrastructure/rabbitmq/rabbitmq-event-publisher';

@Module({
  imports: [RabbitMqModule],
  providers: [
    RabbitMqEventPublisher,
    {
      provide: EVENT_PUBLISHER,
      useExisting: RabbitMqEventPublisher,
    },
  ],
  exports: [EVENT_PUBLISHER],
})
export class MessagingModule {}
