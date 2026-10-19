import { injectable, inject } from "tsyringe"
import { MenuTokens } from "../../infrastructure/persistence/tokens/menu.tokens.js";
import type { MenuItemNameUpdateUseCase } from "../../application/use-cases/menu-item/menu-item-name-update.use-case.js";
import { catchAsync } from "../../../../shared/utils/CatchAsync.js";
import { NextFunction, Request, Response } from "express";
import { sendResponse } from "../../../../shared/utils/AppResonse.js";

@injectable()
export class MenuItemNameUpdateController {
  constructor(

    @inject(MenuTokens.MenuItemNameUpdateUseCase)
    private readonly menuItemNameUpdateUseCase: MenuItemNameUpdateUseCase

  ) { }

  handle = catchAsync(async (req: Request, res: Response, next: NextFunction) => {

    const ownerId = req.user?.id as string
    const restaurantId = req.params.restaurantId as string
    const menuCategoryId = req.params.categoryId as string
    const menuItemId = req.params.menuItemId as string

    await this.menuItemNameUpdateUseCase.execute({
      id: menuItemId,
      restaurantId,
      ownerId,
      menuCategoryId,
      name: req.body.name
    })

    sendResponse(res, 200, {
      success: true,
      message: "Menu item name updated successfully"
    })

  })
}

// /api/v1/menu/restaurant/:restaurantId/category/:categoryId/menu-item/:menu-item-id/update-name
