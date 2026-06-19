export interface IntegrationEvent<TPayload = unknown> {
  eventId: string;
  name: string;
  version: number;
  occurredAt: string;
  payload: TPayload;
}
