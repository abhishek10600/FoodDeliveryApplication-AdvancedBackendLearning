export const KafkaTokens = {
  Connection: Symbol.for("KafkaConnection"),
  Config: Symbol.for("KafkaConfig"),
  Logger: Symbol.for("KafkaLogger"),
  KafkaTopicAdminService: Symbol.for("KafkaTopicAdminService"),
  Producer: Symbol.for("KafkaProducer"),
} as const
