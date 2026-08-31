export interface CustomerProfileInput {
  userId: string;
  firstName: string;
  lastName: string;
  phone: string;
  avatarUrl?: string | null;
}
