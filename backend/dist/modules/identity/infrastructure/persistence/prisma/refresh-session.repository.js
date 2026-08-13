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
import { InfrastructureTokens } from "../../../../../infrastructure/container/tokens/infrastructure.tokens.js";
import { PrismaClient } from "../../../../../../generated/prisma/client.js";
import { RefreshSessionMapper } from "./mappers/refresh-session.mapper.js";
let RefreshSessionRepository = class RefreshSessionRepository {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(refreshSession) {
        const data = RefreshSessionMapper.toPersistence(refreshSession);
        const createdRefreshSession = await this.prisma.refreshSession.create({
            data: {
                id: data.id,
                userId: data.userId,
                tokenHash: data.tokenHash,
                expiresAt: data.expiresAt,
                lastUsedAt: data.lastUsedAt,
                revokedAt: data.revokedAt,
                ipAddress: data.ipAddress,
                userAgent: data.userAgent,
                createdAt: data.createdAt,
                updatedAt: data.updatedAt
            }
        });
        return RefreshSessionMapper.toDomain(createdRefreshSession);
    }
    async findById(id) {
        const refreshSession = await this.prisma.refreshSession.findUnique({
            where: {
                id
            }
        });
        if (!refreshSession) {
            return null;
        }
        return RefreshSessionMapper.toDomain(refreshSession);
    }
    async findByTokenHash(tokenHash) {
        const refreshSession = await this.prisma.refreshSession.findUnique({
            where: {
                tokenHash
            }
        });
        if (!refreshSession) {
            return null;
        }
        return RefreshSessionMapper.toDomain(refreshSession);
    }
    async findByUserId(userId) {
        const refreshSessions = await this.prisma.refreshSession.findMany({
            where: {
                userId
            },
            orderBy: {
                createdAt: "desc"
            }
        });
        return refreshSessions.map(RefreshSessionMapper.toDomain);
    }
    async update(refreshSession) {
        const data = RefreshSessionMapper.toUpdatePersistence(refreshSession);
        const updatedRefreshSession = await this.prisma.refreshSession.update({
            where: {
                id: refreshSession.getId()
            },
            data
        });
        return RefreshSessionMapper.toDomain(updatedRefreshSession);
    }
    async revoke(id, revokedAt) {
        await this.prisma.refreshSession.update({
            where: {
                id
            },
            data: {
                revokedAt
            }
        });
    }
};
RefreshSessionRepository = __decorate([
    injectable(),
    __param(0, inject(InfrastructureTokens.PrismaClient)),
    __metadata("design:paramtypes", [PrismaClient])
], RefreshSessionRepository);
export { RefreshSessionRepository };
