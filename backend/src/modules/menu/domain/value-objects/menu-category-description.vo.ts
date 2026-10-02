import { MenuDomainError } from "../errors/menu-domain.error.js"

export class MenuCategoryDescription {

  private static MENU_CATEGORY_DESCRIPTION_MAX: number = 500

  private readonly value: string

  constructor(value: string) {
    this.value = value
  }

  public static create(value: string): MenuCategoryDescription {

    const normalizedValue = MenuCategoryDescription.normalize(value)

    MenuCategoryDescription.validate(normalizedValue)

    return new MenuCategoryDescription(normalizedValue)
  }

  private static normalize(value: string): string {
    const normalizedValue = value.trim().replace(/\s+/g, " ")

    return normalizedValue
  }

  private static validate(value: string): void {

    if (typeof (value) !== "string" || typeof (value) === undefined) {
      throw new MenuDomainError("Menu category description must be of type string", 400)
    }

    if (value.length > MenuCategoryDescription.MENU_CATEGORY_DESCRIPTION_MAX) {
      throw new MenuDomainError(`Menu category description cannot contain less than ${MenuCategoryDescription.MENU_CATEGORY_DESCRIPTION_MAX} characters`, 400)
    }
  }

  public getValue(): string {
    return this.value
  }

  public equals(other: MenuCategoryDescription): boolean {
    return this.value === other.value
  }

  public toString(): string {
    return this.value
  }
}
