import { MenuDomainError } from "../errors/menu-domain.error.js"

export class MenuItemImageUrl {

  private readonly value: string | null

  constructor(value: string | null) {
    this.value = value
  }

  public static create(value: string | null): MenuItemImageUrl {

    if (value) {
      const normalizedValue = MenuItemImageUrl.normalize(value)

      MenuItemImageUrl.validate(normalizedValue)
    }

    return new MenuItemImageUrl(value)
  }

  private static normalize(value: string): string {
    const trimmedValue = value.trim()

    if (trimmedValue.length === 0) {
      throw new MenuDomainError("Menu item image url cannot be empty", 400)
    }

    return trimmedValue
  }

  private static validate(value: string): void {
    let url: URL

    try {
      url = new URL(value)
    } catch{
      throw new MenuDomainError("Menu item image url must be a valid url", 400)
    }

    if (url.protocol !== "https:") {
      throw new MenuDomainError("Menu item image url must use HTTPs", 400)
    }
  }

  public getValue(): string | null {
    return this.value
  }

  public equals(other: MenuItemImageUrl): boolean {
    return this.value === other.value
  }

  public toString(): string | null{
    return this.value
  }
}
