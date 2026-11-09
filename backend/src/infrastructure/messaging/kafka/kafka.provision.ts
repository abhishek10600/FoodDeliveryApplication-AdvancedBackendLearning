import "reflect-metadata";

import { container } from "tsyringe";
import { registerInfrastructure } from "../../container/modules/infrastructure.js";

import { KafkaConnectionService } from "./kafka.connection.js";
import { KafkaTopicAdminService } from "./admin/kafka.topic-admin.js";
import { KafkaTokens } from "./kafka.tokens.js";

async function provisionKafkaTopics(): Promise<void> {

  registerInfrastructure();

  console.log(
    "Kafka Config registered:",
    container.isRegistered(KafkaTokens.Config)
  );

  const kafkaConnection = container.resolve<KafkaConnectionService>(KafkaTokens.Connection);

  try {

    console.log("Connecting to Kafka...");

    await kafkaConnection.connect();
    await kafkaConnection.connectAdmin();

    const topicAdmin = container.resolve(KafkaTopicAdminService);

    console.log("Provisioning Kafka topics...");

    await topicAdmin.createTopic({
      name: "foodflow.test",
      numPartitions: 1,
      replicationFactor: 1
    });

    await topicAdmin.createTopic({
      name: "foodflow.orders",
      numPartitions: 3,
      replicationFactor: 1,
      configEntries: [
        {
          name: "retention.ms",
          value: "604800000"
        },
        {
          name: "cleanup.policy",
          value: "delete"
        }
      ]
    });

    console.log("Kafka topics provisioned successfully");

  } catch (error) {

    console.error("Kafka topic provision failed:", error);

    process.exitCode = 1;

  } finally {

    await kafkaConnection.disconnect();

  }
}

await provisionKafkaTopics();
