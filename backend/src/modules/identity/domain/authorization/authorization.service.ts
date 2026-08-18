import { Role } from "../enums/role.enum.js";
import { Permission } from "../enums/permission.enum.js";
import { ROLE_PERMISSIONS } from "./authorization-policy.js";

export interface IAuthorizationService {
  hasPermission(roles: readonly Role[], permission: Permission): boolean;

  hasAnyPermission(roles: readonly Role[], permissions: readonly Permission[]): boolean;

  hasAllPermission(roles: readonly Role[], permissions: readonly Permission[]): boolean;
}

export class AuthorizationService implements IAuthorizationService {

  hasPermission(roles: readonly Role[], permission: Permission): boolean {
    return roles.some((role) => ROLE_PERMISSIONS[role]?.includes(permission) ?? false)
  }

  hasAnyPermission(roles: readonly Role[], permissions: readonly Permission[]): boolean {
    return permissions.some((permission) => this.hasPermission(roles, permission))
  }

  hasAllPermission(roles: readonly Role[], permissions: readonly Permission[]): boolean {
    return permissions.every((permission) => this.hasPermission(roles, permission))
  }
}
