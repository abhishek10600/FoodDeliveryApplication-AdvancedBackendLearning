import { inject, injectable } from "tsyringe";
import { RestaurantTokens } from "../../infrastructure/persistence/tokens/restaurant.tokens.js";
import type { RestaurantProfileUpdateUseCase } from "../../application/use-cases/restaurant-profile-update.use-case.js";
import { catchAsync } from "../../../../shared/utils/CatchAsync.js";
import { NextFunction, Request, Response } from "express";
import { sendResponse } from "../../../../shared/utils/AppResonse.js";

@injectable()
export class RestaurantProfileUpdateController {

  constructor(

    @inject(RestaurantTokens.RestaurantProfileUpdateUseCase)
    private readonly restaurantProfileUpdateUseCase: RestaurantProfileUpdateUseCase

  ) { }

  handle = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const restaurantId = req.params.restaurantId as string
    const ownerId = req.user?.id as string

    console.log({ restaurantId })
    console.log({ ownerId })

    console.log({
      controllerDate: {
        name: req.body.name,
        description: req.body.description,
        phone: req.body.phone,
        email: req.body.email,
        address: req.body.address
      }
    })

    await this.restaurantProfileUpdateUseCase.execute(restaurantId, ownerId, {
      name: req.body.name,
      description: req.body.description,
      phone: req.body.phone,
      email: req.body.email,
      address: req.body.address
    })

    sendResponse(res, 200, {
      success: true,
      message: "Restaurant updated successfully"
    })

  })

}
