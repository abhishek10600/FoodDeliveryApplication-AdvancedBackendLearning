import { MenuItemStatus } from "../enums/menu-item-status.enum.js"
import { MenuDomainError } from "../errors/menu-domain.error.js"
import { MenuItemDescription } from "../value-objects/menu-item-description.vo.js"
import { MenuItemImageUrl } from "../value-objects/menu-item-image-url.vo.js"
import { MenuItemName } from "../value-objects/menu-item-name.vo.js"

export interface IMenuItemProps {
  id: string
  menuCategoryId: string
  name: MenuItemName
  description: MenuItemDescription | null
  imageUrl: MenuItemImageUrl | null
  status: MenuItemStatus
  price: number
  currency: string
  displayOrder: number
  isAvailable: boolean
  createdAt: Date
  updatedAt: Date
}

export interface IMenuItemCreateProps {
  menuCategoryId: string
  name: MenuItemName
  description: MenuItemDescription | null
  imageUrl: MenuItemImageUrl | null
  price: number
  currency: string
  displayOrder: number
}

export class MenuItem {
  private readonly id: string
  private readonly menuCategoryId: string
  private name: MenuItemName
  private description: MenuItemDescription | null
  private imageUrl: MenuItemImageUrl | null
  private status: MenuItemStatus
  private price: number
  private currency: string
  private displayOrder: number
  private isAvailable: boolean
  private readonly createdAt: Date
  private updatedAt: Date

  constructor(props: IMenuItemProps) {
    this.id = crypto.randomUUID()
    this.menuCategoryId = props.menuCategoryId
    this.name = props.name
    this.description = props.description ?? null
    this.imageUrl = props.imageUrl ?? null
    this.status = MenuItemStatus.ACTIVE
    this.price = props.price
    this.currency = props.currency
    this.displayOrder = props.displayOrder ?? 0
    this.isAvailable = props.isAvailable
    this.createdAt = props.createdAt
    this.updatedAt = props.updatedAt
  }

  public static create(props: IMenuItemCreateProps): MenuItem {
    const now = new Date()

    MenuItem.validateDisplayOrder(props.displayOrder)

    return new MenuItem({
      id: crypto.randomUUID(),
      menuCategoryId: props.menuCategoryId,
      name: props.name,
      description: props.description ?? null,
      imageUrl: props.imageUrl ?? null,
      status: MenuItemStatus.ACTIVE,
      price: props.price,
      currency: props.currency,
      displayOrder: props.displayOrder ?? 0,
      isAvailable: true,
      createdAt: now,
      updatedAt: now
    })

  }

  public static rehydrate(props: IMenuItemProps): MenuItem {
    return new MenuItem(props)
  }

  public updateName(name: MenuItemName): void {
    this.name = name
    this.touch()
  }

  public updateDescription(description: MenuItemDescription): void {
    this.description = description
    this.touch()
  }

  public updateImageUrl(imageUrl: MenuItemImageUrl): void {
    this.imageUrl = imageUrl
    this.touch()
  }

  public activateStatus(): void {
    if (this.status === MenuItemStatus.ACTIVE) {
      throw new MenuDomainError("Menu item status is already active", 400)
    }

    this.status = MenuItemStatus.ACTIVE
    this.touch()
  }

  public deactivateStatus(): void {
    if (this.status === MenuItemStatus.INACTIVE) {
      throw new MenuDomainError("Menu item status is already inactive", 400)
    }

    this.status = MenuItemStatus.INACTIVE
    this.touch()
  }

  public updatePrice(price: number): void {
    this.price = price
    this.touch()
  }

  public updateCurrency(currency: string): void {
    this.currency = currency
    this.touch()
  }

  public updateDisplayOrder(displayOrder: number): void {
    MenuItem.validateDisplayOrder(displayOrder)

    this.displayOrder = displayOrder
    this.touch()
  }


  public updateAvailability(): void {
    if (this.isAvailable) {
      this.isAvailable = false
    } else {
      this.isAvailable = true
    }

    this.touch()
  }

  public getId(): string {
    return this.id
  }

  public getMenuCategoryId(): string {
    return this.menuCategoryId
  }

  public getName(): MenuItemName {
    return this.name
  }

  public getDescription(): MenuItemDescription | null {
    return this.description
  }

  public getImageUrl(): MenuItemImageUrl | null {
    return this.imageUrl
  }

  public getStatus(): MenuItemStatus {
    return this.status
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

  public getIsAvailable(): boolean {
    return this.isAvailable
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

  private touch(): void {
    this.updatedAt = new Date()
  }
}
