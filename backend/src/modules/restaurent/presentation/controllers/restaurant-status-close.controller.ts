import { injectable, inject} from "tsyringe"
import { RestaurantTokens } from "../../infrastructure/persistence/tokens/restaurant.tokens.js";
import type { RestaurantStatusCloseUseCase } from "../../application/use-cases/restaurant-status-close.use-case.js";
import { catchAsync } from "../../../../shared/utils/CatchAsync.js";
import { NextFunction, Request, Response } from "express";
import { sendResponse } from "../../../../shared/utils/AppResonse.js";

@injectable()
export class RestaurantStatusCloseController {
  constructor(

    @inject(RestaurantTokens.RestaurantStatusCloseUseCase)
    private readonly restaurantStatuCloseUseCase: RestaurantStatusCloseUseCase

  ) { }

  handle = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const ownerId = req.user?.id as string
    const restaurantId = req.params.restaurantId as string

    await this.restaurantStatuCloseUseCase.execute({
      restaurantId,
      ownerId
    })

    sendResponse(res, 200, {
      success: true,
      message: "Restaurant closed successfully"
    })
  })
}
