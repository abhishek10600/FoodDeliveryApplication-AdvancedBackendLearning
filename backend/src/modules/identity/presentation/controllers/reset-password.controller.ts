import { injectable, inject } from "tsyringe";
import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../../../shared/utils/CatchAsync.js";
import { IdentityTokens } from "../../infrastructure/persistence/tokens/identity.tokens.js";
import type { ResetPasswordUseCase } from "../../application/use-cases/rest-password.use-case.js";
import { sendResponse } from "../../../../shared/utils/AppResonse.js";

@injectable()
export class ResetPasswordController {
  constructor(

    @inject(IdentityTokens.ResetPasswordUseCase)
    private readonly resetPasswordUseCase: ResetPasswordUseCase

  ) { }

  handle = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const token = req.params.token as string

    console.log({token})

    const newPassword = req.body.newPassword

    await this.resetPasswordUseCase.execute({
      token,
      newPassword
    })

    sendResponse(res, 200, {
      success: true,
      message: "Password reset successfully"
    })
  })
}
