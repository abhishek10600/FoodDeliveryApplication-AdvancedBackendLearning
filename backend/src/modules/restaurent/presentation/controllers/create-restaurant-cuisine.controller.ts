import { injectable, inject} from "tsyringe"
import { RestaurantTokens } from "../../infrastructure/persistence/tokens/restaurant.tokens.js";
import type { RestaurantCuisineCreationUseCase } from "../../application/use-cases/restaurant-cuisine-creation.use-case.js";
import { catchAsync } from "../../../../shared/utils/CatchAsync.js";
import { NextFunction, Request, Response } from "express";
import { sendResponse } from "../../../../shared/utils/AppResonse.js";

@injectable()
export class CreateRestaurantCuisineController {

  constructor(

    @inject(RestaurantTokens.RestaurantCuisineCreationUseCase)
    private readonly restaurantCuisineCreationUseCase: RestaurantCuisineCreationUseCase

  ) { }

  handle = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const ownerId = req.user?.id as string
    const restaurantId = req.params.restaurantId as string

    await this.restaurantCuisineCreationUseCase.execute({
      restaurantId,
      ownerId,
      cuisineName: req.body.cuisineName
    })

    sendResponse(res, 201, {
      success: true,
      message: "Cuisine added successfully"
    })
  })

}
