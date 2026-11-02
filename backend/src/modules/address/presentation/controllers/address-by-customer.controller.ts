import { injectable, inject } from "tsyringe"
import { AddressTokens } from "../../infrastructure/persistence/tokens/address-tokens.js";
import type { AddressListByCustomerUseCase } from "../../application/use-cases/address-list-by-customer.use-case.js";
import { catchAsync } from "../../../../shared/utils/CatchAsync.js";
import { NextFunction, Request, Response } from "express";
import { sendResponse } from "../../../../shared/utils/AppResonse.js";

@injectable()
export class AddressByCustomerController {
  constructor(

    @inject(AddressTokens.AddressByCustomerUseCase)
    private readonly addressByCustomerUseCase: AddressListByCustomerUseCase

  ) { }

  handle = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.user?.id as string

    const result = await this.addressByCustomerUseCase.execute({
      userId
    })

    sendResponse(res, 200, {
      success: true,
      message: "All the addresses fetched successfully",
      data: result
    })
  })
}
