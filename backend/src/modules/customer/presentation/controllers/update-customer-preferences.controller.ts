import { injectable, inject } from "tsyringe";
import { CustomerTokens } from "../../infrastructure/persistence/tokens/customer.tokens.js";
import type { CustomerPreferencesUpdateUseCase } from "../../application/use-cases/customer-preferences-update.use-case.js";
import { catchAsync } from "../../../../shared/utils/CatchAsync.js";
import { NextFunction, Request, Response } from "express";
import { sendResponse } from "../../../../shared/utils/AppResonse.js";

@injectable()
export class UpdateCustomerPreferencesController {
  constructor(

    @inject(CustomerTokens.CustomerPreferencesUpdateUseCase)
    private readonly customerPreferencesUpdateUseCase: CustomerPreferencesUpdateUseCase

  ) { }

  handle = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.user?.id as string;

    await this.customerPreferencesUpdateUseCase.execute({
      userId,
      language: req.body.language,
      notifications: req.body.notifications,
      marketing: req.body.marketing
    })

    sendResponse(res, 200, {
      success: true,
      message: "Customer preferences updated"
    })

  })
}
