import { CustomerPreferencesType } from "../../types.js";

export interface GetCustomerProfileResult {
  customerId: string;
  userId: string;
  firstName: string;
  lastName: string;
  phone: string;
  avatarUrl: string | null;
  preferences: CustomerPreferencesType;
  createdAt: Date;
  updatedAt: Date
}
