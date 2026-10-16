import { injectable, inject } from "tsyringe"
import { MenuTokens } from "../../infrastructure/persistence/tokens/menu.tokens.js";
import type { MenuItemCreationUseCase } from "../../application/use-cases/menu-item/menu-item-creation.use-case.js";
import { catchAsync } from "../../../../shared/utils/CatchAsync.js";
import { NextFunction, Request, Response } from "express";
import { sendResponse } from "../../../../shared/utils/AppResonse.js";

@injectable()
export class MenuItemCreationController {
  constructor(

    @inject(MenuTokens.MenuItemCreationUseCase)
    private readonly menuItemCreationUseCase: MenuItemCreationUseCase

  ) { }

  handle = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const ownerId = req.user?.id as string
    const restaurantId = req.params.restaurantId as string
    const menuCategoryId = req.params.categoryId as string

    const result = await this.menuItemCreationUseCase.execute({
      restaurantId,
      ownerId,
      menuCategoryId,
      name: req.body.name,
      description: req.body.description,
      price: req.body.price,
      currency: req.body.currency
    })

    sendResponse(res, 201, {
      success: true,
      message: "Menu item creatd successfully",
      data: result
    })

  })
}
