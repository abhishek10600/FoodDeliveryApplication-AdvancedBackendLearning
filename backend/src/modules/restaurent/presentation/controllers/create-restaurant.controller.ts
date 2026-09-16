import { injectable, inject } from "tsyringe";
import { catchAsync } from "../../../../shared/utils/CatchAsync.js";
import { NextFunction, Request, Response } from "express";
import { RestaurantTokens } from "../../infrastructure/persistence/tokens/restaurant.tokens.js";
import { sendResponse } from "../../../../shared/utils/AppResonse.js";
import type { RestaurantCreationUseCase } from "../../application/use-cases/restaurant-creation.use-case.js";

@injectable()
export class CreateRestaurantController {

  constructor(

    @inject(RestaurantTokens.RestaurantCreationUseCase)
    private readonly restaurantCreationUseCase: RestaurantCreationUseCase

  ) { }

  handle = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const ownerId = req.user?.id as string

    const result = await this.restaurantCreationUseCase.execute(ownerId, req.body)

    sendResponse(res, 201, {
      success: true,
      message: "Restaurant created successfully",
      data: result
    })

  })

}
