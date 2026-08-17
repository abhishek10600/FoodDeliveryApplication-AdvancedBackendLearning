import { injectable, inject } from "tsyringe"
import { IdentityTokens } from "../../modules/identity/infrastructure/persistence/tokens/identity.tokens.js";
import type { IJWTService } from "../../modules/identity/domain/services/jwt.service.js";
import { catchAsync } from "../../shared/utils/CatchAsync.js";
import { NextFunction, Request, Response } from "express";
import { AuthenticationError } from "../../shared/errors/AuthenticationError.js";

@injectable()
export class AuthenticationMiddleware {
  constructor(

    @inject(IdentityTokens.JwtService)
    private readonly jwtService: IJWTService

  ) { }

  authenticate = catchAsync(async (req: Request, _res: Response, next: NextFunction): Promise<void> => {
    const authorization = req.headers.authorization;

    if (!authorization) {
      throw new AuthenticationError("Authenticaion token is required.")
    }

    const [schema, token] = authorization.split(" ");

    if (schema?.toLowerCase() !== "bearer" || !token) {
      throw new AuthenticationError("Invalid authorization header.")
    }

    const payload = await this.jwtService.verifyAccessToken(token)

    if (!payload.sub) {
      throw new AuthenticationError("Invalid access token")
    }

    req.user = {
      id: payload.sub,
      roles: payload.roles ?? []
    }

    next()
  })
}
