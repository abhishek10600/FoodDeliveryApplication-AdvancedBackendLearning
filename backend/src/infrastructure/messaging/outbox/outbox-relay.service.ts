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
  private loopPromise: Promise<void> | null = null

  private readonly batchSize = 50
  private readonly leaseDurationMs = 60_000

  constructor(
    private readonly repository: OutboxRepository,
    private readonly publisher: OutboxPublisher,

    @inject(KafkaTokens.Logger)
    private readonly logger: KafkaLogger
  ) {}

  start(): Promise<void> {

    if (this.loopPromise) {
      return this.loopPromise
    }

    this.running = true

    this.logger.info({
      workerId: this.workerId
    }, "Outbox relay started")

    this.loopPromise = this.runLoop().finally(() => {

      this.running = false

      this.logger.info({
        workerId: this.workerId
      }, "Outbox relay stopped")

      this.loopPromise = null
    })

    return this.loopPromise
  }

  async stop(): Promise<void> {

    if (!this.running) {
      return
    }

    this.logger.info({
      workerId: this.workerId
    }, "Stopping outbox relay")

    this.running = false

    // Wait for the current operation to finish.
    await this.loopPromise
  }

  private async runLoop(): Promise<void> {

    while (this.running) {

      try {

        const events = await this.repository.claimBatch({
          workerId: this.workerId,
          batchSize: this.batchSize,
          leaseDurationMs: this.leaseDurationMs
        })

        if (!this.running) {
          break
        }

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
          workerId: this.workerId
        }, "Outbox relay batch failed")

        if (this.running) {
          await this.sleep(3000)
        }
      }
    }
  }

  private async processEvent(
    event: OutboxClaimedEvent
  ): Promise<void> {

    try {

      await this.publisher.publish(event)

      const marked = await this.repository.markPublished(
        event.id,
        this.workerId
      )

      if (!marked) {

        this.logger.error({
          eventId: event.eventId,
          outboxId: event.id
        }, "Published event could not be marked as published")

        return
      }

      this.logger.info({
        eventId: event.id,
        eventType: event.eventType,
        topic: event.topic,
        attempts: event.attempts
      }, "Outbox event published")

    } catch (error) {

      const message = error instanceof Error
        ? error.message
        : String(error)

      await this.repository.markFailed(
        event.id,
        this.workerId,
        message,
        event.attempts,
        event.maxAttempts
      )

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
