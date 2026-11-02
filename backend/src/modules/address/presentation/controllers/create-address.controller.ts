import { injectable, inject } from "tsyringe"
import { AddressTokens } from "../../infrastructure/persistence/tokens/address-tokens.js";
import type { AddressCreationUseCase } from "../../application/use-cases/address-creation.use-case.js";
import { catchAsync } from "../../../../shared/utils/CatchAsync.js";
import { NextFunction, Request, Response } from "express";
import { sendResponse } from "../../../../shared/utils/AppResonse.js";

@injectable()
export class CreateAddressController {
  constructor(

    @inject(AddressTokens.AddressCreationUseCase)
    private readonly addressCreationUseCase: AddressCreationUseCase

  ) { }

  handle = catchAsync(async (req: Request, res: Response, next: NextFunction) => {

    const userId = req.user?.id as string

    const result = await this.addressCreationUseCase.execute({
      userId,
      houseName: req.body.houseName,
      streetName: req.body.streetName,
      landMark: req.body.landMark,
      city: req.body.city,
      state: req.body.state,
      country: req.body.country,
      pin: req.body.pin
    })

    sendResponse(res, 201, {
      success: true,
      message: "Address created successfully",
      data: result
    })

  })
}
