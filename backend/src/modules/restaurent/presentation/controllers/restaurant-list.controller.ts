import { injectable, inject} from "tsyringe"
import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../../../shared/utils/CatchAsync.js";
import { RestaurantTokens } from "../../infrastructure/persistence/tokens/restaurant.tokens.js";
import type { RestaurantListUseCase } from "../../application/use-cases/restaurant-list.use-case.js";
import { sendResponse } from "../../../../shared/utils/AppResonse.js";
import { RestaurantListFilterInput } from "../../application/dto/resruarant-list.dto.js";

@injectable()
export class RestaurantListController {

  constructor(

    @inject(RestaurantTokens.RestaurantListUseCase)
    private readonly restaurantListUseCase: RestaurantListUseCase

  ) { }

  handle = catchAsync(async (req: Request, res: Response, next: NextFunction) => {

    console.log("QUERY:", req.query);

    const filters = req.query as unknown as  RestaurantListFilterInput

    const result = await this.restaurantListUseCase.execute(filters)

    sendResponse(res, 200, {
      success: true,
      message: "Restaurants fetched successfully",
      data: result
    })
  })

}
