import { MenuAddOnStatus } from "../enums/menu-add-on-status.enum.js"
import { MenuDomainError } from "../errors/menu-domain.error.js"

export interface IMenuAddOn {
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

export interface IMenuAddOnCreate {
  menuAddOnGroupId: string
  name: string
  price: number
  currency: string
  displayOrder?: number
}

export class MenuAddOn {

  private readonly id: string
  private readonly menuAddOnGroupId: string
  private name: string
  private price: number
  private currency: string
  private displayOrder: number
  private status: MenuAddOnStatus
  private createdAt: Date
  private updatedAt: Date


  constructor(props: IMenuAddOn) {
    this.id = props.id
    this.menuAddOnGroupId = props.menuAddOnGroupId
    this.name = props.name
    this.price = props.price
    this.currency = props.currency
    this.displayOrder = props.displayOrder
    this.status = props.status
    this.createdAt = props.createdAt
    this.updatedAt = props.updatedAt
  }

  public static create(props: IMenuAddOnCreate): MenuAddOn {
    const now = new Date()

    if (props.displayOrder !== undefined) {
      MenuAddOn.validateDisplayOrder(props.displayOrder)
    }

    MenuAddOn.validatePrice(props.price)

    return new MenuAddOn({
      id: crypto.randomUUID(),
      menuAddOnGroupId: props.menuAddOnGroupId,
      name: props.name,
      price: props.price,
      currency: props.currency,
      displayOrder: props.displayOrder ?? 0,
      status: MenuAddOnStatus.ACTIVE,
      createdAt: now,
      updatedAt: now
    })

  }

  public static rehydrate(props: IMenuAddOn): MenuAddOn {
    return new MenuAddOn(props)
  }

  public updateName(name: string): void {
    this.name = name

    this.touch()
  }

  public activateStatus(): void {
    if (this.status === MenuAddOnStatus.ACTIVE) {
      throw new MenuDomainError("Menu add on status is already active.", 400)
    }

    this.status = MenuAddOnStatus.ACTIVE

    this.touch()
  }

  public deactivateStatus(): void {
    if (this.status === MenuAddOnStatus.INACTIVE) {
      throw new MenuDomainError("Menu add on status is already inactive", 400)
    }

    this.status = MenuAddOnStatus.INACTIVE

    this.touch()
  }

  public changeDisplayOrder(displayOrder: number): void {
    MenuAddOn.validateDisplayOrder(displayOrder)

    this.displayOrder = displayOrder

    this.touch()
  }

  public changePrice(price: number): void {
    MenuAddOn.validatePrice(price)

    this.price = price

    this.touch()
  }

  public getId(): string {
    return this.id
  }

  public getMenuAddOnGroupId(): string {
    return this.menuAddOnGroupId
  }

  public getName(): string {
    return this.name
  }

  public getPrice(): number {
    return this.price
  }

  public getCurrency(): string {
    return this.currency
  }

  public getDisplayOrder(): number {
    return this.displayOrder
  }

  public getStatus(): MenuAddOnStatus {
    return this.status
  }

  public getCreatedAt(): Date {
    return this.createdAt
  }

  public getUpdatedAt(): Date {
    return this.updatedAt
  }

  private static validateDisplayOrder(displayOrder: number): void {
    if (!Number.isInteger(displayOrder)) {
      throw new MenuDomainError("Display order must be an integer", 400)
    }

    if (displayOrder < 0) {
      throw new MenuDomainError("Display order cannot be a negative number", 400)
    }
  }

  private static validatePrice(price: number): void {
    if (!Number.isInteger(price)) {
      throw new MenuDomainError("Price must be an integer", 400)
    }

    if (price < 0) {
      throw new MenuDomainError("Price cannot be negative", 400)
    }
  }

  private touch(): void {
    this.updatedAt = new Date()
  }

}
