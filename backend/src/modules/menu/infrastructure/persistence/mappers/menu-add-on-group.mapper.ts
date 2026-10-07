import { Prisma } from "../../../../../../generated/prisma/client.js"
import { MenuAddOnGroup } from "../../../domain/entities/menu-add-on-group.entity.js"
import { MenuAddOnGroupStatus } from "../../../domain/enums/menu-add-on-group-status.enum.js"
import { MenuAddOnGroupName } from "../../../domain/value-objects/menu-add-on-group-name.vo.js"

export class MenuAddOnGroupMapper {

  public static toDomain(data: Prisma.MenuAddOnGroupGetPayload<{}>): MenuAddOnGroup {
    return MenuAddOnGroup.rehydrate({
      id: data.id,
      menuItemId: data.menuItemId,
      name: MenuAddOnGroupName.create(data.name),
      minSelections: data.minSelections,
      maxSelections: data.maxSelections,
      status: data.status as MenuAddOnGroupStatus,
      displayOrder: data.displayOrder,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt
    })
  }

  public static toPersistence(menuAddOnGroup: MenuAddOnGroup): Prisma.MenuAddOnGroupCreateInput {
    return {
      id: menuAddOnGroup.getId(),
      menuItem: {
        connect: {
          id: menuAddOnGroup.getMenuItemId()
        }
      },
      name: menuAddOnGroup.getName().getValue(),
      minSelections: menuAddOnGroup.getMinSelections(),
      maxSelections: menuAddOnGroup.getMaxSelections(),
      status: menuAddOnGroup.getStatus(),
      displayOrder: menuAddOnGroup.getDisplayOrder(),
      createdAt: menuAddOnGroup.getCreatedAt(),
      updatedAt: menuAddOnGroup.getUpdatedAt()
    }
  }

  public static toUpdatePersistence(menuAddOnGroup: MenuAddOnGroup): Prisma.MenuAddOnGroupUpdateInput {
    return {
      name: menuAddOnGroup.getName().getValue(),
      minSelections: menuAddOnGroup.getMinSelections(),
      maxSelections: menuAddOnGroup.getMaxSelections(),
      status: menuAddOnGroup.getStatus(),
      displayOrder: menuAddOnGroup.getDisplayOrder(),
      updatedAt: menuAddOnGroup.getUpdatedAt()
    }
  }

}
