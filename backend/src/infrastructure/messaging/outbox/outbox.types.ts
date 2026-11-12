import { Prisma } from "../../../../generated/prisma/client.js"

export type OutboxTransactionClient = Prisma.TransactionClient

export interface CreateOutboxEventInput {
  eventId: string
  eventType: string
  eventVersion: number
  aggregateId: string
  aggregateType: string
  topic: string
  messageKey: string
  payload: Prisma.InputJsonValue
  correlationId: string
  causationId?: string
  occurredAt: Date
}

export interface OutboxClaimedEvent {
  id: string
  eventId: string
  eventType: string
  eventVersion: number
  aggregateId: string
  aggregateType: string
  topic: string
  messageKey: string
  payload: Prisma.JsonValue
  correlationId: string
  causationId: string | null
  occurredAt: Date
  attempts: number
  maxAttempts: number
}

export interface ClaimedOutboxEventsInput {
  workerId: string
  batchSize: number
  leaseDurationMs: number
}
