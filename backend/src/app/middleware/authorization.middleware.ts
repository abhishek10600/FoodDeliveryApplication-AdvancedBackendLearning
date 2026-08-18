import { injectable, inject } from "tsyringe";
import { IdentityTokens } from "../../modules/identity/infrastructure/persistence/tokens/identity.tokens.js";
import type { IAuthorizationService } from "../../modules/identity/domain/authorization/authorization.service.js";
import { Permission } from "../../modules/identity/domain/enums/permission.enum.js";
import { NextFunction, Request, Response } from "express";
import { AuthenticationError } from "../../shared/errors/AuthenticationError.js";
import { AuthorizationError } from "../../shared/errors/AuthorizationError.js";

@injectable()
export class AuthorizationMiddleware {

  constructor(

    @inject(IdentityTokens.AuthorizationService)
    private readonly authorizationService: IAuthorizationService

  ) { }

  authorize = (permission: Permission) => {
    return (req: Request, res: Response, next: NextFunction): void => {
      if (!req.user) {
        throw new AuthenticationError("Authentication is required.")
      }

      const authorized = this.authorizationService.hasPermission(req.user.roles, permission)

      if (!authorized) {
        throw new AuthorizationError("You do not have permission to perform this action")
      }

      next()
    }
  }
}
