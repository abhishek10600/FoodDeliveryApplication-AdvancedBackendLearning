var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
import { injectable, inject } from "tsyringe";
import { InfrastructureTokens } from "../container/index.js";
let RedisService = class RedisService {
    redis;
    logger;
    constructor(redis, logger) {
        this.redis = redis;
        this.logger = logger;
    }
    connectRedis = async () => {
        try {
            this.logger.info("Connecting to redis");
            await this.redis.connect();
            this.logger.info("Connected to redis successfully");
        }
        catch (error) {
            this.logger.fatal("Failed to connect to Redis", error);
        }
    };
    disconnectRedis = async () => {
        try {
            this.logger.info("Disconnecting from redis");
            await this.redis.quit();
            this.logger.info("Disconnected from redis successfully");
        }
        catch (error) {
            this.logger.fatal("Failed to disconnect redis", error);
        }
    };
    checkRedisHealth = async () => {
        try {
            const start = process.hrtime.bigint();
            await this.redis.ping();
            const latency = Number(process.hrtime.bigint() - start) / 1_000_000;
            return {
                status: "healthy",
                latency
            };
        }
        catch (error) {
            this.logger.error("Redis health check failed", error);
            return {
                status: "unhealthy"
            };
        }
    };
};
RedisService = __decorate([
    injectable(),
    __param(0, inject(InfrastructureTokens.RedisClient)),
    __param(1, inject(InfrastructureTokens.Logger)),
    __metadata("design:paramtypes", [Function, Object])
], RedisService);
export { RedisService };
