import { MenuStatus } from "../../../domain/enums/menu-status.enum.js"

export interface MenuResult {
  id: string
  restaurantId: string
  name: string
  status: MenuStatus
  createdAt: Date
  updatedAt: Date
}
