import { MenuAddOnGroup } from "../domain/entities/menu-add-on-group.entity.js"
import { MenuItem } from "../domain/entities/menu-item.entity.js"

export interface IMenuItemWithForeignData {
  menuItem: MenuItem,
  category: {
    id: string,
    name: string,
    description: string | null,
    displayOrder: number,
    status: "ACTIVE" | "INACTIVE",
    createdAt: Date,
    updateAt: Date
  },
  menu: {
    id: string,
    name: string,
    status: "ACTIVE" | "INACTIVE"
  },
  restaurant: {
    id: string,
    name: string,
    ownerId: string
    }
}

export interface IMenuAddOnGroupWithForeignData {
  menuAddOnGroup: MenuAddOnGroup,
  menuItem: {
    id: string,
    menuCategoryId: string
  },
  category: {
    id: string
    menuId: string
  },
  menu: {
    id: string
    restaurantId: string
  },
  restaurant: {
    id: string
    ownerId: string
  }
}
