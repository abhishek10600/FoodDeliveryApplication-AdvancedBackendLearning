import { injectable, inject } from "tsyringe"
import { AddressTokens } from "../../infrastructure/persistence/tokens/address-tokens.js";
import type { AddressSetDefaultUseCase } from "../../application/use-cases/address-set-default.use-case.js";
import { catchAsync } from "../../../../shared/utils/CatchAsync.js";
import { NextFunction, Request, Response } from "express";
import { sendResponse } from "../../../../shared/utils/AppResonse.js";

@injectable()
export class AddressSetDefaultController {
  constructor(

    @inject(AddressTokens.AddressSetDefaultUseCase)
    private readonly addressSetDefaultUseCase: AddressSetDefaultUseCase

  ) { }

  handle = catchAsync(async (req: Request, res: Response, next: NextFunction) => {

    const userId = req.user?.id as string
    const addressId = req.params.id as string

    await this.addressSetDefaultUseCase.execute({
      id: addressId,
      userId
    })

    sendResponse(res, 200, {
      success: true,
      message: "Address set as default"
    })

  })
}
