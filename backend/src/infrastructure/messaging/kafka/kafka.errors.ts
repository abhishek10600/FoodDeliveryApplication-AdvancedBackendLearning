export class KafkaConnectionError extends Error {
  constructor(message: string, options?: ErrorOptions) {
    super(message)

    this.name = "KafkaConnectionError";
  }
}

export class KafkaNotConnectedError extends Error {
  constructor(message = "Kafka is not connected") {
    super(message)

    this.name = "KafkaNotOConnectedError";
  }
}
