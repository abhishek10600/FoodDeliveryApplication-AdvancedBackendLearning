import { injectable, inject } from "tsyringe"
import { KafkaTokens } from "../kafka.tokens.js";
import { KafkaConnectionService, type KafkaLogger } from "../kafka.connection.js";
import { KafkaPartitionUpdate, KafkaTopicConfig, KafkaTopicDescription } from "./kafka.topic-admin.types.js";
import { KafkaConnectionError } from "../kafka.errors.js";

@injectable()
export class KafkaTopicAdminService {
  constructor(

    @inject(KafkaTokens.Connection)
    private readonly connection: KafkaConnectionService,

    @inject(KafkaTokens.Logger)
    private readonly logger: KafkaLogger

  ) { }

  async createTopic(options: KafkaTopicConfig): Promise<boolean> {
    if (!options.name.trim()) {
      throw new KafkaConnectionError("Kafka topic name cannot be empty")
    }

    const numPartitions = options.numPartitions ?? 3
    const replicationFactor = options.replicationFactor ?? 1

    if (!Number.isInteger(numPartitions) || numPartitions < 1) {
      throw new KafkaConnectionError("Kafka topic must have at least on partition")
    }

    if (!Number.isInteger(replicationFactor) || replicationFactor < 1) {
      throw new KafkaConnectionError("Kafka replication factor must be at least one")
    }

    try {
      const admin = this.connection.getAdmin()

      const created = await admin.createTopics({
        topics: [
          {
            topic: options.name,
            numPartitions,
            replicationFactor,
            configEntries: options.configEntries
          }
        ],
        waitForLeaders: true
      })

      if (created) {
        this.logger.info({
          topic: options.name,
          numPartitions,
          replicationFactor
        },
          "Kafka topic created successfully")
      } else {
        this.logger.info({ topic: options.name }, "Kafka topic already exists")
      }

      return created

    } catch (error) {
      this.logger.error({
        err: error,
        topic: options.name
      },
      "Failed to create Kafka topic"
      )

      throw new KafkaConnectionError(`Failed to create Kafka topic: ${options.name}`, {cause: error})
    }
  }

  async deleteTopics(topics: string[]): Promise<void> {
    if (topics.length === 0) {
      throw new KafkaConnectionError("At least one topic is required for deletion")
    }

    try {

      await this.connection.getAdmin().deleteTopics({
        topics,
        timeout: 10000
      })

      this.logger.info({topics}, "Kafka topics deleted successfully")

    } catch (error) {

      this.logger.error({
        err: error,
        topics
      },
      "Failed to delete kafka topics"
      )

      throw new KafkaConnectionError("Failed to delete Kafka topics", {cause: error})
    }
  }

  async listTopics(): Promise<string[]> {
    try {

      const topics = await this.connection.getAdmin().listTopics()

      this.logger.info({
        topicsCount: topics.length
      },
      "Kafka topics retrieved successfully"
      )

      return topics

    } catch (error) {
      this.logger.error({ err: error }, "Failed to list Kafka topics")

      throw new KafkaConnectionError("Failed to list Kafka topics", { cause: error })
    }
  }

  async topicExists(topic: string): Promise<boolean> {

    if (!topic.trim()) {
      throw new KafkaConnectionError("Kafka topic name cannot be empty")
    }

    try {
      const topics = await this.listTopics()

      return topics.includes(topic)
    } catch (error) {
      this.logger.error({
        err: error,
        topic
      }, "Failed to check Kafka topic existence")

      throw error
    }
  }

  async describeTopic(topic: string): Promise<KafkaTopicDescription> {
    if (!topic.trim()) {
      throw new KafkaConnectionError("Kafka topic name cannot be emoty")
    }

    try {

      const metadata = await this.connection.getAdmin().fetchTopicMetadata({
        topics: [topic]
      })

      const topicMetadata = metadata.topics.find(item => item.name === topic)

      if (!topicMetadata) {
        throw new KafkaConnectionError(`Kafka topic not found: ${topic}`)
      }

      const result: KafkaTopicDescription = {
        name: topic,

        partitions: topicMetadata.partitions.map(partition => ({
          partitionId: partition.partitionId,
          leader: partition.leader,
          replicas: partition.replicas,
          isr: partition.isr
        }))
      }

      return result

    } catch (error) {
      this.logger.error({
        err: error,
        topic
      }, "Failed to describe Kafka topic")

      if (error instanceof KafkaConnectionError) {
        throw error
      }

      throw new KafkaConnectionError(`Failed to describe Kafka topic: ${topic}`, { cause: error})
    }
  }

  async increasePartitions(options: KafkaPartitionUpdate): Promise<void> {

    if (!options.topic.trim()) {
      throw new KafkaConnectionError("Kafka topic name cannot be empty")
    }

    if (!Number.isInteger(options.count) || options.count < 1) {
      throw new KafkaConnectionError("Partition count must be a positive integer")
    }

    try {

      await this.connection.getAdmin().createPartitions({
        topicPartitions: [
          {
            topic: options.topic,
            count: options.count
          }
        ],
        validateOnly: false
      })

      this.logger.info({
        topic: options.topic,
        partitionCount: options.count
      }, "Kafka topic partitions updated successfully")

    } catch (error) {

      this.logger.error({
        err: error,
        topic: options.topic,
        partitionCount: options.count
      }, "Failed to update Kafka topic partitions")

      throw new KafkaConnectionError(`Failed to update partitions for topic: ${options.topic}`, { cause: error})
    }
  }
}
