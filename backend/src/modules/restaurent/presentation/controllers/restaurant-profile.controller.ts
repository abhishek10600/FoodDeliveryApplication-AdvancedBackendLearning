import { injectable, inject } from "tsyringe";
import { RestaurantTokens } from "../../infrastructure/persistence/tokens/restaurant.tokens.js";
import type { RestaurantProfileUseCase } from "../../application/use-cases/restaurant-profile.use-case.js";
import { catchAsync } from "../../../../shared/utils/CatchAsync.js";
import { NextFunction, Request, Response } from "express";
import { sendResponse } from "../../../../shared/utils/AppResonse.js";

@injectable()
export class RestaurantProfileController {

  constructor(

    @inject(RestaurantTokens.RestaurantProfileUseCase)
    private readonly restaurantProfileUseCase: RestaurantProfileUseCase

  ) { }

  handle = catchAsync(async (req: Request, res: Response, next: NextFunction) => {

    const restaurantId = req.params.restaurantId as string

    const result = await this.restaurantProfileUseCase.execute(restaurantId)

    sendResponse(res, 200, {
      success: true,
      message: "Restaurant profile fetched successfully",
      data: result
    })

  })

}
