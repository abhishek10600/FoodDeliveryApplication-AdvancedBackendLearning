import type { KafkaMessage } from "../kafka.types.js"

export interface KafkaConsumerOptions {
  groupId: string
  topics: string[]
  fromBeginning?: boolean
}

export interface KafkaMessageContext {
  topic: string
  partition: number
  offset: string
  key: string | null
}

export type KafkaMessageHandler<T = unknown> = (
  message: KafkaMessage<T>,
  context: KafkaMessageContext,
) => Promise<void>


export interface KafkaConsumer {
  start<T>(
    options: KafkaConsumerOptions,
    handler: KafkaMessageHandler<T>
  ): Promise<void>

  stop(): Promise<void>
}
