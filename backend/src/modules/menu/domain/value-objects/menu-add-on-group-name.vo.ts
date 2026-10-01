import { MenuDomainError } from "../errors/menu-domain.error.js"

export class MenuAddOnGroupName {

  private static MENU_ADD_ON_GROUP_NAME_MIN: number = 1
  private static MENU_ADD_ON_GROUP_NAME_MAX: number = 100

  private readonly value: string

  constructor(value: string) {
    this.value = value
  }

  public static create(value: string): MenuAddOnGroupName {
    const normalizedValue = MenuAddOnGroupName.normalize(value)

    MenuAddOnGroupName.validate(normalizedValue)

    return new MenuAddOnGroupName(normalizedValue)
  }

  private static normalize(value: string): string {
    const normalizedValue = value.trim().replace(/\s+/g, " ")

    return normalizedValue
  }

  private static validate(value: string): void {
    if (typeof (value) !== "string" || typeof (value) === undefined) {
      throw new MenuDomainError("Menu add on group name must be opf type string", 400)
    }

    if (value.length < MenuAddOnGroupName.MENU_ADD_ON_GROUP_NAME_MIN) {
      throw new MenuDomainError(`Menu add on group name must contain at least ${MenuAddOnGroupName.MENU_ADD_ON_GROUP_NAME_MIN} characters`, 400)
    }

    if (value.length > MenuAddOnGroupName.MENU_ADD_ON_GROUP_NAME_MAX) {
      throw new MenuDomainError(`Menu add on group name cannot contain more than ${MenuAddOnGroupName.MENU_ADD_ON_GROUP_NAME_MAX} characters`, 400)
    }
  }

  public getValue(): string {
    return this.value
  }

  public equals(other: MenuAddOnGroupName): boolean {
    return this.value === other.value
  }

  public toString(): string {
    return this.value
  }
}
