import { injectable, inject } from "tsyringe"
import { AddressTokens } from "../../infrastructure/persistence/tokens/address-tokens.js";
import type { AddressByIdUseCase } from "../../application/use-cases/address-by-id.use-case.js";
import { catchAsync } from "../../../../shared/utils/CatchAsync.js";
import { NextFunction, Request, Response } from "express";
import { sendResponse } from "../../../../shared/utils/AppResonse.js";

@injectable()
export class AddressByIdController {
  constructor(

    @inject(AddressTokens.AddressByIdUseCase)
    private readonly addressByIdUseCase: AddressByIdUseCase

  ) { }

  handle = catchAsync(async (req: Request, res: Response, next: NextFunction) => {

    const userId = req.user?.id as string
    const id = req.params.id as string

    const result = await this.addressByIdUseCase.execute({
      id,
      userId
    })

    sendResponse(res, 200, {
      success: true,
      message: "Address fetched successfully",
      data: result
    })

  })
}
