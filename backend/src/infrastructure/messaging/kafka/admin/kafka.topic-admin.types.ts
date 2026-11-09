export interface KafkaTopicConfig {
  name: string
  numPartitions?: number
  replicationFactor?: number
  configEntries?: {
    name: string
    value: string
    }[]
}


export interface KafkaTopicDescription {
  name: string
  partitions: {
    partitionId: number
    leader: number
    replicas: number[]
    isr: number[]
    }[]
}

export interface KafkaPartitionUpdate {
  topic: string
  count: number
}
