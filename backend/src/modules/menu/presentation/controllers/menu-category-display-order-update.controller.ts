import { injectable, inject } from "tsyringe"
import { catchAsync } from "../../../../shared/utils/CatchAsync.js"
import { NextFunction, Request, Response } from "express"
import { MenuTokens } from "../../infrastructure/persistence/tokens/menu.tokens.js"
import type { MenuCategoryDisplayOrderUpdateUseCase } from "../../application/use-cases/menu-category/menu-category-display-order-update.use-case.js"
import { sendResponse } from "../../../../shared/utils/AppResonse.js"

@injectable()
export class MenuCategoryDisplayOrderUpdateController {
  constructor(

    @inject(MenuTokens.MenuCategoryDisplayOrderUpdateUseCase)
    private readonly menuCategoryDisplayOrderUpdateUseCase: MenuCategoryDisplayOrderUpdateUseCase
  ) { }

  handle = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const ownerId = req.user?.id as string
    const restaurantId = req.params.restaurantId as string
    const menuCategoryId = req.params.categoryId as string

    await this.menuCategoryDisplayOrderUpdateUseCase.execute({
      id: menuCategoryId,
      restaurantId,
      ownerId,
      displayOrder: req.body.displayOrder
    })

    sendResponse(res, 200, {
      success: true,
      message: "Menu category display order updated successfully"
    })
  })
}
