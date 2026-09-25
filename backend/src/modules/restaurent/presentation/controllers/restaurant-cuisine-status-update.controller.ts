import { injectable, inject } from "tsyringe"
import { RestaurantTokens } from "../../infrastructure/persistence/tokens/restaurant.tokens.js";
import type { RestaurantCuisineStatusUpdateUseCase } from "../../application/use-cases/restaurant-cuisine-status-update.use-case.js";
import { catchAsync } from "../../../../shared/utils/CatchAsync.js";
import { NextFunction, Request, Response } from "express";
import { sendResponse } from "../../../../shared/utils/AppResonse.js";

@injectable()
export class RestaurantCuisineStatusUpdateController {
  constructor(

    @inject(RestaurantTokens.RestaurantCuisineStatusUpdateUseCase)
    private readonly restaurantCuisineStatusUpdateUseCase: RestaurantCuisineStatusUpdateUseCase

  ) { }

  handle = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const ownerId = req.user?.id as string
    const restaurantId = req.params.restaurantId as string
    const cuisineId = req.params.cuisineId as string

    await this.restaurantCuisineStatusUpdateUseCase.execute({
      ownerId,
      restaurantId,
      cuisineId
    })

    sendResponse(res, 200, {
      success: true,
      message: "Cuisine status updated successfully"
    })

  })
}
