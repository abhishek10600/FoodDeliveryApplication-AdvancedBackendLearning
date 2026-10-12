import { injectable, inject } from "tsyringe"
import { MenuTokens } from "../../infrastructure/persistence/tokens/menu.tokens.js";
import type { MenuByRestaurantIdUseCase } from "../../application/use-cases/menu/menu-by-restaurant-id.use-case.js";
import { catchAsync } from "../../../../shared/utils/CatchAsync.js";
import { NextFunction, Request, Response } from "express";
import { sendResponse } from "../../../../shared/utils/AppResonse.js";

@injectable()
export class MenuByRestaurantIdController {
  constructor(

    @inject(MenuTokens.MenuByRestaurantIdUseCase)
    private readonly menuByRestaurantIdUseCase: MenuByRestaurantIdUseCase

  ) { }

  handle = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const restaurantId = req.params.restaurantId as string

    console.log({restaurantById_RestaurantId: restaurantId})

    const result = await this.menuByRestaurantIdUseCase.execute({
      restaurantId
    })

    console.log({restaurantById_result: result})

    sendResponse(res, 200, {
      success: true,
      message: "Menu fetched successfully",
      data: result
    })
  })
}
