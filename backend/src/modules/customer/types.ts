export type CustomerPreferencesType = {
  language: string;
  notifications: {
    push: boolean;
    sms: boolean;
    email: boolean;
  },
  marketing: {
    enabled: boolean
  }
}
