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
