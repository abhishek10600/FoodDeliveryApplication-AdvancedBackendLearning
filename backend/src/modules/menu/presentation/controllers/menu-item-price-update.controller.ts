import { injectable, inject } from "tsyringe"
import { MenuTokens } from "../../infrastructure/persistence/tokens/menu.tokens.js";
import type { MenuItemPriceUpdateUseCase } from "../../application/use-cases/menu-item/menu-item-price-update.use-case.js";
import { catchAsync } from "../../../../shared/utils/CatchAsync.js";
import { NextFunction, Request, Response } from "express";
import { sendResponse } from "../../../../shared/utils/AppResonse.js";

@injectable()
export class MenuItemPriceUpdateController {

  constructor(

    @inject(MenuTokens.MenuItemPriceUpdateUseCase)
    private readonly menuItemPriceUpdateUseCase: MenuItemPriceUpdateUseCase

  ) { }

  handle = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const ownerId = req.user?.id as string
    const restaurantId = req.params.restaurantId as string
    const menuCategoryId = req.params.categoryId as string
    const menuItemId = req.params.menuItemId as string

    await this.menuItemPriceUpdateUseCase.execute({
      id: menuItemId,
      restaurantId,
      ownerId,
      menuCategoryId,
      price: req.body.price
    })

    sendResponse(res, 200, {
      success: true,
      message: "Menu item price updated successfully"
    })
  })

}
