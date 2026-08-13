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
import { UserMapper } from "./mappers/user.mapper.js";
import { PrismaClient } from "../../../../../../generated/prisma/client.js";
let UserRepository = class UserRepository {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(user) {
        const data = UserMapper.toPersistence(user);
        const createdUser = await this.prisma.user.create({
            data: {
                id: data.id,
                email: data.email.getValue(),
                passwordHash: data.passwordHash.getValue(),
                roles: data.roles,
                status: data.status,
                emailVerified: data.emailVerified,
                createdAt: data.createdAt,
                updatedAt: data.updatedAt
            }
        });
        return UserMapper.toDomain(createdUser);
    }
    async findById(id) {
        const user = await this.prisma.user.findUnique({
            where: {
                id
            }
        });
        if (!user) {
            return null;
        }
        return UserMapper.toDomain(user);
    }
    async findByEmail(email) {
        const user = await this.prisma.user.findUnique({
            where: {
                email: email.getValue()
            }
        });
        if (!user) {
            return null;
        }
        return UserMapper.toDomain(user);
    }
    async existsByEmail(email) {
        const user = await this.prisma.user.findUnique({
            where: {
                email: email.getValue()
            }
        });
        if (!user) {
            return false;
        }
        return true;
    }
    async update(user) {
        const data = UserMapper.toPersistence(user);
        const updatedUser = await this.prisma.user.update({
            where: {
                id: user.getId()
            },
            data: {
                email: data.email.getValue(),
                passwordHash: data.passwordHash.getValue(),
                roles: data.roles,
                status: data.status,
                emailVerified: data.emailVerified,
            }
        });
        return UserMapper.toDomain(updatedUser);
    }
};
UserRepository = __decorate([
    injectable(),
    __param(0, inject(InfrastructureTokens.PrismaClient)),
    __metadata("design:paramtypes", [PrismaClient])
], UserRepository);
export { UserRepository };
