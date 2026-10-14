import { injectable, inject } from "tsyringe"
import { MenuTokens } from "../../infrastructure/persistence/tokens/menu.tokens.js";
import type { MenuCategoryNameUpdateUseCase } from "../../application/use-cases/menu-category/menu-category-name-update.use-case.js";
import { catchAsync } from "../../../../shared/utils/CatchAsync.js";
import { NextFunction, Request, Response } from "express";
import { sendResponse } from "../../../../shared/utils/AppResonse.js";

@injectable()
export class MenuCategoryNameUpdateController {
  constructor(

    @inject(MenuTokens.MenuCategoryNameUpdateUseCase)
    private readonly menuCategoryNameUpdateUseCase: MenuCategoryNameUpdateUseCase

  ) { }

  handle = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const ownerId = req.user?.id as string
    const menuCategoryId = req.params.categoryId as string
    const restaurantId = req.params.restaurantId as string

    await this.menuCategoryNameUpdateUseCase.execute({
      id: menuCategoryId,
      restaurantId,
      ownerId,
      menuCategopryName: req.body.menuCategoryName
    })

    sendResponse(res, 200, {
      success: true,
      message: "Menu category name updated successfully"
    })
  })
}
