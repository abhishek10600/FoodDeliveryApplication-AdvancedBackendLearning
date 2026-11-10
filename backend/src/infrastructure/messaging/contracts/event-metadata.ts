export interface EventMetaData {
  id: string
  eventType: string
  eventVersion: number
  occurredAt: string
  producer: string
  correlationId: string
  causationId: string | null
}
