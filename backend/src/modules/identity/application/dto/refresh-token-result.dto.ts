import { Role } from "../../domain/enums/role.enum.js";
import { UserStatus } from "../../domain/enums/user-status.enum.js";

export interface RefreshTokenResult {
  user: {
    id: string;
    email: string;
    roles: Role[];
    status: UserStatus;
    emailVerified: boolean
  },
  accessToken: string;
  refreshToken: string;
}
