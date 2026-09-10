import { InvalidCuisineSlugError } from "../errors/invalid-cuisine-slug.error.js";
import { InvalidRestaurantCuisineError } from "../errors/invalud-restaurant-cusine.error.js";
import { CuisineName } from "./cuisine-name.vo.js";

export class CuisineSlug {

  private static CUISINE_SLUG_REFEX = /^[a-z0-9]+(?:-[a-z0-9]+)*$/
  private static CUISINE_SLUG_MIN: number = 1
  private static CUISINE_SLUG_MAX: number = 255

  private readonly value: string;

  constructor(value: string) {
    this.value = value
  }

  public static create(value: string): CuisineSlug {
    const normalizedValue = CuisineSlug.normalize(value)

    CuisineSlug.validate(normalizedValue)

    return new CuisineSlug(normalizedValue)

  }

  public static fromName(name: CuisineName): CuisineSlug {
    const slug = name.getValue()
                     .toLowerCase()
                     .normalize("NFKD")
                     .replace(/[\u0300-\u036f]/g, "")
                     .replace(/[^a-z0-9]+/g, "-")
                     .replace(/^-+|-+$/g, "");

    return new CuisineSlug(slug)
  }

  private static normalize(value: string): string {
    const normalizedValue = value.trim().replace(/\s+/g, " ")

    return normalizedValue
  }

  private static validate(value: string): void {
    if (value.length < CuisineSlug.CUISINE_SLUG_MIN) {
      throw new InvalidCuisineSlugError("Cuisine sluge cannot be empty")
    }

    if (value.length > CuisineSlug.CUISINE_SLUG_MAX) {
      throw new InvalidCuisineSlugError(`Cuisine slug cannot be more than ${CuisineSlug.CUISINE_SLUG_MAX} characters`)
    }

    if (!CuisineSlug.CUISINE_SLUG_REFEX.test(value)) {
      throw new InvalidRestaurantCuisineError("Invalid cuisine slug format")
    }
  }

  public getValue(): string {
    return this.value
  }

  public equals(other: CuisineSlug): boolean {
    return other.value === this.value
  }

  public toString(): string {
    return this.value
  }

}
