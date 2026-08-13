import { container } from "tsyringe";
import { DatabaseService, } from "../infrastructure/database/database.service.js";
import { RedisService } from "../infrastructure/cache/redis.service.js";
import { InfrastructureTokens } from "../infrastructure/container/index.js";
export const shutdown = (server, signal) => {
    const logger = container.resolve(InfrastructureTokens.Logger);
    logger.info(`${signal} received. Shutting down gracefully...`);
    server.close(async () => {
        logger.info("HTTP server closed.");
        try {
            const databaseService = container.resolve(DatabaseService);
            const redisService = container.resolve(RedisService);
            await databaseService.disconnectDatabase();
            await redisService.disconnectRedis();
        }
        catch {
            process.exit(1);
        }
        process.exit(0);
    });
};
