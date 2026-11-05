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
