import { MenuCategoryStatus } from "../../../domain/enums/menu-category-status.enum.js"

export interface MenuCategoryResult {
  id: string
  menuId: string
  name: string
  description?: string
  displayOrder: number
  status: MenuCategoryStatus
  createdAt: Date
  updatedAt: Date
}
