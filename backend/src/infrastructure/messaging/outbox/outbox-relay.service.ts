import { randomUUID } from "node:crypto"
import { injectable, inject } from "tsyringe"
import { OutboxRepository } from "./outbox.repository.js"
import { OutboxPublisher } from "./outbox.publisher.js"
import { OutboxClaimedEvent } from "./outbox.types.js"
import { KafkaTokens } from "../kafka/kafka.tokens.js"
import type { KafkaLogger } from "../kafka/kafka.connection.js"

@injectable()
export class OutboxRelayService {

  private readonly workerId = randomUUID()
  private running = false
  private readonly batchSize = 50
  private readonly leaseDurationsMs = 60_000

  constructor(

    private readonly repository: OutboxRepository,
    private readonly publisher: OutboxPublisher,

    @inject(KafkaTokens.Logger)
    private readonly logger: KafkaLogger
  ) { }

  async start(): Promise<void> {

      if (this.running) {
        return
      }

      this.logger.info({
        workerId: this.workerId
      }, "Outbox relay started")

    while (this.running) {
      try {

        const events = await this.repository.claimBatch({
          workerId: this.workerId,
          batchSize: this.batchSize,
          leaseDurationMs: this.leaseDurationsMs
        })

        if (events.length === 0) {
          await this.sleep(1000)

          continue
        }

        for (const event of events) {
          if (!this.running) {
            break
          }

          await this.processEvent(event)
        }

      } catch (error) {

        this.logger.error({
          error,
          workerId: this.workerId,
        }, "Outbox relay batch failed")

        await this.sleep(3000)
      }
    }

    this.logger.info({
      workerId: this.workerId
    }, "Outbox relay stopped")
  }

  async stop(): Promise<void> {

    this.running = false
  }

  private async processEvent(event: OutboxClaimedEvent): Promise<void> {
    try {

      await this.publisher.publish(event)

      const marked = await this.repository.markPublished(event.id, this.workerId)

      if (!marked) {
        this.logger.error({
          eventId: event.eventId,
          outboxId: event.id
        }, "Published event could not be marked as published")
      }

      this.logger.info({
        eventId: event.id,
        eventType: event.eventType,
        topic: event.topic,
        attempts: event.attempts
      }, "Outbox event published")

    } catch (error) {
      const message = error instanceof Error ? error.message : String(error)

      await this.repository.markFailed(
        event.id,
        this.workerId,
        message,
        event.attempts,
        event.maxAttempts)

      this.logger.error({
        eventId: event.eventId,
        eventType: event.eventType,
        attempts: event.attempts,
        error
      }, "Outbox event publication failed")
    }
  }

  private sleep(ms: number): Promise<void> {
    return new Promise((resolve) => {
      setTimeout(resolve, ms)
    })
  }
}
