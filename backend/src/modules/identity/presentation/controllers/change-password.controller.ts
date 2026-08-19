import { inject, injectable } from "tsyringe";
import { catchAsync } from "../../../../shared/utils/CatchAsync.js";
import { NextFunction, Request, Response } from "express";
import { IdentityTokens } from "../../infrastructure/persistence/tokens/identity.tokens.js";
import type { ChangePasswordUseCase } from "../../application/use-cases/change-password.use-case.js";
import { sendResponse } from "../../../../shared/utils/AppResonse.js";

@injectable()
export class ChangePasswordController {

  constructor(

    @inject(IdentityTokens.ChangePasswordUseCase)
    private readonly changePasswordUseCase: ChangePasswordUseCase

  ) { }

  handle = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.user?.id as string
    const currentPassword = req.body.currentPassword
    const newPassword = req.body.newPassword

    await this.changePasswordUseCase.execute({
      userId,
      currentPassword,
      newPassword
    })

    sendResponse(res, 200, {
      success: true,
      message: "Password changed successfully"
    })
  })

}
