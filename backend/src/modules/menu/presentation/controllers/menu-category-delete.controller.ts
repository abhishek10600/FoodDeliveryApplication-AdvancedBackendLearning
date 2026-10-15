import { injectable, inject } from "tsyringe"
import { MenuTokens } from "../../infrastructure/persistence/tokens/menu.tokens.js";
import type { MenuCategoryDeleteUseCase } from "../../application/use-cases/menu-category/menu-category-delete.use-case.js";
import { catchAsync } from "../../../../shared/utils/CatchAsync.js";
import { NextFunction, Request, Response } from "express";
import { sendResponse } from "../../../../shared/utils/AppResonse.js";

@injectable()
export class MenuCategoryDeleteController {
  constructor(

    @inject(MenuTokens.MenuCategoryDeleteUseCase)
    private readonly menuCategoryDeleteUseCase: MenuCategoryDeleteUseCase

  ) { }

  handle = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const ownerId = req.user?.id as string
    const restaurantId = req.params.restaurantId as string
    const menuCategoryId = req.params.categoryId as string

    await this.menuCategoryDeleteUseCase.execute({
      id: menuCategoryId,
      restaurantId,
      ownerId
    })

    sendResponse(res, 200, {
      success: true,
      message: "Menu category deleted successfully"
    })
  })
}
