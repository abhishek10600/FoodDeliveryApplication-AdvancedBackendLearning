import { injectable, inject } from "tsyringe";
import { RestaurantTokens } from "../../infrastructure/persistence/tokens/restaurant.tokens.js";
import { catchAsync } from "../../../../shared/utils/CatchAsync.js";
import { NextFunction, Request, Response } from "express";
import { sendResponse } from "../../../../shared/utils/AppResonse.js";
import type { RestaurantStatusUpdateUseCase } from "../../application/use-cases/restaurant-status-update.use-case.js";

@injectable()
export class RestaurantStatusUpdateController {

  constructor(

    @inject(RestaurantTokens.RestaurantStatusUpdateUseCase)
    private readonly restaurantStatusUpdateUseCase: RestaurantStatusUpdateUseCase

  ) { }

  handle = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const ownerId = req.user?.id as string
    const restaurantId = req.params.restaurantId as string

    await this.restaurantStatusUpdateUseCase.execute({
      restaurantId,
      ownerId
    })

    sendResponse(res, 200, {
      success: true,
      message: "Restaurant status updated successfully"
    })
  })

}
