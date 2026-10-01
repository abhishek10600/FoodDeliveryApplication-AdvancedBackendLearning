import { MenuDomainError } from "../errors/menu-domain.error.js"

export class MenuName {

  private static readonly MENU_NAME_MIN: number = 1
  private static readonly MENU_NAME_MAX: number = 100

  private readonly value: string

  constructor(value: string) {
    this.value = value
  }

  public static create(value: string): MenuName {
    const normalizedValue = MenuName.normalize(value)

    MenuName.validate(normalizedValue)

    return new MenuName(normalizedValue)
  }

  private static normalize(value: string): string {
    const normalizedValue = value.trim().replace(/\s+/g, " ")

    return normalizedValue
  }

  private static validate(value: string): void {

    if (typeof (value) !== "string" || typeof (value) === undefined) {
      throw new MenuDomainError("Menu category name must be of type string", 400)
    }

    if (value.length < MenuName.MENU_NAME_MIN) {
      throw new MenuDomainError(`Menu name must contain at least ${MenuName.MENU_NAME_MIN} characters`, 400)
    }

    if (value.length > MenuName.MENU_NAME_MAX) {
      throw new MenuDomainError(`Menu name cannot contain more than ${MenuName.MENU_NAME_MAX} characters`, 400)
    }
  }

  public getValue(): string {
    return this.value
  }

  public equals(other: MenuName): boolean {
    return this.value === other.value
  }

  public toString(): string {
    return this.value
  }
}
