import { injectable, inject } from "tsyringe"
import { DriverTokens } from "../../infrastructure/persistence/tokens/driver.tokens.js";
import type { DriverRegisterUseCase } from "../../application/use-cases/register-driver.use-case.js";
import { catchAsync } from "../../../../shared/utils/CatchAsync.js";
import { NextFunction, Request, Response } from "express";
import { sendResponse } from "../../../../shared/utils/AppResonse.js";
import { setRefreshTokenCookie } from "../../../../shared/utils/Cookie.js";

@injectable()
export class RegisterDriverController {
  constructor(

    @inject(DriverTokens.DriverRegisterUseCase)
    private readonly driverRegisterUseCase: DriverRegisterUseCase

  ) { }

  handle = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const result = await this.driverRegisterUseCase.execute({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      phone: req.body.phone,
      email: req.body.email,
      password: req.body.password,
      vehicleType: req.body.vehicleType,
      vehicleRegNo: req.body.vehicleRegNo,
      vehicleColor: req.body.vehicleColor,
      vehicleModel: req.body.vehicleModel,
      vehicleMake: req.body.vehicleMake
    })

    setRefreshTokenCookie(res, result.refreshToken)

    sendResponse(res, 201, {
      success: true,
      message: "Driver registered succesfully",
      data: result
    })
  })
}
