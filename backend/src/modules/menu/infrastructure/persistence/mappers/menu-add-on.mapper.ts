import { Prisma } from "../../../../../../generated/prisma/client.js"
import { MenuAddOn } from "../../../domain/entities/menu-add-on.entity.js";
import { MenuAddOnStatus } from "../../../domain/enums/menu-add-on-status.enum.js";
import { MenuAddOnName } from "../../../domain/value-objects/menu-add-on-name.vo.js";

export class MenuAddOnMapper {

  public static toDomain(data: Prisma.MenuAddOnGetPayload<{}>): MenuAddOn {
    return MenuAddOn.rehydrate({
      id: data.id,
      menuAddOnGroupId: data.menuAddOnGroupId,
      name: MenuAddOnName.create(data.name),
      price: data.price,
      currency: data.currency,
      displayOrder: data.displayOrder,
      status: data.status as MenuAddOnStatus,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt
    })
  }

  public static toPersistence(menuAddOn: MenuAddOn): Prisma.MenuAddOnCreateInput {
    return {
      id: menuAddOn.getId(),
      menuAddOnGroup: {
        connect: {
          id: menuAddOn.getMenuAddOnGroupId()
        }
      },
      name: menuAddOn.getName().getValue(),
      price: menuAddOn.getPrice(),
      currency: menuAddOn.getCurrency(),
      displayOrder: menuAddOn.getDisplayOrder(),
      status: menuAddOn.getStatus(),
      createdAt: menuAddOn.getCreatedAt(),
      updatedAt: menuAddOn.getUpdatedAt()
    }
  }

  public static toUpdatePersistence(menuAddOn: MenuAddOn): Prisma.MenuAddOnUpdateInput {
    return {
      name: menuAddOn.getName().getValue(),
      price: menuAddOn.getPrice(),
      currency: menuAddOn.getCurrency(),
      displayOrder: menuAddOn.getDisplayOrder(),
      status: menuAddOn.getStatus(),
      updatedAt: menuAddOn.getUpdatedAt()
    }
  }
}
