import { injectable, inject} from "tsyringe"
import { RestaurantTokens } from "../../infrastructure/persistence/tokens/restaurant.tokens.js";
import type { RestaurantOwnerRegisterUseCase } from "../../application/use-cases/restaurant-owner-register.use-case.js";
import { catchAsync } from "../../../../shared/utils/CatchAsync.js";
import { NextFunction, Request, Response } from "express";
import { sendResponse } from "../../../../shared/utils/AppResonse.js";
import { setRefreshTokenCookie } from "../../../../shared/utils/Cookie.js";

@injectable()
export class RegisterRestaurantOwnerController {

  constructor(

    @inject(RestaurantTokens.RestaurantOwnerRegisterUseCase)
    private readonly restaurantOwnerRegisterUseCase: RestaurantOwnerRegisterUseCase

  ) { }

  handle = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const email = req.body.email
    const password = req.body.password

    const result = await this.restaurantOwnerRegisterUseCase.execute({
      email,
      password
    })

    setRefreshTokenCookie(res, result.refreshToken)

    sendResponse(res, 201, {
      success: true,
      message: "Restaurant owner registered successfully",
      data: result
    })
  })

}
