import { injectable, inject } from "tsyringe"
import { DriverTokens } from "../../infrastructure/persistence/tokens/driver.tokens.js";
import type { DriverProfileUseCase } from "../../application/use-cases/driver-profile.use-case.js";
import { catchAsync } from "../../../../shared/utils/CatchAsync.js";
import { NextFunction, Request, Response } from "express";
import { sendResponse } from "../../../../shared/utils/AppResonse.js";

@injectable()
export class DriverProfileController {
  constructor(

    @inject(DriverTokens.DriverProfileUseCase)
    private readonly driverProfileUseCase: DriverProfileUseCase

  ) { }

  handle = catchAsync(async (req: Request, res: Response, next: NextFunction) => {

    const driverUserId = req.user?.id as string

    const result = await this.driverProfileUseCase.execute({
      driverUserId
    })

    sendResponse(res, 200, {
      success: true,
      message: "Driver profile fetched successfully",
      data: result
    })

  })
}
