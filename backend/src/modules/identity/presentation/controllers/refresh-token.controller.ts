import { injectable, inject } from "tsyringe";
import { IdentityTokens } from "../../infrastructure/persistence/tokens/identity.tokens.js";
import type { RefreshTokenUseCase } from "../../application/use-cases/refresh-token.use-case.js";
import { catchAsync } from "../../../../shared/utils/CatchAsync.js";
import { NextFunction, Request, Response } from "express";
import { setRefreshTokenCookie } from "../../../../shared/utils/Cookie.js";
import { sendResponse } from "../../../../shared/utils/AppResonse.js";

@injectable()
export class RefreshTokenController {
  constructor(

    @inject(IdentityTokens.RefreshTokenUseCase)
    private readonly refreshTokenUseCase: RefreshTokenUseCase

  ) { }

  handle = catchAsync(async (req: Request, res: Response, next: NextFunction) => {

    const refreshToken = req.cookies?.refreshToken

    if (!refreshToken) {
      return sendResponse(res, 400, {
        success: false,
        message: "Refresh token not found"
      })
    }

    const result = await this.refreshTokenUseCase.execute({ refreshToken })

    setRefreshTokenCookie(res, result.refreshToken)

    return sendResponse(res, 200, {
      success: true,
      message: "Token refreshed successfully",
      data: result
    })
  })
}
