import { MenuDomainError } from "../errors/menu-domain.error.js"

export class MenuAddOnName {

  private static MENU_ADD_ON_NAME_MIN: number = 1
  private static MENU_ADD_ON_NAME_MAX: number = 100

  private readonly value: string

  constructor(value: string) {
    this.value = value
  }

  public static create(value: string): MenuAddOnName {
    const normalizedValue = MenuAddOnName.normalize(value)

    MenuAddOnName.validate(normalizedValue)

    return new MenuAddOnName(normalizedValue)
  }

  private static normalize(value: string): string {
    const normalizedValue = value.trim().replace(/\s+/g, " ")

    return normalizedValue
  }

  private static validate(value: string): void {
    if (typeof (value) !== "string" || typeof (value) === undefined) {
      throw new MenuDomainError("Menu add on group name must be opf type string", 400)
    }

    if (value.length < MenuAddOnName.MENU_ADD_ON_NAME_MIN) {
      throw new MenuDomainError(`Menu add on name must contain at least ${MenuAddOnName.MENU_ADD_ON_NAME_MIN} characters`, 400)
    }

    if (value.length > MenuAddOnName.MENU_ADD_ON_NAME_MAX) {
      throw new MenuDomainError(`Menu add on name cannot contain more than ${MenuAddOnName.MENU_ADD_ON_NAME_MAX} characters`, 400)
    }
  }

  public getValue(): string {
    return this.value
  }

  public equals(other: MenuAddOnName): boolean {
    return this.value === other.value
  }

  public toString(): string {
    return this.value
  }
}
