import { injectable, inject } from "tsyringe"
import { DriverTokens } from "../../infrastructure/persistence/tokens/driver.tokens.js";
import type { DriverAvailabilityUpdateUseCase } from "../../application/use-cases/driver-availability-update.use-case.js";
import { catchAsync } from "../../../../shared/utils/CatchAsync.js";
import { NextFunction, Request, Response } from "express";
import { sendResponse } from "../../../../shared/utils/AppResonse.js";

@injectable()
export class DriverAvailabilityUpdateController {
  constructor(

    @inject(DriverTokens.DriverAvailabilityUpdateUseCase)
    private readonly driverAvailabilityUpdateUseCase: DriverAvailabilityUpdateUseCase

  ) { }

  handle = catchAsync(async (req: Request, res: Response, next: NextFunction) => {

    const driverUserId = req.user?.id as string

    await this.driverAvailabilityUpdateUseCase.execute({
      driverUserId
    })

    sendResponse(res, 200, {
      success: true,
      message: "Driver availability updated successfully"
    })

  })
}
