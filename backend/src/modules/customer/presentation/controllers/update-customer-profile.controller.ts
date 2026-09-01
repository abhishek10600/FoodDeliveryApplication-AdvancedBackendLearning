import { injectable, inject } from "tsyringe";
import { catchAsync } from "../../../../shared/utils/CatchAsync.js";
import { NextFunction, Request, Response } from "express";
import { CustomerTokens } from "../../infrastructure/persistence/tokens/customer.tokens.js";
import type { CustomerProfileUpdateUseCase } from "../../application/use-cases/customer-profile-update.use-case.js";
import { sendResponse } from "../../../../shared/utils/AppResonse.js";

@injectable()
export class UpdateCustomerProfileController {

  constructor(

    @inject(CustomerTokens.CustomerProfileUpdateUseCase)
    private readonly customerProfileUpdateUseCase: CustomerProfileUpdateUseCase

  ) { }

  handle = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.user?.id as string

    let firstName: string | undefined;
    let lastName: string | undefined;
    let phone: string | undefined;

    if (req.body.firstName) {
      firstName = req.body.firstName
    }

    if(req.body.lastName){
      lastName = req.body.lastName
    }

    if (req.body.phone) {
      phone = req.body.phone
    }


    const result = await this.customerProfileUpdateUseCase.execute({
      userId,
      firstName,
      lastName,
      phone
    })

    sendResponse(res, 200, {
      success: true,
      message: "Customer profile updated successfully",
      data: result
    })

  })

}
