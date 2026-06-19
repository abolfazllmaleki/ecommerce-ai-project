import { IntegrationEvent } from './integration-event';

export const EVENT_PUBLISHER = Symbol('EVENT_PUBLISHER');


export interface EventPublisher {
  publish<TPayload>(event: IntegrationEvent<TPayload>): Promise<void>;
}
