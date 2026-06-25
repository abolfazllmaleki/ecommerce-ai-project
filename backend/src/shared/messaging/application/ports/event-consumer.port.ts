import { IntegrationEvent } from './integration-event';

export interface ConsumeOptions {
  queue: string;
  routingKeys: string[];
}

export type EventHandler<TPayload = unknown> = (
  event: IntegrationEvent<TPayload>,
) => Promise<void>;

export interface EventConsumer {
  consume<TPayload>(
    options: ConsumeOptions,
    handler: EventHandler<TPayload>,
  ): Promise<void>;
}

export const EVENT_CONSUMER = Symbol('EVENT_CONSUMER');
