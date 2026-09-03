import { injectable, inject } from "tsyringe";
import { CustomerTokens } from "../../infrastructure/persistence/tokens/customer.tokens.js";
import { catchAsync } from "../../../../shared/utils/CatchAsync.js";
import { NextFunction, Request, Response } from "express";
import type { CustomerAvatarRemoveUseCase } from "../../application/use-cases/customer-avatar-remove.use-case.js";
import { sendResponse } from "../../../../shared/utils/AppResonse.js";

@injectable()
export class CustomerAvatarRemoveController {

  constructor(

    @inject(CustomerTokens.CustomerAvatarRemoveUseCase)
    private readonly customerAvatarRemoveUseCase: CustomerAvatarRemoveUseCase

  ) { }

  handle = catchAsync(async (req: Request, res: Response, next: NextFunction) => {

    const userId = req.user?.id as string

    await this.customerAvatarRemoveUseCase.execute({
      userId
    })

    sendResponse(res, 200, {
      success: true,
      message: "Avatar removed successfully"
    })
  })

}
