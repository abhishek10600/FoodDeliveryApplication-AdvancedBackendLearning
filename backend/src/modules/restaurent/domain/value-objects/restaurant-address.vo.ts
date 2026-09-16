import { InvalidRestaurantAddressError } from "../errors/invalid-restaurant-address.error.js";

export interface RestaurantAddressProps {
  line1: string;
  landMark: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;
}

export class RestaurantAddress {
  private readonly line1: string;
  private readonly landMark: string;
  private readonly city: string;
  private readonly state: string;
  private readonly country: string;
  private readonly postalCode: string;

  constructor(props: {
    line1: string;
    landMark: string;
    city: string;
    state: string;
    country: string;
    postalCode: string;
  }) {
    this.line1 = props.line1
    this.landMark = props.landMark
    this.city = props.city
    this.state = props.state
    this.country = props.country
    this.postalCode = props.postalCode
  }

  public static create(value: RestaurantAddressProps): RestaurantAddress {
    const normalizedValue = RestaurantAddress.normalize(value)

    RestaurantAddress.validate(normalizedValue)

    return new RestaurantAddress(normalizedValue)
  }

  private static normalize(value: RestaurantAddressProps): RestaurantAddressProps {
    return {
      line1: value.line1.trim().toLowerCase(),
      landMark: value.landMark.trim().toLowerCase(),
      city: value.city.trim().toLowerCase(),
      state: value.state.trim().toLowerCase(),
      country: value.country.trim().toLowerCase(),
      postalCode: value.postalCode.trim().toLowerCase(),
    }
  }

  private static validate(value: RestaurantAddressProps): void {
    if (typeof (value.line1) !== "string") {
      throw new InvalidRestaurantAddressError()
    }

    if (typeof (value.landMark) !== "string") {
      throw new InvalidRestaurantAddressError()
    }

    if (typeof (value.city) !== "string") {
      throw new InvalidRestaurantAddressError()
    }

    if (typeof (value.state) !== "string") {
      throw new InvalidRestaurantAddressError()
    }

    if (typeof (value.country) !== "string") {
      throw new InvalidRestaurantAddressError()
    }

    if (typeof (value.postalCode) !== "string") {
      throw new InvalidRestaurantAddressError()
    }
  }

  public getLine1(): string {
    return this.line1
  }

  public getlandMark(): string {
    return this.landMark
  }

  public getCity(): string {
    return this.city
  }

  public getState(): string {
    return this.state
  }

  public getCountry(): string {
    return this.country
  }

  public getPostalCode(): string {
    return this.postalCode
  }

  public equals(other: RestaurantAddressProps): boolean {
    return (
      this.line1 === other.line1 &&
      this.landMark === other.landMark &&
      this.city === other.city &&
      this.state === other.state &&
      this.country === other.country &&
      this.postalCode === other.postalCode
    )
  }
}
