import { CustomerPreferencesType } from "../../types.js";

export interface CustomerProfileCreationResult {
  id: string;
  userId: string;
  firstName: string;
  lastName: string;
  phone: string;
  avatarUrl?: string | null;
  preferences: CustomerPreferencesType;
  createdAt: Date;
  updatedAt: Date;
}
