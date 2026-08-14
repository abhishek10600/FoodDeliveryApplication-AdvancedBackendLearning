import { injectable, inject} from "tsyringe"
import { IdentityTokens } from "../../infrastructure/persistence/tokens/identity.tokens.js";
import type { RegisterUserUseCase } from "../../application/use-cases/register-user.use-case.js";
import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../../../shared/utils/CatchAsync.js";
import { sendResponse } from "../../../../shared/utils/AppResonse.js";

@injectable()
export class RegisterUserController {
  constructor(

    @inject(IdentityTokens.RegisterUserUseCase)
    private readonly registerUserUseCase: RegisterUserUseCase

  ) { }

  handle = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const result = await this.registerUserUseCase.execute(req.body);

    sendResponse(res, 201, {
      success: true,
      message: "User registered successfully.",
      data: result
    })
  })
}
