import { Prisma } from "../../../../../../generated/prisma/client.js"
import { Menu } from "../../../domain/entities/menu.entity.js"
import { MenuStatus } from "../../../domain/enums/menu-status.enum.js"
import { MenuName } from "../../../domain/value-objects/menu-name.vo.js"

export class MenuMapper {

  public static toDomain(
    data: Prisma.MenuGetPayload<{}>
  ) {
    return Menu.rehydrate({
      id: data.id,
      restaurantId: data.id,
      name: MenuName.create(data.name),
      status: data.status as MenuStatus,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt
    })
  }

  public static toPersistence(menu: Menu): Prisma.MenuCreateInput {
    return {
      id: menu.getId(),
      restaurant: {
        connect: {
          id: menu.getRestaurantId()
        }
      },
      name: menu.getName().getValue(),
      status: menu.getStatus(),
      createdAt: menu.getCreatedAt(),
      updatedAt: menu.getUpdatedAt()
    }
  }

  public static toUpdatePersistence(menu: Menu): Prisma.MenuUpdateInput {
    return {
      name: menu.getName().getValue(),
      status: menu.getStatus(),
      updatedAt: menu.getUpdatedAt()
    }
  }

}
