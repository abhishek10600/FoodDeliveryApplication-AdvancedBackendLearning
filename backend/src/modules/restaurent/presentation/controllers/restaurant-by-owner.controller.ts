import { injectable, inject } from "tsyringe";
import { RestaurantTokens } from "../../infrastructure/persistence/tokens/restaurant.tokens.js";
import type { RestaurantByOwnerUseCase } from "../../application/use-cases/restaurant-by-owner.use-case.js";
import { catchAsync } from "../../../../shared/utils/CatchAsync.js";
import { NextFunction, Request, Response } from "express";
import { sendResponse } from "../../../../shared/utils/AppResonse.js";

@injectable()
export class RestaurantByOwnerController {

  constructor(

    @inject(RestaurantTokens.RestaurantByOwnerUseCase)
    private readonly restaurantByOwnerUseCase: RestaurantByOwnerUseCase

  ) { }

  handle = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const ownerId = req.user?.id as string

    const result = await this.restaurantByOwnerUseCase.execute({
      ownerId
    })

    sendResponse(res, 200, {
      success: true,
      message: "Restaurants fetched succesffully",
      data: result
    })

  })
}
