import { MenuDomainError } from "../errors/menu-domain.error.js"

export class MenuItemName {

  private static MENU_ITEM_NAME_MIN: number = 1
  private static MENU_ITEM_NAME_MAX: number = 100

  private readonly value: string

  constructor(value: string) {
    this.value = value
  }

  public static create(value: string): MenuItemName {
    const normalizedValue = MenuItemName.normalize(value)

    MenuItemName.validate(normalizedValue)

    return new MenuItemName(normalizedValue)

  }

  private static normalize(value: string): string {
    const normalizedValue = value.trim().replace(/\s+/g, " ")

    return normalizedValue
  }

  private static validate(value: string): void {

    if (typeof (value) !== "string" || typeof (value) === undefined) {
      throw new MenuDomainError("Menu item name must be opf type string", 400)
    }

    if (value.length < MenuItemName.MENU_ITEM_NAME_MIN) {
      throw new MenuDomainError(`Menu item name must contain at least ${MenuItemName.MENU_ITEM_NAME_MIN} characters`, 400)
    }

    if (value.length > MenuItemName.MENU_ITEM_NAME_MAX) {
      throw new MenuDomainError(`Menu item name cannot contain more than ${MenuItemName.MENU_ITEM_NAME_MAX} characters`, 400)
    }

  }

  public getValue(): string {
    return this.value
  }

  public equals(other: MenuItemName): boolean {
    return this.value === other.value
  }

  public toString(): string {
    return this.value
  }
}
