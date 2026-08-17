import { Role } from "../../modules/identity/domain/enums/role.enum.js";

export interface CurrentUser {
  id: string;
  roles: Role[]
}
