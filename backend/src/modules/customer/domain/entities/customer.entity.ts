import { CustomerDomainError } from "../errors/customer-domain.error.js";
import { CustomerAvatarUrl, CustomerFirstName, CustomerLastName, CustomerPhoneNumber, CustomerPreferences} from "../value-objects/index.js";

export class Customer {

  private readonly id: string;
  private readonly userId: string;
  private firstName: CustomerFirstName;
  private lastName: CustomerLastName;
  private phone: CustomerPhoneNumber;
  private avatarUrl: CustomerAvatarUrl | null;
  private preferences: CustomerPreferences;
  private readonly createdAt: Date;
  private updatedAt: Date;

  constructor(params: {
    id: string;
    userId: string;
    firstName: CustomerFirstName;
    lastName: CustomerLastName;
    phone: CustomerPhoneNumber;
    avatarUrl: CustomerAvatarUrl | null;
    preferences: CustomerPreferences;
    createdAt: Date;
    updatedAt: Date;
  }) {
    this.id = Customer.validateId(params.id)
    this.userId = Customer.validateUserId(params.userId)
    this.firstName = params.firstName
    this.lastName = params.lastName
    this.phone = params.phone
    this.avatarUrl = params.avatarUrl
    this.preferences = params.preferences
    this.createdAt = params.createdAt ?? new Date()
    this.updatedAt =  params.updatedAt ?? new Date()
  }

  public static create(params: {
    userId: string;
    firstName: CustomerFirstName;
    lastName: CustomerLastName;
    phone: CustomerPhoneNumber;
    avatarUrl: CustomerAvatarUrl | null;
    preferences: CustomerPreferences;
    createdAt: Date;
    updatedAt: Date;

  }): Customer {
    const now = new Date()

    return new Customer({
      id: crypto.randomUUID(),
      userId: params.userId,
      firstName: params.firstName,
      lastName: params.lastName,
      phone: params.phone,
      avatarUrl: params.avatarUrl ?? null,
      preferences: params.preferences ?? CustomerPreferences.default(),
      createdAt: now,
      updatedAt: now
    })
  }

  public getId(): string {
    return this.id
  }

  public getUserId(): string {
    return this.userId
  }

  public getFirstName(): CustomerFirstName {
    return this.firstName
  }

  public getLastName(): CustomerLastName {
    return this.lastName
  }

  public getPhone(): CustomerPhoneNumber | null {
    return this.phone
  }

  public getPreferences(): CustomerPreferences {
    return this.preferences
  }

  public getAvatarUrl(): CustomerAvatarUrl | null {
    return this.avatarUrl
  }

  public getUpdatedAt(): Date {
    return this.updatedAt;
  }

  public getCreatedAt(): Date {
    return this.createdAt;
  }

  public static rehydrate(params: {
    id: string;
    userId: string;
    firstName: CustomerFirstName;
    lastName: CustomerLastName;
    preferences: CustomerPreferences;
    phone: CustomerPhoneNumber;
    avatarUrl: CustomerAvatarUrl | null;
    createdAt: Date;
    updatedAt: Date;

  }) {
    return new Customer(params)
  }

  public updateCustomerProfile(params: {
    firstName?: CustomerFirstName;
    lastName?: CustomerLastName;
    phone?: CustomerPhoneNumber;
  }):void {
    if (params.firstName !== undefined) {
      this.firstName = params.firstName
    }

    if (params.lastName !== undefined) {
      this.lastName = params.lastName
    }

    if (params.phone !== undefined) {
      this.phone = params.phone
    }

    this.touch()
  }

  public updatePreferences(preferences: CustomerPreferences): void {
    this.preferences = preferences

    this.touch()
  }

  public updateLanguagePreference(language: string): void {
    this.preferences = this.preferences.withLanguage(language)

    this.touch()
  }

  public updateNotificationPreference(notifications: {
    push: boolean;
    sms: boolean;
    email: boolean;
  }): void {
    this.preferences = this.preferences.withNotifications(notifications)

    this.touch()
  }

  public updateMarketingPreference(marketing: {
    enabled: boolean;
  }): void {
    this.preferences = this.preferences.withMarketing(marketing)

    this.touch()
  }

  public changeAvatarUrl(avatarUrl: CustomerAvatarUrl): void {
    this.avatarUrl = avatarUrl

    this.touch()
  }

  public removeAvatarUrl(): void {

    if (this.avatarUrl !== null) {
      this.avatarUrl = null;
    }

    this.touch()
  }

  private touch(): void {
    this.updatedAt = new Date()
  }

  public toPrimitives() {
    return {
      id: this.id,
      userId: this.userId,
      firstName: this.firstName.getValue(),
      lastName: this.lastName.getValue(),
      phone: this.phone.getValue(),
      avatarUrl: this.avatarUrl?.getValue() ?? null,
      preferences: this.preferences.toPrimitives(),
      createdAt: new Date(this.createdAt),
      updatedAt: new Date(this.updatedAt)

    }
  }

  private static validateId(id: string): string {
    if (typeof id !== "string") {
      throw new CustomerDomainError("Customer id must be of type string")
    }

    if (!id || id.trim().length === 0) {
      throw new CustomerDomainError("Customer id cannot be empty")
    }

    return id.trim()
  }

  private static validateUserId(userId: string): string {
    if (typeof userId !== "string") {
      throw new CustomerDomainError("User id must be of type string")
    }

    if (!userId || userId.trim().length === 0) {
      throw new CustomerDomainError("User id cannot be empty")
    }

    return userId.trim()
  }
}
