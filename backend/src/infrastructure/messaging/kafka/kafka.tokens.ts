export const KafkaTokens = {
  Connection: Symbol.for("KafkaConnection"),
  Client: Symbol.for("KafkaClient"),
  Producer: Symbol.for("KafkaProducer"),
  Config: Symbol.for("KafkaConfig"),
  Logger: Symbol.for("KafkaLogger"),
} as const
