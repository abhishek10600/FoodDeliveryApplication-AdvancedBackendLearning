import { InvalidCustomerPreferencesError } from "../errors/invalid-customer-preferences.error.js";

export interface ICustomerNotificationPreferencesProps {
  push: boolean;
  sms: boolean;
  email: boolean;
}

export interface ICustomerMarketingPreferenceProps {
  enabled: boolean;
}

export interface ICustomerPreferenceProps {
  language: string;
  notifications: ICustomerNotificationPreferencesProps;
  marketing: ICustomerMarketingPreferenceProps
}

export class CustomerPreferences {

  private readonly language: string
  private readonly notifications: ICustomerNotificationPreferencesProps
  private readonly marketing: ICustomerMarketingPreferenceProps

  constructor(props: ICustomerPreferenceProps) {
    this.language = props.language
    this.notifications = Object.freeze({ ...props.notifications })
    this.marketing = Object.freeze({...props.marketing})
  }

  public static create(props: ICustomerPreferenceProps): CustomerPreferences {

    const normalizedProps = CustomerPreferences.normalize(props)

    CustomerPreferences.validate(normalizedProps)

    return new CustomerPreferences(normalizedProps)

  }

  public static default(): CustomerPreferences {

    return CustomerPreferences.create({
      language: "en",
      notifications: {
        push: true,
        sms: true,
        email: true
      },
      marketing: {
        enabled: true
      }
    })
  }

  private static normalize(props: ICustomerPreferenceProps): ICustomerPreferenceProps {

    if (!props || typeof props !== "object") {
      throw new InvalidCustomerPreferencesError("Customer preference must be an object")
    }

    return {
      language: typeof props.language === "string" ? props.language : "",
      notifications: {
        push: props.notifications?.push,
        sms: props.notifications?.sms,
        email: props.notifications?.email
      },
      marketing: {
        enabled: props.marketing?.enabled
      }
    }

  }

  private static validate(props: ICustomerPreferenceProps): void {
    if (!props.language) {
      throw new InvalidCustomerPreferencesError("Language is required in the customer preferences")
    }

    if (props.language.length > 30) {
      throw new InvalidCustomerPreferencesError("Sorry! We could not recognize this language")
    }

    if (typeof props.notifications.push !== "boolean") {
      throw new InvalidCustomerPreferencesError("Push notification preference must be boolean")
    }

    if (typeof props.notifications.sms !== "boolean") {
      throw new InvalidCustomerPreferencesError("SMS notification preference must be boolean")
    }

    if (typeof props.notifications.email !== "boolean") {
      throw new InvalidCustomerPreferencesError("Email notification preference must be boolean")
    }

    if (typeof props.marketing.enabled !== "boolean") {
      throw new InvalidCustomerPreferencesError("Marketing preference must be a boolean")
    }
  }

  public getLanguage(): string {
    return this.language
  }

  public getNotifications(): ICustomerNotificationPreferencesProps {
    return {
      ...this.notifications
    }
  }

  public getMarketing(): ICustomerMarketingPreferenceProps {
    return {
      ...this.marketing
    }
  }

  public toPrimitives(): ICustomerPreferenceProps {
    return {
      language: this.language,
      notifications: {
        ...this.notifications
      },
      marketing: {
        ...this.marketing
      }
    }
  }

  public withLanguage(language: string): CustomerPreferences {
    return CustomerPreferences.create({
      language,
      notifications: {
        ...this.notifications
      },
      marketing: {
        ...this.marketing
      }
    })
  }

  public withNotifications(notifications: ICustomerNotificationPreferencesProps): CustomerPreferences {
    return CustomerPreferences.create({
      language: this.language,
      notifications: {
        ...notifications
      },
      marketing: {
        ...this.marketing
      }
    })
  }

  public withMarketing(marketing: ICustomerMarketingPreferenceProps): CustomerPreferences {
    return CustomerPreferences.create({
      language: this.language,
      notifications: {
        ...this.notifications
      },
      marketing: {
        ...marketing
      }
    })
  }

  public equals(other: ICustomerPreferenceProps): boolean {
    return (
      this.language === other.language &&
      this.notifications.push === other.notifications.push &&
      this.notifications.sms === other.notifications.sms &&
      this.notifications.email === other.notifications.email &&
      this.marketing.enabled === other.marketing.enabled
    )
  }
}
