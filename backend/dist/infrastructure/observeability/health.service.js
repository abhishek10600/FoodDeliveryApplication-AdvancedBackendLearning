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
import { DatabaseService } from "../database/database.service.js";
import { RedisService } from "../cache/redis.service.js";
import { ApiService } from "../../app/health.service.js";
let HealthService = class HealthService {
    apiService;
    databaseService;
    redisService;
    constructor(apiService, databaseService, redisService) {
        this.apiService = apiService;
        this.databaseService = databaseService;
        this.redisService = redisService;
    }
    getHealthStatus = async () => {
        const [api, database, redis,] = await Promise.all([
            this.apiService.checkApiHealth(),
            this.databaseService.checkDatabaseHealth(),
            this.redisService.checkRedisHealth()
        ]);
        return {
            api,
            database,
            redis
        };
    };
};
HealthService = __decorate([
    injectable(),
    __param(0, inject(InfrastructureTokens.ApiService)),
    __param(1, inject(InfrastructureTokens.DatabaseService)),
    __param(2, inject(InfrastructureTokens.RedisService)),
    __metadata("design:paramtypes", [ApiService,
        DatabaseService,
        RedisService])
], HealthService);
export { HealthService };
