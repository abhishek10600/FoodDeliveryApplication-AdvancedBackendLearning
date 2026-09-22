import { injectable, inject} from "tsyringe"
import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../../../shared/utils/CatchAsync.js";
import { RestaurantTokens } from "../../infrastructure/persistence/tokens/restaurant.tokens.js";
import type { RestaurantOpeningHoursUpdateUseCase } from "../../application/use-cases/restaurant-opening-hours-update.use-case.js";
import { sendResponse } from "../../../../shared/utils/AppResonse.js";

@injectable()
export class RestaurantOpeningHoursUpdateController {

  constructor(

    @inject(RestaurantTokens.RestaurantOpeningHoursUpdateUseCase)
    private readonly restaurantOpeningHoursUpdateUseCase: RestaurantOpeningHoursUpdateUseCase

  ) { }

  handle = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const ownerId = req.user?.id as string
    const restaurantId = req.params.restaurantId as string

    await this.restaurantOpeningHoursUpdateUseCase.execute({
      restaurantId,
      ownerId,
      dayOfWeek: req.body.dayOfWeek,
      opensAt: req.body.opensAt,
      closesAt: req.body.closesAt,
      isClosed: req.body.isClosed
    })

    sendResponse(res, 200, {
      success: true,
      message: "Opening hours updated successfully"
    })

  })

}
