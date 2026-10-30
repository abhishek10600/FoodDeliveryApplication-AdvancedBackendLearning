import { AddressCity } from "../value-objects/address-city.vo.js"
import { AddressCountry } from "../value-objects/address-country.vo.js"
import { AddressHouseName } from "../value-objects/address-house-name.vo.js"
import { AddressLandmark } from "../value-objects/address-landmark.vo.js"
import { AddressPin } from "../value-objects/address-pin.vo.js"
import { AddressState } from "../value-objects/address-state.vo.js"
import { AddressStreetName } from "../value-objects/address-street-name.vo.js"

export interface IAddressProps {
  id: string
  customerId: string
  houseName: AddressHouseName,
  streetName: AddressStreetName,
  landmark?: AddressLandmark,
  city: AddressCity,
  state: AddressState,
  country: AddressCountry,
  pin: AddressPin,
  isDefault: boolean,
  createdAt: Date,
  updatedAt: Date
}

export interface IAddressCreateProps {
  id: string
  customerId: string
  houseName: AddressHouseName,
  streetName: AddressStreetName,
  landmark?: AddressLandmark,
  city: AddressCity,
  state: AddressState,
  country: AddressCountry,
  pin: AddressPin,
  isDefault: boolean,
  createdAt: Date,
  updatedAt: Date
}

export interface IAddressUpdateProps {
  houseName?: AddressHouseName,
  streetName?: AddressStreetName,
  landmark?: AddressLandmark,
  city?: AddressCity,
  state?: AddressState,
  country?: AddressCountry,
  pin?: AddressPin,
}

export class Address {

  private readonly id: string
  private readonly customerId: string
  private houseName: AddressHouseName
  private streetName: AddressStreetName
  private landmark?: AddressLandmark
  private city: AddressCity
  private state: AddressState
  private country: AddressCountry
  private pin: AddressPin
  private isDefault: boolean
  private readonly createdAt: Date
  private updatedAt: Date

  constructor(props: IAddressProps) {
    this.id = props.id
    this.customerId = props.customerId
    this.houseName = props.houseName
    this.streetName = props.streetName
    this.landmark = props.landmark
    this.city = props.city
    this.state = props.state
    this.country = props.country
    this.pin = props.pin
    this.isDefault = props.isDefault
    this.createdAt = props.createdAt
    this.updatedAt = props.updatedAt
  }

  public static create(props: IAddressCreateProps): Address {
    const now = new Date()

    return new Address({
      id: crypto.randomUUID(),
      customerId: props.customerId,
      houseName: props.houseName,
      streetName: props.streetName,
      landmark:  props.landmark,
      city: props.city,
      state: props.state,
      country: props.country,
      pin: props.pin,
      isDefault: props.isDefault,
      createdAt: now,
      updatedAt: now
    })
  }

  public static rehydrate(props: IAddressProps): Address {
    return new Address(props)
  }

  public update(props: IAddressUpdateProps): void {
    if (props.houseName !== undefined) {
      this.houseName = props.houseName
    }

    if (props.streetName !== undefined) {
      this.streetName = props.streetName
    }

    if (props.landmark !== undefined) {
      this.landmark = props.landmark
    }

    if (props.city !== undefined) {
      this.city = props.city
    }

    if (props.state !== undefined) {
      this.state = props.state
    }

    if (props.country !== undefined) {
      this.country = props.country
    }

    if (props.pin !== undefined) {
      this.pin = props.pin
    }

    this.touch()
  }

  public updateIsDefault(): void {
    if (this.isDefault) {
      this.isDefault = false
    } else {
      this.isDefault = true
    }

    this.touch()
  }

  public getId(): string {
    return this.id
  }

  public getCustomerId(): string {
    return this.customerId
  }

  public getHouseName(): AddressHouseName {
    return this.houseName
  }

  public getStreetName(): AddressStreetName {
    return this.streetName
  }

  public getLandmark(): AddressLandmark | undefined {
    return this.landmark
  }

  public getCity(): AddressCity {
    return this.city
  }

  public getState(): AddressState {
    return this.state
  }

  public getCountry(): AddressCountry {
    return this.country
  }

  public getPin(): AddressPin {
    return this.pin
  }

  public getIsDefault(): boolean {
    return this.isDefault
  }

  public getCreatedAt(): Date {
    return this.createdAt
  }

  public getUpdatedAt(): Date {
    return this.updatedAt
  }

  private touch(): void {
    this.updatedAt = new Date()
  }


}
