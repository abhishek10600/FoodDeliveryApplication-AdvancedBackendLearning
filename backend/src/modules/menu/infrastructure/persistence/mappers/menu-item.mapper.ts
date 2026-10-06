import { Prisma } from "../../../../../../generated/prisma/client.js"
import { MenuItem } from "../../../domain/entities/menu-item.entity.js"
import { MenuItemStatus } from "../../../domain/enums/menu-item-status.enum.js"
import { MenuItemDescription } from "../../../domain/value-objects/menu-item-description.vo.js"
import { MenuItemImageUrl } from "../../../domain/value-objects/menu-item-image-url.vo.js"
import { MenuItemName } from "../../../domain/value-objects/menu-item-name.vo.js"

export class MenuItemMapper {
  public static toDomain(data: Prisma.MenuItemGetPayload<{}>): MenuItem {
    return MenuItem.rehydrate({
      id: data.id,
      menuCategoryId: data.menuCategoryId,
      name: MenuItemName.create(data.name),
      description: data.description ? MenuItemDescription.create(data.description) : null,
      imageUrl: data.imageUrl ? MenuItemImageUrl.create(data.imageUrl) : null,
      price: data.price,
      currency: data.currency,
      status: data.status as MenuItemStatus,
      isAvailable: data.isAvailable,
      displayOrder: data.displayOrder,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt
    })
  }

  public static toPersistence(menuItem: MenuItem): Prisma.MenuItemCreateInput {
    return {
      id: menuItem.getId(),
      category: {
        connect: {
          id: menuItem.getMenuCategoryId()
        }
      },
      name: menuItem.getName().getValue(),
      description: menuItem.getDescription()?.getValue(),
      imageUrl: menuItem.getImageUrl()?.getValue(),
      price: menuItem.getPrice(),
      currency: menuItem.getCurrency(),
      status: menuItem.getStatus(),
      isAvailable: menuItem.getIsAvailable(),
      displayOrder: menuItem.getDisplayOrder(),
      createdAt: menuItem.getCreatedAt(),
      updatedAt: menuItem.getUpdatedAt()
    }
  }

  public static toUpdatePersistence(menuItem: MenuItem): Prisma.MenuItemUpdateInput {
    return {
      name: menuItem.getName().getValue(),
      description: menuItem.getDescription()?.getValue(),
      imageUrl: menuItem.getImageUrl()?.getValue(),
      price: menuItem.getPrice(),
      currency: menuItem.getCurrency(),
      status: menuItem.getStatus(),
      isAvailable: menuItem.getIsAvailable(),
      displayOrder: menuItem.getDisplayOrder(),
      updatedAt: menuItem.getUpdatedAt()
    }
  }
}
