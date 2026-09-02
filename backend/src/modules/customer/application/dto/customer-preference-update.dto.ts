export interface CustomerPreferenceUpdateInput {
  userId: string;
  language?: string;
  notifications?: {
    push?: boolean;
    sms?: boolean;
    email?: boolean;
  },
  marketing?: {
    enabled?: boolean;
  }
}
