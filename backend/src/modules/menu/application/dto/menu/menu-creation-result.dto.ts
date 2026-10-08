import { MenuStatus } from "../../../domain/enums/menu-status.enum.js"

export interface MenuCreationResult {
  id: string
  restaurantId: string
  name: string
  status: MenuStatus
  createdAt: Date
  updatedAt: Date
}
