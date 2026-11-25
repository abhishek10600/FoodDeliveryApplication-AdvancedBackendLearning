import { OrderStatus } from "../../domain/enums/order-status.enum.js"
import { OrderItemResult } from "./order-item.dto.js"

export interface CreateOrderResult {

  id: string
  customerId: string
  restaurantId: string
  addressId: string
  items: OrderItemResult[]
  status: OrderStatus
  subTotal: number
  deliveryFee: number
  total: number
  currency: string
  createdAt: string
  updatedAt: string
}
