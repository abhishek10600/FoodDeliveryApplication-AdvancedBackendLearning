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
import { InfrastructureTokens } from "../infrastructure/container/index.js";
import { HealthService } from "../infrastructure/observeability/health.service.js";
import { catchAsync } from "../shared/utils/CatchAsync.js";
import { LoggerFactory } from "../infrastructure/observeability/logger/logger.factory.js";
let HealthController = class HealthController {
    healthService;
    logger;
    constructor(healthService, logger, loggerFactory) {
        this.healthService = healthService;
        this.logger = logger;
        this.logger = loggerFactory.create({
            component: "HealthService",
            module: "app"
        });
    }
    live = catchAsync(async (req, res, next) => {
        return res.status(200).json({
            success: true,
            status: "alive",
            timestamp: new Date().toISOString()
        });
    });
    health = catchAsync(async (req, res, next) => {
        const services = await this.healthService.getHealthStatus();
        this.logger.info("Health serive");
        return res.status(200).json({
            success: true,
            status: "healthy",
            services,
            timestamp: new Date().toISOString()
        });
    });
};
HealthController = __decorate([
    injectable(),
    __param(0, inject(InfrastructureTokens.HealthService)),
    __param(1, inject(InfrastructureTokens.Logger)),
    __metadata("design:paramtypes", [HealthService, Object, LoggerFactory])
], HealthController);
export { HealthController };
