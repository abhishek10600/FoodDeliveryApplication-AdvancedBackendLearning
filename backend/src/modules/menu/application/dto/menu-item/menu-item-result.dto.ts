import { MenuItemStatus } from "../../../domain/enums/menu-item-status.enum.js"

export interface MenuItemResult {
  id: string
  menuCategoryId: string
  name: string
  description?: string
  imageUrl: string | null
  price: number
  currency: string
  status: MenuItemStatus
  isAvailable: boolean
  displayOrder: number
  createdAt: Date
  updatedAt: Date
}
