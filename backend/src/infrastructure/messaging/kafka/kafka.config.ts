import { env } from "../../../config/env.config.js"

export interface KafkaConnectionConfig {
  clientId: string
  brokers: string[]
  connectionTimeout: number
  requestTimeout: number
  retryInitialRetryTime: number
  retryMaxRetryTime: number
  retryRetries: number
}

export const kafkaConfig: KafkaConnectionConfig = {
  clientId: env.KAFKA_CLIENT_ID ?? "backend",

  brokers: (env.KAFKA_BROKERS ?? "localhost:9092").split(",").map((broker) => broker.trim()).filter(Boolean),

  connectionTimeout: 10000,

  requestTimeout: 30000,

  retryInitialRetryTime: 300,

  retryMaxRetryTime: 30000,

  retryRetries: 8

}
