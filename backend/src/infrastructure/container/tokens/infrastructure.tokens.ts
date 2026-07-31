export const InfrastructureTokens = {
  Configuration: Symbol.for("Infrastructure.Configuration"),

  Logger: Symbol.for("Infrastructure.Logger"),

  PrismaClient: Symbol.for("Infrastructure.PrismaClient"),

  DatabaseService: Symbol.for("Infrastructure.DatabaseService"),

  RedisClient: Symbol.for("Infrastructure.RedisClient"),

  RedisService: Symbol.for("Infrastructure.RedisService"),

  CacheService: Symbol.for("Infrastructure.CacheService")

} as const
