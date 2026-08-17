import { injectable, inject } from "tsyringe"
import { IdentityTokens } from "../../infrastructure/persistence/tokens/identity.tokens.js";
import type { LoginUserUseCase } from "../../application/use-cases/login-user.use-case.js";
import { catchAsync } from "../../../../shared/utils/CatchAsync.js";
import { NextFunction, Request, Response } from "express";
import { sendResponse } from "../../../../shared/utils/AppResonse.js";
import { setRefreshTokenCookie } from "../../../../shared/utils/Cookie.js";

@injectable()
export class LoginUserController {
  constructor(

    @inject(IdentityTokens.LoginUserUseCase)
    private readonly loginUserUseCase: LoginUserUseCase

  ) { }

  handle = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const result = await this.loginUserUseCase.execute(req.body)

    setRefreshTokenCookie(res, result.refreshToken)

    sendResponse(res, 200, {
      success: true,
      message: "User loggin in successfully",
      data: result
    })
  })
}
