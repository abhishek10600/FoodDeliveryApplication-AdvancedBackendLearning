import { injectable, inject } from "tsyringe";
import { IdentityTokens } from "../../infrastructure/persistence/tokens/identity.tokens.js";
import type { GetCurrentUserUseCase } from "../../application/use-cases/get-current-user.user-case.js";
import { catchAsync } from "../../../../shared/utils/CatchAsync.js";
import { NextFunction, Request, Response } from "express";
import { sendResponse } from "../../../../shared/utils/AppResonse.js";

@injectable()
export class GetCurrentUserController {
  constructor(

    @inject(IdentityTokens.GetCurrentUserUseCase)
    private readonly getCurrentUserUseCase: GetCurrentUserUseCase

  ) { }

  handle = catchAsync(async (req: Request, res: Response, next: NextFunction) => {

    const userId = req.user?.id as string;

    const result = await this.getCurrentUserUseCase.execute(userId)

    sendResponse(res, 200, {
      success: true,
      message: "Current user fetched successfully",
      data: result
    })

  })
}
