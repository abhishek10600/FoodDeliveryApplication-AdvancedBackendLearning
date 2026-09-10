import { InvalidCuisineNameError } from "../errors/invalid-cusine-name.error.js"

export class CuisineName {

  private static CUISINE_NAME_MIN: number = 1
  private static CUISINE_NAME_MAX: number = 50

  private value: string

  constructor(value: string) {
    this.value = value
  }

  public static create(value: string): CuisineName  {
    const normalizedValue = CuisineName.normalize(value)

    CuisineName.validate(value)

    return new CuisineName(normalizedValue)
  }

  private static normalize(value: string): string {

    if (typeof (value) !== "string") {
      throw new InvalidCuisineNameError("Cuisine name must be a string")
    }

    const normalizedValue = value.trim().replace(/\s+/g, " ")

    return normalizedValue
  }

  private static validate(value: string): void {
    if (value.length < CuisineName.CUISINE_NAME_MIN) {
      throw new InvalidCuisineNameError("Cuisine name cannot be empty")
    }

    if (value.length > CuisineName.CUISINE_NAME_MAX) {
      throw new InvalidCuisineNameError(`Cuisine name cannot be more than ${CuisineName.CUISINE_NAME_MAX} characters`)
    }
  }

  public getValue(): string {
    return this.value
  }

  public equals(other: CuisineName): boolean {
    return other.value === this.value
  }

  public toString(): string {
    return this.value
  }

}
