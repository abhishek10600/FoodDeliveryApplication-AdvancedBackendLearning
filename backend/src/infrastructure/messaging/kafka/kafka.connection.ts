import { injectable, inject } from "tsyringe"
import { Kafka, logLevel, type Producer } from "kafkajs"
import type { KafkaConnectionConfig } from "./kafka.config.js"
import { KafkaConnectionError, KafkaNotConnectedError } from "./kafka.errors.js"
import { KafkaTokens } from "./kafka.tokens.js"

export interface KafkaLogger {
  info: (obj: object, message?: string) => void,
  warn: (obj: object, message?: string) => void,
  error: (obj: object, message?: string)=> void
}

@injectable()
export class KafkaConnectionService {
  private kafka: Kafka | null = null
  private producer: Producer | null = null

  private connected = false
  private disconnecting = false

  private connectPromise: Promise<void> | null = null
  private disconnectPromise: Promise<void> | null = null

  constructor(

    @inject(KafkaTokens.Config)
    private readonly config: KafkaConnectionConfig,

    @inject(KafkaTokens.Logger)
    private readonly logger: KafkaLogger

  ) { }

  private validateConfiguration(): void {
    if (!this.config.clientId) {
      throw new KafkaConnectionError("Kafka client ID is required")
    }

    if (!this.config.brokers.length || this.config.brokers.some((broker) => !broker)) {
      throw new KafkaConnectionError("At least one valid Kafka broker is required")
    }
  }

  private async cleanupFailedConnection(): Promise<void> {
    try {
      if (this.producer) {
        await this.producer.disconnect()
      }
    } catch (cleanupError) {
      this.logger.error(
        {
          err: cleanupError
        },
        "Kafka cleanup failed after connection error"
      )
    } finally {
      this.producer = null
      this.kafka = null
      this.connected = false
    }
  }

  private async closeConnection(): Promise<void> {
    this.disconnecting = true

    try {
      if (this.producer) {
        await this.producer.disconnect()

        this.logger.info({}, "Kafka producer disconnected")
      }
    } catch (error) {
      this.logger.error(
        {
          err: error
        },
        "Error while disconnecting Kafka producer"
      )

      throw new KafkaConnectionError("Failed to disconnect Kafka producer", { cause: error })

    } finally {
      this.producer = null
      this.kafka = null
      this.connected = false
      this.disconnecting = false
    }
  }

  private async establishConnection(): Promise<void> {
    try {
      this.validateConfiguration();

      this.logger.info(
        { brokers: this.config.brokers },
        "Initializing Kafka client"
      )

      this.kafka = new Kafka({
        clientId: this.config.clientId,
        brokers: this.config.brokers,

        connectionTimeout: this.config.connectionTimeout,
        requestTimeout: this.config.requestTimeout,

        retry: {
          initialRetryTime: this.config.retryInitialRetryTime,
          maxRetryTime: this.config.retryMaxRetryTime,
          retries: this.config.retryRetries
        },

        logLevel: logLevel.NOTHING
      })

      this.producer = this.kafka.producer({
        allowAutoTopicCreation: false,
        idempotent: true,
        maxInFlightRequests: 5
      })

      await this.producer.connect()

      this.connected = true

      this.logger.info(
        {
          clientId: this.config.clientId,
          brokers: this.config.brokers
        },
        "Kafka producer connected successfully"
      )

    } catch (error) {
      await this.cleanupFailedConnection()

      this.logger.error({
        err: error,
      },
      "Failed to establish Kafka connection"
      )

      throw new KafkaConnectionError("Failed to establish Kafka connection",
      { cause: error},
      )
    }
  }

  async connect(): Promise<void> {

    if (this.connected) {
      this.logger.info({}, "Kafka is already connected")

      return
    }

    // Prevent multiple simultaneous connection attempts
    if (this.connectPromise) {
      return this.connectPromise
    }

    if (this.disconnecting) {
      throw new KafkaConnectionError("Connot connect Kafka while disconnecting")
    }

    this.connectPromise = this.establishConnection();

    try {
      await this.connectPromise
    } finally {
      this.connectPromise = null
    }

  }

  async disconnect(): Promise<void> {
    if (this.disconnectPromise) {
      return this.disconnectPromise
    }

    if (this.connectPromise) {
      await this.connectPromise.catch(()=> undefined)
    }

    if (!this.kafka && !this.producer) {
      return;
    }

    this.disconnectPromise = this.closeConnection()

    try {
      await this.disconnectPromise
    } finally {
      this.disconnectPromise = null
    }
  }

  getClient(): Kafka {
    if (!this.kafka) {
      throw new KafkaNotConnectedError("Kafka client has not been initialized")
    }

    return this.kafka
  }

  getProducer(): Producer {
    if (!this.connected || !this.producer) {
      throw new KafkaNotConnectedError("Kafka producer is not connected")
    }

    return this.producer
  }

  isConnected(): boolean {
    return this.connected
  }
}
