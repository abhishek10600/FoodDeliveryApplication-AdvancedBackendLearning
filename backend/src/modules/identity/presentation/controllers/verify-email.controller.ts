import { injectable, inject } from "tsyringe";
import { catchAsync } from "../../../../shared/utils/CatchAsync.js";
import { NextFunction, Request, Response } from "express";
import { IdentityTokens } from "../../infrastructure/persistence/tokens/identity.tokens.js";
import type { VerifyEmailUseCase } from "../../application/use-cases/verify-email.use-case.js";
import { sendResponse } from "../../../../shared/utils/AppResonse.js";

@injectable()
export class VerifyEmailController {
  constructor(

    @inject(IdentityTokens.VerifyEmailUseCase)
    private readonly verifyEmailUseCase: VerifyEmailUseCase

  ) { }

  handle = catchAsync(async (req: Request, res: Response, next: NextFunction) => {

    const userId = req.user?.id as string;
    const token = req.params.token as string;

    await this.verifyEmailUseCase.execute({
      userId,
      token
    })

    sendResponse(res, 200, {
      success: true,
      message: "User verified successfully"
    })

  })
}
