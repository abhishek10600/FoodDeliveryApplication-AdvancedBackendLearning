import { injectable, inject } from "tsyringe"
import { MenuTokens } from "../../infrastructure/persistence/tokens/menu.tokens.js";
import type { MenuCategoryDescriptionUpdateUseCase } from "../../application/use-cases/menu-category/menu-category-description-update.use-case.js";
import { catchAsync } from "../../../../shared/utils/CatchAsync.js";
import { NextFunction, Request, Response } from "express";
import { sendResponse } from "../../../../shared/utils/AppResonse.js";

@injectable()
export class MenuCategoryDescriptionUpdateController {
  constructor(

    @inject(MenuTokens.MenuCategoryDescriptionUpdateUseCase)
    private readonly menuCategoryDescriptionUpdateUseCase: MenuCategoryDescriptionUpdateUseCase

  ) { }

  handle = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const ownerId = req.user?.id as string
    const restaurantId = req.params.restaurantId as string
    const menuCategoryId = req.params.categoryId as string

    await this.menuCategoryDescriptionUpdateUseCase.execute({
      id: menuCategoryId,
      restaurantId,
      ownerId,
      menuCategoryDescription: req.body.menuCategoryDescription
    })

    sendResponse(res, 200, {
      success: true,
      message: "Menu category description updated successfully"
    })
  })
}
