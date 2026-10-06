import { Prisma } from "../../../../../../generated/prisma/client.js"
import { MenuCategory } from "../../../domain/entities/menu-cateogry.entity.js"
import { MenuCategoryStatus } from "../../../domain/enums/menu-category-status.enum.js"
import { MenuCategoryDescription } from "../../../domain/value-objects/menu-category-description.vo.js"
import { MenuCategoryName } from "../../../domain/value-objects/menu-category-name.vo.js"

export class MenuCategoryMapper {
  public static toDomain(data: Prisma.MenuCategoryGetPayload<{}>): MenuCategory {
    return MenuCategory.rehydrate({
      id: data.id,
      menuId: data.menuId,
      name: MenuCategoryName.create(data.name),
      description: data.description ? MenuCategoryDescription.create(data.description) : null,
      displayOrder: data.displayOrder,
      status: data.status as MenuCategoryStatus,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt
    })
  }

  public static toPersistence(menuCategory: MenuCategory): Prisma.MenuCategoryCreateInput {
    return {
      id: menuCategory.getId(),
      menu: {
        connect: {
          id:menuCategory.getMenuId()
        }
      },
      name: menuCategory.getName().getValue(),
      description: menuCategory.getDescription()?.getValue(),
      displayOrder: menuCategory.getDisplayOrder(),
      status: menuCategory.getStatus(),
      createdAt: menuCategory.getCreatedAt(),
      updatedAt: menuCategory.getUpdatedAt()
    }
  }

  public static toUpdatePersistence(menuCategory: MenuCategory): Prisma.MenuCategoryUpdateInput {
    return {
      name: menuCategory.getName().getValue(),
      description: menuCategory.getDescription()?.getValue(),
      status: menuCategory.getStatus(),
      displayOrder: menuCategory.getDisplayOrder(),
      updatedAt: menuCategory.getUpdatedAt()
    }
  }
}
