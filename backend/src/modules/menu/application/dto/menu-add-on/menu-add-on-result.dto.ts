import { MenuAddOnStatus } from "../../../domain/enums/menu-add-on-status.enum.js"

export interface MenuAddOnResult {
  id: string
  menuAddOnGroupId: string
  name: string
  price: number
  currency: string
  displayOrder: number
  status: MenuAddOnStatus
  createdAt: Date
  updatedAt: Date
}
