import { MenuDomainError } from "../errors/menu-domain.error.js"

export class MenuCategoryName {

  private static MENU_CATEGORY_NAME_MIN: number = 1
  private static MENU_CATEGORY_NAME_MAX: number = 100

  private readonly value: string

  constructor(value: string) {
    this.value = value
  }

  public static create(value: string): MenuCategoryName {

    const normalizedValue = MenuCategoryName.normalize(value)

    MenuCategoryName.validate(normalizedValue)

    return new MenuCategoryName(normalizedValue)
  }

  private static normalize(value: string): string {
    const normalizedValue = value.trim().replace(/\s+/g, " ")

    return normalizedValue
  }

  private static validate(value: string): void {

    if (typeof (value) !== "string" || typeof (value) === undefined) {
      throw new MenuDomainError("Menu category name must be of type string", 400)
    }

    if (value.length < MenuCategoryName.MENU_CATEGORY_NAME_MIN) {
      throw new MenuDomainError(`Menu cateogory name must contain at least ${MenuCategoryName.MENU_CATEGORY_NAME_MIN} characters`, 400)
    }

    if (value.length > MenuCategoryName.MENU_CATEGORY_NAME_MAX) {
      throw new MenuDomainError(`Menu category name cannot contain less than ${MenuCategoryName.MENU_CATEGORY_NAME_MAX} characters`, 400)
    }
  }

  public getValue(): string {
    return this.value
  }

  public equals(other: MenuCategoryName): boolean {
    return this.value === other.value
  }

  public toString(): string {
    return this.value
  }
}
