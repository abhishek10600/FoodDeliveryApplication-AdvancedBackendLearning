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
import { registerQueryLogger } from "./query-logger.js";
import { InfrastructureTokens } from "../container/index.js";
import { LoggerFactory } from "../observeability/logger/logger.factory.js";
let DatabaseService = class DatabaseService {
    prisma;
    logger;
    constructor(prisma, logger, loggerFactory) {
        this.prisma = prisma;
        this.logger = logger;
        this.logger = loggerFactory.create({
            component: "DatabaseService",
            module: "infrastructure"
        });
    }
    connectDatabase = async () => {
        try {
            this.logger.info("Connecting to the database", {
                event: "DATABASE_CONNECTED",
                component: "database",
                operation: "connect"
            });
            registerQueryLogger();
            await this.prisma.$connect();
            this.logger.info("Connected to the database successfully");
        }
        catch (error) {
            this.logger.fatal("Failed to connect to database", error);
            throw error;
        }
    };
    disconnectDatabase = async () => {
        try {
            this.logger.info("Disconnecting from the database");
            await this.prisma.$disconnect();
            this.logger.info("Disconnected from the database successfully");
        }
        catch (error) {
            this.logger.fatal("Failed to disconnect from the database", error);
        }
    };
    checkDatabaseHealth = async () => {
        try {
            const start = process.hrtime.bigint();
            await this.prisma.$queryRaw `SELECT 1`;
            const latency = Number(process.hrtime.bigint() - start) / 1_000_000;
            return {
                status: "healthy",
                latency
            };
        }
        catch (error) {
            return {
                status: "unhealthy"
            };
        }
    };
    getClient = () => {
        return this.prisma;
    };
};
DatabaseService = __decorate([
    injectable(),
    __param(0, inject(InfrastructureTokens.PrismaClient)),
    __param(1, inject(InfrastructureTokens.Logger)),
    __metadata("design:paramtypes", [Function, Object, LoggerFactory])
], DatabaseService);
export { DatabaseService };
