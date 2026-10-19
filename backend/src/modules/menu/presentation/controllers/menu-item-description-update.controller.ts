import {injectable, inject } from "tsyringe"
import { MenuTokens } from "../../infrastructure/persistence/tokens/menu.tokens.js";
import type { MenuItemDescriptionUpdateUseCase } from "../../application/use-cases/menu-item/menu-item-description-update.use-case.js";
import { catchAsync } from "../../../../shared/utils/CatchAsync.js";
import { NextFunction, Request, Response } from "express";
import { sendResponse } from "../../../../shared/utils/AppResonse.js";

@injectable()
export class MenuItemDescriptionUpdateController {

  constructor(

    @inject(MenuTokens.MenuItemDescriptionUpdateUseCase)
    private readonly menuItemDescriptionUpdateUseCase: MenuItemDescriptionUpdateUseCase

  ) { }

  handle = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const ownerId = req.user?.id as string
    const restaurantId = req.params.restaurantId as string
    const menuCategoryId = req.params.categoryId as string
    const menuItemId = req.params.menuItemId as string

    await this.menuItemDescriptionUpdateUseCase.execute({
      id: menuItemId,
      restaurantId,
      ownerId,
      menuCategoryId,
      description: req.body.description
    })

    sendResponse(res, 200, {
      success: true,
      message: "Menu item description updated successfully"
    })
  })

}
