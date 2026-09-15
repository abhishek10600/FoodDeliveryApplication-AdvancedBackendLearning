import { User as PrismaUser } from "../../../../../../../generated/prisma/client.js";
import { Role } from "../../../../../identity/domain/enums/role.enum.js";
import { UserStatus } from "../../../../../identity/domain/enums/user-status.enum.js";
import { Email } from "../../../../../identity/domain/value-objects/email.vo.js";
import { PasswordHash } from "../../../../../identity/domain/value-objects/password-hash.vo.js";
import { RestaurantOwner } from "../../../../domain/entities/restaurant-owner.entity.js";

export class RestaurantOwnerMapper {
  public static toDomain(prismaUser: PrismaUser): RestaurantOwner {
    return RestaurantOwner.rehydrate({
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

  public static toPersistence(restaurantOwner: RestaurantOwner) {
    return {
      id: restaurantOwner.getId(),
      email: restaurantOwner.getEmail(),
      passwordHash: restaurantOwner.getPasswordHash(),
      roles: restaurantOwner.getRoles(),
      status: restaurantOwner.getStatus(),
      emailVerified: restaurantOwner.isEmailVerified(),
      createdAt: restaurantOwner.getCreatedAt(),
      updatedAt: restaurantOwner.getUpdatedAt()
    }
  }
}
