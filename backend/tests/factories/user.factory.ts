import { PrismaClient } from "../../generated/prisma/client.js"

import { Role, UserStatus } from "../../src/modules/identity/domain/enums/index.js";

import { Email, PasswordHash } from "../../src/modules/identity/domain/value-objects/index.js"

import { User } from "../../src/modules/identity/domain/entities/index.js"

export type CreateTestUserOptions = Partial<{
  id: string;
  email: string;
  passwordHash: string;
  roles: Role[];
  status: UserStatus;
  emailVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
}>

export const buildTestUser = (overrides: CreateTestUserOptions = {}): User => {
  return new User({
    id: overrides.id ?? crypto.randomUUID(),
    email: Email.create(overrides.email ?? `test-user-${crypto.randomUUID()}@example.com`),
    passwordHash: PasswordHash.create(overrides.passwordHash ?? "$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy"),
    roles: overrides.roles ?? [Role.CUSTOMER],
    status: overrides.status ?? UserStatus.ACTIVE,
    emailVerified: overrides.emailVerified ?? false,
    createdAt: overrides.createdAt ?? new Date(),
    updatedAt: overrides.updatedAt ?? new Date()
  })
}

export const createTestUser = async (prisma: PrismaClient, overrides: CreateTestUserOptions = {}): Promise<User> => {
  const user = buildTestUser(overrides)

  await prisma.user.create({
    data: {
      id: user.getId(),
      email: user.getEmail().getValue(),
      passwordHash: user.getPasswordHash().getValue(),
      roles: user.getRoles(),
      status: user.getStatus(),
      emailVerified: user.isEmailVerified(),
      createdAt: user.getCreatedAt(),
      updatedAt: user.getUpdatedAt()

    }
  })

  return user;
}
