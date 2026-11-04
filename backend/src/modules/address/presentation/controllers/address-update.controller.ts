import { injectable, inject } from "tsyringe"
import { AddressTokens } from "../../infrastructure/persistence/tokens/address-tokens.js";
import type { AddressUpdateUseCase } from "../../application/use-cases/address-update.use-case.js";
import { catchAsync } from "../../../../shared/utils/CatchAsync.js";
import { NextFunction, Request, Response } from "express";
import { sendResponse } from "../../../../shared/utils/AppResonse.js";

@injectable()
export class AddressUpdateController {
  constructor(

    @inject(AddressTokens.AddressUpdateUseCase)
    private readonly addressUpdateUseCase: AddressUpdateUseCase

  ) { }

  handle = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.user?.id as string
    const addressId = req.params.id as string

    await this.addressUpdateUseCase.execute({
      id: addressId,
      userId,
      houseName: req.body.houseName,
      streetName: req.body.streetName,
      landmark: req.body.landMark,
      city: req.body.city,
      state: req.body.state,
      country: req.body.country,
      pin: req.body.pin
    })

    sendResponse(res, 200, {
      success: true,
      message: "Address updated successfully"
    })
  })
}
