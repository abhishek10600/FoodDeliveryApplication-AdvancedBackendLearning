import { MenuAddOnGroupStatus } from "../enums/menu-add-on-group-status.enum.js"
import { MenuDomainError } from "../errors/menu-domain.error.js"
import { MenuAddOnGroupName } from "../value-objects/menu-add-on-group-name.vo.js"

export interface IMenuAddOnGroup {
  id: string
  menuItemId: string
  name: MenuAddOnGroupName,
  minSelections: number
  maxSelections: number
  status: MenuAddOnGroupStatus
  displayOrder: number
  createdAt: Date
  updatedAt: Date
}

export interface IMenuAddOnGroupCreate {
  menuItemId: string
  name: MenuAddOnGroupName,
  minSelections?: number
  maxSelections?: number
  displayOrder?: number
}

export interface IMenuAddOnGroupUpdate {
  name?: MenuAddOnGroupName,
  minSelection?: number
  maxSelections?: number
}

export class MenuAddOnGroup {

  private static MAX_SELECTIONS: number = 1


  private readonly id: string
  private readonly menuItemId: string
  private name: MenuAddOnGroupName
  private minSelections: number
  private maxSelections: number
  private status: MenuAddOnGroupStatus
  private displayOrder: number
  private readonly createdAt: Date
  private updatedAt: Date

  constructor(props: IMenuAddOnGroup) {
    this.id = props.id
    this.menuItemId = props.menuItemId
    this.name = props.name
    this.minSelections = props.minSelections
    this.maxSelections = props.maxSelections
    this.status = props.status
    this.displayOrder = props.displayOrder
    this.createdAt = props.createdAt
    this.updatedAt = props.updatedAt
  }

  public static create(props: IMenuAddOnGroupCreate): MenuAddOnGroup {
    const now = new Date()

    if (props.displayOrder !== undefined) {
     MenuAddOnGroup.validateDisplayOrder(props.displayOrder)
    }

    if (props.minSelections !== undefined) {
      MenuAddOnGroup.validateMinSelections(props.minSelections)
    }

    if (props.maxSelections !== undefined) {
      MenuAddOnGroup.validateMaxSelections(props.maxSelections)
    }

    return new MenuAddOnGroup({
      id: crypto.randomUUID(),
      menuItemId: props.menuItemId,
      name: props.name,
      minSelections: props.minSelections ?? 0,
      maxSelections: props.maxSelections ?? 1,
      displayOrder: props.displayOrder ?? 0,
      status: MenuAddOnGroupStatus.ACTIVE,
      createdAt: now,
      updatedAt: now
    })
  }

  public static rehydrate(props: IMenuAddOnGroup): MenuAddOnGroup {
    return new MenuAddOnGroup(props)
  }

  public update(props: IMenuAddOnGroupUpdate): void {

    const minSelections = props.minSelection ?? this.minSelections
    const maxSelections = props.maxSelections ?? this.maxSelections

    if (props.name !== undefined) {
     this.name = props.name
    }

    this.minSelections = minSelections
    this.maxSelections = maxSelections

    this.touch()
  }

  public activeteStatus(): void {
    if (this.status === MenuAddOnGroupStatus.ACTIVE) {
      throw new MenuDomainError(`Menu add on group status is already active.`, 400)
    }

    this.status = MenuAddOnGroupStatus.INACTIVE

    this.touch()
  }

  public deactivateStatus(): void {
    if (this.status === MenuAddOnGroupStatus.INACTIVE) {
      throw new MenuDomainError(`Menu add on group status is already inactive`, 400)
    }

    this.status = MenuAddOnGroupStatus.ACTIVE

    this.touch()
  }

  public changeDisplayOrder(displayOrder: number): void {
    MenuAddOnGroup.validateDisplayOrder(displayOrder)

    this.displayOrder = displayOrder

    this.touch()
  }

  public getId(): string {
    return this.id
  }

  public getMenuItemId(): string {
    return this.menuItemId
  }

  public getName(): MenuAddOnGroupName {
    return this.name
  }

  public getMinSelections(): number {
    return this.minSelections
  }

  public getMaxSelections(): number {
    return this.maxSelections
  }

  public getStatus(): MenuAddOnGroupStatus {
    return this.status
  }

  public getDisplayOrder(): number {
    return this.displayOrder
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

  private static validateMinSelections(minSelection: number): void {
    if (!Number.isInteger(minSelection)) {
      throw new MenuDomainError("Min selection must be an integer", 400)
    }

    if (minSelection < 0) {
      throw new MenuDomainError("Min selection cannot be negative", 400)
    }

    if (minSelection > this.MAX_SELECTIONS) {
      throw new MenuDomainError(`Max selections cannot be more than ${this.MAX_SELECTIONS}`, 400)
    }
  }

  private static validateMaxSelections(maxSelection: number): void {
    if (!Number.isInteger(maxSelection)) {
      throw new MenuDomainError("Max selection must be an integer", 400)
    }

    if (maxSelection < 0) {
      throw new MenuDomainError("Min selection cannot be negative", 400)
    }
  }

  private touch(): void {
    this.updatedAt = new Date()
  }

}
