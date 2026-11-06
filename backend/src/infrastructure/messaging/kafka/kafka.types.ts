import type { Kafka, Producer, Consumer } from "kafkajs"

export type KafkaClient = Kafka

export interface KafkaConnectionState {
  connected: boolean;
  connecting: boolean;
  disconnecting: boolean
}

export interface KafkaResources {
  kafka: Kafka
  producer: Producer
  consumer: Map<string, Consumer>
}

export interface KafkaMessage<T = unknown> {
  id: string
  type: string
  version: number
  key: string
  timestamp: string
  correlationId?: string
  causationId?: string
  payload: T
}

export interface KafkaMessageHeaders {
  correlationId?: string
  causationId?: string
  eventType: string
  eventVersion: string
}
