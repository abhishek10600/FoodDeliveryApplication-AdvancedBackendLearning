import { injectable, inject } from "tsyringe"
import { DriverTokens } from "../../infrastructure/persistence/tokens/driver.tokens.js";
import type { DriverProfileUpdateUseCase } from "../../application/use-cases/driver-profile-update.use-case.js";
import { catchAsync } from "../../../../shared/utils/CatchAsync.js";
import { NextFunction, Request, Response } from "express";
import { sendResponse } from "../../../../shared/utils/AppResonse.js";

@injectable()
export class DriverProfileUpdateController {
  constructor(

    @inject(DriverTokens.DriverProfileUpdateUseCase)
    private readonly driverProfileUpdateUseCase: DriverProfileUpdateUseCase

  ) { }

  handle = catchAsync(async (req: Request, res: Response, next: NextFunction) => {

    const driverUserId = req.user?.id as string

    await this.driverProfileUpdateUseCase.execute({
      driverUserId,
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      phone: req.body.phone
    })

    sendResponse(res, 200, {
      success: true,
      message: "Driver profile updated successfully"
    })

  })
}
