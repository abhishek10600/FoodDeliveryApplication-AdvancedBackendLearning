import { MenuStatus } from "../enums/menu-status.enum.js"
import { MenuDomainError } from "../errors/menu-domain.error.js"
import { MenuName } from "../value-objects/menu-name.vo.js"

export interface IMenuProps {
  id: string
  restaurantId: string
  name: MenuName
  status: MenuStatus
  createdAt: Date
  updatedAt: Date
}

export interface ICreateMenuProps {
  restaurantId: string
  name: MenuName
}

export class Menu {

  private readonly id: string
  private readonly restaurantId: string
  private name: MenuName
  private status: MenuStatus
  private readonly createdAt: Date
  private updatedAt: Date

  constructor(props: IMenuProps) {
    this.id = props.id
    this.restaurantId = props.restaurantId
    this.name = props.name
    this.status = props.status
    this.createdAt = props.createdAt
    this.updatedAt = props.updatedAt
  }

  public static create(props: ICreateMenuProps): Menu {
    const now = new Date()

    return new Menu({
      id: crypto.randomUUID(),
      restaurantId: props.restaurantId,
      name: props.name,
      status: MenuStatus.ACTIVE,
      createdAt: now,
      updatedAt: now
    })
  }

  public static rehydrate(props: IMenuProps): Menu {
    return new Menu({
      id: props.id,
      restaurantId: props.restaurantId,
      name: props.name,
      status: props.status,
      createdAt: props.createdAt,
      updatedAt: props.updatedAt
    })
  }

  public updateMenuName(name: MenuName): void {
    this.name = name
    this.touch()
  }

  public activateMenu(): void {
    if (this.status === MenuStatus.ACTIVE) {
      throw new MenuDomainError(`Menu already active. Cannot activate a menu that is already active`, 400)
    }

    this.status = MenuStatus.ACTIVE
    this.touch()
  }

  public deactiveateMenu(): void {
    if (this.status === MenuStatus.INACTIVE) {
      throw new MenuDomainError(`Menu already deactivate. Cannot deactivate a menu that is already inactive`, 400)
    }

    this.status = MenuStatus.INACTIVE
    this.touch()
  }

  public getId(): string {
    return this.id
  }

  public getRestaurantId(): string {
    return this.restaurantId
  }

  public getName(): MenuName {
    return this.name
  }

  public getStatus(): MenuStatus {
    return this.status
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
