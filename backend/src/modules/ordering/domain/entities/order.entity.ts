import { randomUUID } from "node:crypto"
import { OrderStatus } from "../enums/order-status.enum.js"
import { OrderDomainError } from "../errors/order.domain.error.js"
import { OrderItem } from "./order-item.entity.js"

export interface ICreateOrderProps {
  customerId: string
  restaurantId: string
  addressId: string
  items: OrderItem[]
  deliveryFee: number
  currency: string
}

export interface IOrderProps {
  id: string
  customerId: string
  restaurantId: string
  addressId: string
  items: OrderItem[]
  status: OrderStatus
  subTotal: number
  currency: string
  deliveryFee: number
  total: number
  createdAt: Date
  updatedAt: Date

}

export class Order {

  private readonly id: string
  private readonly customerId: string
  private readonly restaurantId: string
  private readonly addressId: string
  private readonly items: OrderItem[]
  private status: OrderStatus
  private readonly subTotal: number
  private readonly currency: string
  private readonly deliveryFee: number
  private readonly total: number
  private readonly createdAt: Date
  private updatedAt: Date

  constructor(props: IOrderProps) {

    this.id = props.id
    this.customerId = props.customerId
    this.restaurantId = props.restaurantId
    this.addressId = props.addressId
    this.items = props.items
    this.status = props.status
    this.subTotal = props.subTotal
    this.currency = props.currency
    this.deliveryFee = props.deliveryFee
    this.total = props.total
    this.createdAt = props.createdAt
    this.updatedAt = props.updatedAt
  }

  public static create(props: ICreateOrderProps): Order {

    this.validate(props)

    const subTotal = props.items.reduce((sum, item) => sum + item.getLineTotal(), 0)

    const total = subTotal + props.deliveryFee

    if (!Number.isSafeInteger(subTotal) || !Number.isSafeInteger(total)) {

      throw new OrderDomainError("Subtotal or total is not a safe integer", 400)
    }

    return new Order({
      id: randomUUID(),
      customerId: props.customerId,
      restaurantId: props.restaurantId,
      addressId: props.addressId,
      items: [...props.items],
      status: OrderStatus.PENDING_PAYMENT,
      subTotal,
      currency: props.currency,
      deliveryFee: props.deliveryFee,
      total,
      createdAt: new Date(),
      updatedAt: new Date()
    })

  }

  public static rehydrate(props: IOrderProps): Order {

    return new Order(props)
  }

  private static validate(props: ICreateOrderProps): void {

    if (!props.customerId.trim()) {
      throw new OrderDomainError("Customer id is required", 400)
    }

    if (!props.restaurantId.trim()) {
      throw new OrderDomainError("Restaurant id is required", 400)
    }

    if (!props.addressId.trim()) {
      throw new OrderDomainError("Address id is required", 400)
    }

    if (!props.currency.trim()) {
      throw new OrderDomainError("Currency is required", 400)
    }

    if (!Array.isArray(props.items) || props.items.length === 0) {
      throw new OrderDomainError("At least 1 item is required in order", 400)
    }

    if (!Number.isSafeInteger(props.deliveryFee) || props.deliveryFee < 0) {
      throw new OrderDomainError("Delivery fee is less than 0 or Delivery fee is not a safe integer", 400)
    }

    const itemIds = new Set<string>

    for (const item of props.items) {
      if (itemIds.has(item.getId())) {
        throw new OrderDomainError("Duplicate order item ID", 400)
      }

      itemIds.add(item.getId())
    }

    const subTotal = props.items.reduce((sum, item) => sum + item.getLineTotal(), 0)

    if (!Number.isSafeInteger(subTotal) || subTotal < 0) {
      throw new OrderDomainError("Subtotal is not a safe integer or Subtotal is less than 0", 400)
    }
  }

  private ensureStatus(expected: OrderStatus): void {
    if (expected !== this.status) {
      throw new OrderDomainError(`Invalid order status transition: ${this.status}`, 400)
    }
  }

  public confirm(): void {
    this.ensureStatus(OrderStatus.PENDING_PAYMENT)

    this.status = OrderStatus.CONFIRMED

    this.touch()
  }

  public markPaymentFailed(): void {
    this.ensureStatus(OrderStatus.PENDING_PAYMENT)

    this.status = OrderStatus.PAYMENT_FAILED

    this.touch()
  }

  public cancel(): void {
    if (this.status !== OrderStatus.PENDING_PAYMENT && this.status !== OrderStatus.CONFIRMED) {
      throw new OrderDomainError("Order cannot be cancelled now", 400)
    }

    this.status = OrderStatus.CANCELLED

    this.touch()
  }

  public getId(): string {
    return this.id
  }

  public getCustomerId(): string {
    return this.customerId
  }

  public getRestaurantId(): string {
    return this.restaurantId
  }

  public getAddressId(): string {
    return this.addressId
  }

  public getItems(): OrderItem[] {
    return [...this.items]
  }

  public getStatus(): OrderStatus {
    return this.status
  }

  public getSubTotal(): number {
    return this.subTotal
  }

  public getCurrency(): string {
    return this.currency
  }

  public getDeliveryFee(): number {
    return this.deliveryFee
  }

  public getTotal(): number {
    return this.total
  }

  public getCreatedAt(): Date {
    return this.createdAt
  }

  public getUpdatedAt(): Date {
    return this.updatedAt
  }

  private touch(): void {
    this.updatedAt = new Date()
  }

}
