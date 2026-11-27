import { Order } from "../entities/order.entity.js";
import { OrderStatus } from "../enums/order-status.enum.js";
import { Prisma } from "../../../../../generated/prisma/client.js"

export interface IOrderListOptions {
  cursor?: string
  limit: number
  status?: OrderStatus
}

export interface IOrderResultOptions {
  orders: Order[]
  nextCursor: string | null
  hasMore: boolean
}

export interface IOrderRepository {

  create(order: Order): Promise<Order>

  findByOrderId(orderId: string): Promise<Order | null>

  findByOrderIdAndCustomerId(orderId: string, customerId: string): Promise<Order | null>

  findManyByCustomerId(customerId: string, options: IOrderListOptions): Promise<IOrderResultOptions>

  findByCustomerIdAndIdempotencyKey(customerId: string, idempotencyKey: string): Promise<Order | null>

  update(order: Order): Promise<void>

  findByOrderIdInTransaction(orderId: string, tx: Prisma.TransactionClient): Promise<Order | null>

  updateInTransaction(order: Order, tx: Prisma.TransactionClient): Promise<void>

}
