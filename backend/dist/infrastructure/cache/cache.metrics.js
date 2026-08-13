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
import { inject, injectable } from "tsyringe";
import { InfrastructureTokens } from "../container/index.js";
let CacheMetrics = class CacheMetrics {
    logger;
    constructor(logger) {
        this.logger = logger;
    }
    recordHit(key) {
        this.logger.debug("Cache hit", { key });
    }
    recordMiss(key) {
        this.logger.debug("Cache miss", { key });
    }
    recordSet(key) {
        this.logger.debug("Cache set", { key });
    }
    recordDelete(key) {
        this.logger.debug("Cache delete", { key });
    }
    recordExists(key) {
        this.logger.debug("Cache exists check", { key });
    }
    recordExpire(key, ttlInSeconds) {
        this.logger.debug("Cache expiry set", { key, ttlInSeconds });
    }
    recordIncreament(key) {
        this.logger.debug("Cache increamented", { key });
    }
    recordFailure(operation, key, error) {
        this.logger.warn("Cache operation failed", {
            operation,
            key,
            error
        });
    }
    recordLatency(operation, key, durationMs) {
        this.logger.debug("Cache latency", {
            operation,
            key,
            durationMs
        });
    }
};
CacheMetrics = __decorate([
    injectable(),
    __param(0, inject(InfrastructureTokens.Logger)),
    __metadata("design:paramtypes", [Object])
], CacheMetrics);
export { CacheMetrics };
