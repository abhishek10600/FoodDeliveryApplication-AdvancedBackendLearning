import { Role } from "../../domain/enums/role.enum.js";
import { UserStatus } from "../../domain/enums/user-status.enum.js";

export interface GetCurrentUserResult {
  userId: string;
  email: string;
  roles: Role[];
  status: UserStatus;
  isEmailVerified: boolean;
  createdAt: Date;
  updatedAt: Date
}
