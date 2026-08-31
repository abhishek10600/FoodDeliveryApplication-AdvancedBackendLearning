import { injectable, inject } from "tsyringe";
import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../../../shared/utils/CatchAsync.js";
import { CustomerTokens } from "../../infrastructure/persistence/tokens/customer.tokens.js";
import type { GetCustomerProfileUseCase } from "../../application/use-cases/get-customer-profile.use-case.js";
import { sendResponse } from "../../../../shared/utils/AppResonse.js";

@injectable()
export class GetCustomerProfileController {
  constructor(

    @inject(CustomerTokens.GetCustomerProfileUseCase)
    private readonly getCustomerProfileUseCase: GetCustomerProfileUseCase

  ) { }

  handle = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.user?.id as string;

    const result = await this.getCustomerProfileUseCase.execute({
      userId
    })

    sendResponse(res, 200, {
      success: true,
      message: "Customer profile fetched successfully",
      data: result
    })

  })

}
