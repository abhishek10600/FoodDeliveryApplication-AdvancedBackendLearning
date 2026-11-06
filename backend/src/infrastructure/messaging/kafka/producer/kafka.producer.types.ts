import { KafkaMessage } from "../kafka.types.js"

export interface PublishOptions {
  topic: string
  message: KafkaMessage[]
  acks?: -1 | 0 | 1
  timeout?: number
  compression?: number
}

export interface KafkaProducer {
  public<T>(options: {
    topic: string
    message: KafkaMessage<T>
  }): Promise<void>

  publishBatch<T>(options: PublishOptions): Promise<void>

  disconnect(): Promise<void>;
}
