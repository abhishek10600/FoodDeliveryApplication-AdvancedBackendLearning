export const InfrastructureTokens = {
    Configuration: Symbol.for("Infrastructure.Configuration"),
    PinoLogger: Symbol.for("Infrastructure.PinoLogger"),
    Logger: Symbol.for("Infrastructure.Logger"),
    PrismaClient: Symbol.for("Infrastructure.PrismaClient"),
    DatabaseService: Symbol.for("Infrastructure.DatabaseService"),
    RedisClient: Symbol.for("Infrastructure.RedisClient"),
    RedisService: Symbol.for("Infrastructure.RedisService"),
    CacheService: Symbol.for("Infrastructure.CacheService"),
    ApiService: Symbol.for("Infrastructure.ApiService"),
    HealthService: Symbol.for("Infrastructure.HealthService"),
    RequestContextService: Symbol.for("Infrastructure.RequestContextService")
};
