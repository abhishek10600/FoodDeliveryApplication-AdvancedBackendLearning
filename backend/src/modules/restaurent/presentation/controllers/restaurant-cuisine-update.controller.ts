import { injectable, inject} from "tsyringe"
import { RestaurantTokens } from "../../infrastructure/persistence/tokens/restaurant.tokens.js";
import type { RestaurantCuisineUpdateUseCase } from "../../application/use-cases/restaurant-cuisine-update.use-case.js";
import { catchAsync } from "../../../../shared/utils/CatchAsync.js";
import { NextFunction, Request, Response } from "express";
import { sendResponse } from "../../../../shared/utils/AppResonse.js";

@injectable()
export class RestaurantCuisineUpdateController {
  constructor(

    @inject(RestaurantTokens.RestaurantCuisineUpdateUseCase)
    private readonly restaurantCuisineUpdateUseCase: RestaurantCuisineUpdateUseCase

  ) { }

  handle = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const ownerId = req.user?.id as string
    const restaurantId = req.params.restaurantId as string
    const cuisineId = req.params.cuisineId as string

    await this.restaurantCuisineUpdateUseCase.execute({
      ownerId,
      restaurantId,
      cuisineId,
      cuisineName: req.body.cuisineName
    })

    sendResponse(res, 200, {
      success: true,
      message: "Cuisine updated successfully"
    })

  })
}
