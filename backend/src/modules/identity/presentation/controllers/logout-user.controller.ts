import { inject, injectable} from "tsyringe"
import { catchAsync } from "../../../../shared/utils/CatchAsync.js"
import { NextFunction, Request, Response } from "express"
import { sendResponse } from "../../../../shared/utils/AppResonse.js";
import { IdentityTokens } from "../../infrastructure/persistence/tokens/identity.tokens.js";
import type { LogoutUserUseCase } from "../../application/use-cases/logout-user.use-case.js";
import { clearCookies } from "../../../../shared/utils/Cookie.js";

@injectable()
export class LogoutController {
  constructor(

    @inject(IdentityTokens.LogoutUserUseCase)
    private readonly logoutUserUseCase: LogoutUserUseCase

  ) { }

  handle = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const refreshToken = req.cookies?.refreshToken;

    if (!refreshToken) {
      sendResponse(res, 400, {
        success: false,
        message: "Refresh token is missing."
      })
    }

    await this.logoutUserUseCase.execute({ refreshToken })

    clearCookies(res, "refreshToken")

    sendResponse(res, 200, {
      success: true,
      message: "User logged out successfully."
    })

  })
}
