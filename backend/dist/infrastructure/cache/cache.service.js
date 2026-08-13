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
import { CacheOperation } from "./cache.enum.js";
import { CacheMetrics } from "./cache.metrics.js";
import { cacheSerializer } from "./cache.serailizer.js";
let CacheService = class CacheService {
    redis;
    logger;
    cacheMetrics;
    constructor(redis, logger, cacheMetrics) {
        this.redis = redis;
        this.logger = logger;
        this.cacheMetrics = cacheMetrics;
    }
    async get(key) {
        const started = performance.now();
        try {
            const value = await this.redis.get(key);
            if (!value) {
                this.cacheMetrics.recordMiss(key);
                return null;
            }
            this.cacheMetrics.recordHit(key);
            return cacheSerializer.deserialize(value);
        }
        catch (error) {
            this.cacheMetrics.recordFailure(CacheOperation.GET, key, error);
            this.logger.error("Failed to get value from cache", {
                error,
                key
            });
            return null;
        }
        finally {
            this.cacheMetrics.recordLatency(CacheOperation.GET, key, performance.now() - started);
        }
    }
    async set(key, value, ttlInSeconds) {
        const started = performance.now();
        try {
            const serialized = cacheSerializer.serialize(value);
            if (ttlInSeconds) {
                await this.redis.set(key, serialized, "EX", ttlInSeconds);
            }
            else {
                await this.redis.set(key, serialized);
            }
            this.cacheMetrics.recordSet(key);
        }
        catch (error) {
            this.cacheMetrics.recordFailure(CacheOperation.SET, key, error);
            this.logger.error("Failed to set value in cache", {
                error,
                key
            });
        }
        finally {
            this.cacheMetrics.recordLatency(CacheOperation.SET, key, performance.now() - started);
        }
    }
    async delete(key) {
        const started = performance.now();
        try {
            await this.redis.del(key);
            this.cacheMetrics.recordDelete(key);
        }
        catch (error) {
            this.cacheMetrics.recordFailure(CacheOperation.DELETE, key, error);
            this.logger.error("Failed to delete cache key", {
                error,
                key
            });
        }
        finally {
            this.cacheMetrics.recordLatency(CacheOperation.DELETE, key, performance.now() - started);
        }
    }
    async exists(key) {
        const started = performance.now();
        try {
            const exists = await this.redis.exists(key);
            this.cacheMetrics.recordExists(key);
            return exists === 1;
        }
        catch (error) {
            this.cacheMetrics.recordFailure(CacheOperation.EXISTS, key, error);
            this.logger.error("Failed to check cache key", {
                error,
                key
            });
            return false;
        }
        finally {
            this.cacheMetrics.recordLatency(CacheOperation.EXISTS, key, performance.now() - started);
        }
    }
    async expire(key, ttlInSeconds) {
        const started = performance.now();
        try {
            await this.redis.expire(key, ttlInSeconds);
            this.cacheMetrics.recordExpire(key, ttlInSeconds);
        }
        catch (error) {
            this.cacheMetrics.recordFailure(CacheOperation.EXPIRE, key, error);
            this.logger.error("Failed to update the cache key expiration", {
                error,
                key
            });
        }
        finally {
            this.cacheMetrics.recordLatency(CacheOperation.EXPIRE, key, performance.now() - started);
        }
    }
    async increament(key) {
        const started = performance.now();
        try {
            const increamentCache = await this.redis.incr(key);
            this.cacheMetrics.recordIncreament(key);
            return increamentCache;
        }
        catch (error) {
            this.cacheMetrics.recordFailure(CacheOperation.INCREMENT, key, error);
            this.logger.error("Failed to increament cache key", {
                error,
                key
            });
            return 0;
        }
        finally {
            this.cacheMetrics.recordLatency(CacheOperation.INCREMENT, key, performance.now() - started);
        }
    }
};
CacheService = __decorate([
    injectable(),
    __param(0, inject(InfrastructureTokens.RedisClient)),
    __param(1, inject(InfrastructureTokens.Logger)),
    __metadata("design:paramtypes", [Function, Object, CacheMetrics])
], CacheService);
export { CacheService };
