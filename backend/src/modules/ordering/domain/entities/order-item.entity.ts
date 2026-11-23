import { randomUUID } from "node:crypto"
import { OrderDomainError } from "../errors/order.domain.error.js"

export interface ICreateOrderItemProps {
  orderId: string
  menuItemId: string
  itemName: string
  unitPrice: number
  quantity: number
  lineTotal: number
}

export interface IOrderItemProps {
  id: string
  orderId: string
  menuItemId: string
  itemName: string
  unitPrice: number
  quantity: number
  lineTotal: number
  createdAt: Date
  updatedAt: Date
}

export class OrderItem {

  private readonly id: string
  private readonly orderId: string
  private readonly menuItemId: string
  private readonly itemName: string
  private readonly unitPrice: number
  private readonly quantity: number
  private readonly lineTotal: number
  private readonly createdAt: Date
  private updatedAt: Date

  constructor(props: IOrderItemProps) {

    this.id = props.id
    this.orderId = props.orderId
    this.menuItemId = props.menuItemId
    this.itemName = props.itemName
    this.unitPrice = props.unitPrice
    this.quantity = props.quantity
    this.lineTotal = props.lineTotal
    this.createdAt = props.createdAt
    this.updatedAt = props.updatedAt

  }

  public static create(props: ICreateOrderItemProps): OrderItem {

    const lineTotal: number = props.unitPrice * props.quantity

    const validProps = {
      id: randomUUID(),
      orderId: props.orderId,
      menuItemId: props.menuItemId,
      itemName: props.itemName,
      unitPrice: props.unitPrice,
      quantity: props.quantity,
      lineTotal,
      createdAt: new Date(),
      updatedAt: new Date()
    }

    this.validate(validProps)

    return new OrderItem(validProps)
  }

  public static rehydrate(props: IOrderItemProps): OrderItem {

    return new OrderItem(props)
  }


  private static validate(props: ICreateOrderItemProps): void {

    if (!props.orderId.trim()) {
      throw new OrderDomainError("Order id is required", 400)
    }

    if (!props.menuItemId.trim()) {
      throw new OrderDomainError("Menu item id is required", 400)
    }

    if (!props.itemName.trim()) {
      throw new OrderDomainError("Menu item name is required", 400)
    }

    if (!Number.isSafeInteger(props.quantity) || props.quantity <= 0) {
      throw new OrderDomainError("Order item quantity is less than or equal to 0 or Order item quantity is not a safe integer", 400)
    }

    if (!Number.isSafeInteger(props.unitPrice) || props.unitPrice < 0) {
      throw new OrderDomainError("Order item unit price is less than 0 or Order item unit price is not a safe integer", 400)
    }

    if (!Number.isSafeInteger(props.lineTotal) || props.lineTotal < 0) {
      throw new OrderDomainError("Order item linetotal is less than 0 or Order item linetotal is not a safe integer", 400)
    }
  }

  public getId(): string {
    return this.id
  }

  public getOrderId(): string {
    return this.orderId
  }

  public getMenuItemId(): string {
    return this.menuItemId
  }

  public getItemName(): string {
    return this.itemName
  }

  public getUnitPrice(): number {
    return this.unitPrice
  }

  public getQuantity(): number {
    return this.quantity
  }

  public getLineTotal(): number {
    return this.lineTotal
  }

  public getCreatedAt(): Date {
    return this.createdAt
  }

  public getUpdatedAt(): Date {
    return this.updatedAt
  }

}
