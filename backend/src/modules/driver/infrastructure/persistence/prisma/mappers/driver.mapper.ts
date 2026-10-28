import { User as PrismaUser } from "../../../../../../../generated/prisma/client.js";
import { Role } from "../../../../../identity/domain/enums/role.enum.js";
import { UserStatus } from "../../../../../identity/domain/enums/user-status.enum.js";
import { Email } from "../../../../../identity/domain/value-objects/email.vo.js";
import { PasswordHash } from "../../../../../identity/domain/value-objects/password-hash.vo.js";
import { Driver } from "../../../../domain/entities/driver.entity.js";

export class DriverMapper {

  public static toDomain(prismaUser: PrismaUser): Driver {
    return Driver.rehydrate({
      id: prismaUser.id,
      email: Email.create(prismaUser.email),
      passwordHash: PasswordHash.create(prismaUser.passwordHash),
      roles: prismaUser.roles.map((role) => role as Role),
      status: prismaUser.status as UserStatus,
      emailVerified: prismaUser.emailVerified,
      createdAt: prismaUser.createdAt,
      updatedAt: prismaUser.updatedAt
    })
  }

  public static toPersistence(driver: Driver) {
    return {
      id: driver.getId(),
      email: driver.getEmail(),
      passwordHash: driver.getPasswordHash(),
      roles: driver.getRoles(),
      status: driver.getStatus(),
      emailVerified: driver.isEmailVerified(),
      createdAt: driver.getCreatedAt(),
      updatedAt: driver.getUpdatedAt()
    }
  }

}
