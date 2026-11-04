import { injectable, inject } from "tsyringe"
import { AddressTokens } from "../../infrastructure/persistence/tokens/address-tokens.js";
import type { AddressDeleteUseCase } from "../../application/use-cases/address-delete.use-case.js";
import { catchAsync } from "../../../../shared/utils/CatchAsync.js";
import { NextFunction, Request, Response } from "express";
import { sendResponse } from "../../../../shared/utils/AppResonse.js";

@injectable()
export class AddressDeleteController {

  constructor(

    @inject(AddressTokens.AddressDeleteUseCase)
    private readonly addressDeleteUseCase: AddressDeleteUseCase

  ) { }

  handle = catchAsync(async (req: Request, res: Response, next: NextFunction) => {

    const userId = req.user?.id as string
    const addressId = req.params.id as string

    await this.addressDeleteUseCase.execute({
      id: addressId,
      userId
    })

    sendResponse(res, 200, {
      success: true,
      message: "Address deleted successfully"
    })

  })

}
