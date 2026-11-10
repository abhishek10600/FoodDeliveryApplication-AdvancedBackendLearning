export interface DomainEvent<TPayload = unknown> {
  readonly eventId: string
  readonly eventType: string
  readonly aggregateId: string
  readonly occurredAt: Date
  readonly payload: TPayload
}
