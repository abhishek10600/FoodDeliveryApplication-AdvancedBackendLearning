import { injectable, inject } from "tsyringe"
import { InfrastructureTokens } from "../../container/index.js";
import { ClaimedOutboxEventsInput, CreateOutboxEventInput, OutboxClaimedEvent, OutboxTransactionClient } from "./outbox.types.js";
import { OutboxEventStatus, PrismaClient } from "../../../../generated/prisma/client.js";

@injectable()
export class OutboxRepository {
  constructor(

    @inject(InfrastructureTokens.PrismaClient)
    private readonly prisma: PrismaClient

  ) { }

  async create(input: CreateOutboxEventInput, tx: OutboxTransactionClient): Promise<void> {
    await tx.outboxEvent.create({
      data: {
        eventId: input.eventId,
        eventType: input.eventType,
        eventVersion: input.eventVersion,
        aggregateId: input.aggregateId,
        aggregateType: input.aggregateType,
        topic: input.topic,
        messageKey: input.messageKey,
        payload: input.payload,
        correlationId: input.correlationId,
        causationId: input.causationId,
        occurredAt: input.occurredAt
      }
    })
  }

  async claimBatch(input: ClaimedOutboxEventsInput): Promise<OutboxClaimedEvent[]> {
    const now = new Date()

    const leaseUntil = new Date(now.getTime() + input.leaseDurationMs)

    return this.prisma.$transaction(async (tx) => {
      const events = await tx.$queryRaw<OutboxClaimedEvent[]>`
              WITH candidates AS (
                SELECT id
                FROM outbox_events
                WHERE
                  (
                    (
                      status = 'PENDING'
                      AND next_attempt_at <= ${now}
                    )
                    OR
                    (
                      status = 'PROCESSING'
                      AND locked_until <= ${now}
                    )
                  )
                  AND attempts < max_attempts
                ORDER BY created_at ASC
                LIMIT ${input.batchSize}
                FOR UPDATE SKIP LOCKED
              )
              UPDATE outbox_events AS o
              SET
                status = 'PROCESSING',
                locked_by = ${input.workerId},
                locked_until = ${leaseUntil},
                attempts = o.attempts + 1
              FROM candidates
              WHERE o.id = candidates.id
              RETURNING
                o.id,
                o.event_id AS "eventId",
                o.event_type AS "eventType",
                o.event_version AS "eventVersion",
                o.aggregate_id AS "aggregateId",
                o.aggregate_type AS "aggregateType",
                o.topic,
                o.message_key AS "messageKey",
                o.payload,
                o.correlation_id AS "correlationId",
                o.causation_id AS "causationId",
                o.occurred_at AS "occurredAt",
                o.attempts,
                o.max_attempts AS "maxAttempts"
        `

      return events
    })
  }

  async markPublished(id: string, workerId: string): Promise<boolean> {
    const result = await this.prisma.outboxEvent.updateMany({
      where: {
        id,
        status: OutboxEventStatus.PROCESSING,
        lockedBy: workerId
      },
      data: {
        status: OutboxEventStatus.PUBLISHED,
        publishedAt: new Date(),
        lockedBy: null,
        lockedUntil: null,
        lastError: null
      }
    })

    return result.count === 1
  }

  async markFailed(
    id: string,
    workerId: string,
    error: string,
    attempts: number,
    maxAttempts: number
  ): Promise<void> {
    const terminal = attempts >= maxAttempts

    const delayMs = Math.min(1000 * 2 ** Math.min(attempts - 1, 10), 15 * 60 * 1000)

    const nextAttemptAt = new Date(Date.now() + delayMs)

    await this.prisma.outboxEvent.updateMany({
      where: {
        id,
        status: OutboxEventStatus.PROCESSING,
        lockedBy: workerId,
      },

      data: {
        status: terminal ? OutboxEventStatus.FAILED : OutboxEventStatus.PENDING,

        nextAttemptAt,
        lockedBy: null,
        lockedUntil: null,
        lastError: error.slice(0, 4000)
      }
    })
  }
}
