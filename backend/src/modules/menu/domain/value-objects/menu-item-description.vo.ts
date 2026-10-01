import { MenuDomainError } from "../errors/menu-domain.error.js"

export class MenuItemDescription {

  private static MENU_ITEM_DESCRIPTION_MIN: number = 1
  private static MENU_ITEM_DESCRIPTION_MAX: number = 500

  private readonly value: string

  constructor(value: string) {
    this.value = value
  }

  public static create(value: string): MenuItemDescription {
    const normalizedValue = MenuItemDescription.normalize(value)

    MenuItemDescription.validate(normalizedValue)

    return new MenuItemDescription(normalizedValue)
  }

  private static normalize(value: string): string {
    const normalizedValue = value.trim().replace(/\s+/g, " ")

    return normalizedValue
  }

  private static validate(value: string): void {

    if (typeof (value) !== "string" || typeof (value) === undefined) {
      throw new MenuDomainError("Menu item description must be of type string", 400)
    }

    if (value.length < MenuItemDescription.MENU_ITEM_DESCRIPTION_MIN) {
      throw new MenuDomainError(`Menu item description must contain at least ${MenuItemDescription.MENU_ITEM_DESCRIPTION_MIN} characters`, 400)
    }

    if (value.length > MenuItemDescription.MENU_ITEM_DESCRIPTION_MAX) {
      throw new MenuDomainError(`Menu item description cannot contain more than ${MenuItemDescription.MENU_ITEM_DESCRIPTION_MAX} characters`, 400)
    }

  }

  public getValue(): string {
    return this.value
  }

  public equals(other: MenuItemDescription): boolean {
    return this.value === other.value
  }

  public toString(): string {
    return this.value
  }

}
