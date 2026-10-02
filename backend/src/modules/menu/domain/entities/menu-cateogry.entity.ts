import { MenuCategoryStatus } from "../enums/menu-category-status.enum.js"
import { MenuDomainError } from "../errors/menu-domain.error.js"
import { MenuCategoryDescription } from "../value-objects/menu-category-description.vo.js"
import { MenuCategoryName } from "../value-objects/menu-category-name.vo.js"

export interface IMenuCategoryProps {
  id: string
  menuId: string
  name: MenuCategoryName
  description: MenuCategoryDescription | null
  displayOrder: number
  status: MenuCategoryStatus
  createdAt: Date
  updatedAt: Date
}

export interface IMenuCategoryCreateProps {
  menuId: string
  name: MenuCategoryName
  description?: MenuCategoryDescription
  displayOrder?: number
}

export class MenuCategory {

  private readonly id: string
  private readonly menuId: string
  private name: MenuCategoryName
  private description: MenuCategoryDescription | null
  private displayOrder: number
  private status: MenuCategoryStatus
  private readonly createdAt: Date
  private updatedAt: Date

  constructor(props: IMenuCategoryProps) {
    this.id = props.id
    this.menuId = props.menuId
    this.name = props.name
    this.description = props.description ?? null
    this.displayOrder = props.displayOrder
    this.status = props.status
    this.createdAt = props.createdAt
    this.updatedAt = props.updatedAt
  }

  public static create(props: IMenuCategoryCreateProps): MenuCategory {
    const now = new Date()

    if (props.displayOrder !== undefined) {
      MenuCategory.validateDisplayOrder(props.displayOrder)
    }

    return new MenuCategory({
      id: crypto.randomUUID(),
      menuId: props.menuId,
      name: props.name,
      description: props.description ?? null,
      displayOrder: props.displayOrder ?? 0,
      status: MenuCategoryStatus.ACTIVE,
      createdAt: now,
      updatedAt: now
    })
  }

  public static rehydrate(props: IMenuCategoryProps): MenuCategory {
    return new MenuCategory(props)
  }

  public updateMenuCategoryName(name: MenuCategoryName): void {
    this.name = name
    this.touch()
  }

  public updateMenuCategoryDescription(description: MenuCategoryDescription): void {
    this.description = description
    this.touch()
  }

  public updateDisplayOrder(displayOrder: number): void {

    MenuCategory.validateDisplayOrder(displayOrder)

    this.displayOrder = displayOrder
    this.touch()
  }

  public activateMenuCategory() {
    if (this.status === MenuCategoryStatus.ACTIVE) {
      throw new MenuDomainError("Menu category status is already active", 400)
    }

    this.status = MenuCategoryStatus.ACTIVE
    this.touch()
  }

  public deactivateMenuCategory() {
    if (this.status === MenuCategoryStatus.INACTIVE) {
      throw new MenuDomainError("Menu category status is already inactive", 400)
    }

    this.status = MenuCategoryStatus.INACTIVE
    this.touch()
  }

  public getId(): string {
    return this.id
  }

  public getMenuId(): string {
    return this.menuId
  }

  public getName(): MenuCategoryName {
    return this.name
  }

  public getDescription(): MenuCategoryDescription | null {
    return this.description
  }

  public getDisplayOrder(): number {
    return this.displayOrder
  }

  public getStatus(): MenuCategoryStatus {
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

  private touch(): void {
    this.updatedAt = new Date()
  }

}
