import { injectable, inject } from "tsyringe";
import { catchAsync } from "../../../../shared/utils/CatchAsync.js";
import { NextFunction, Request, Response } from "express";
import { IdentityTokens } from "../../infrastructure/persistence/tokens/identity.tokens.js";
import type { ForgotPasswordUseCase } from "../../application/use-cases/forgot-password.use-case.js";
import { sendResponse } from "../../../../shared/utils/AppResonse.js";

@injectable()
export class ForgotPasswordController {
  constructor(

    @inject(IdentityTokens.ForgotPasswordUseCase)
    private readonly forgotPasswordUseCase: ForgotPasswordUseCase

  ) { }

  handle = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const email = req.body.email

    await this.forgotPasswordUseCase.execute({
      email
    })

    sendResponse(res, 200, {
      success: true,
      message: "Forgot password email sent successfully"
    })
  })
}
