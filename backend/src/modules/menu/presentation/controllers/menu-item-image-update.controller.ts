import { injectable, inject } from "tsyringe"
import { MenuTokens } from "../../infrastructure/persistence/tokens/menu.tokens.js";
import type { MenuItemImageUpdateUseCase } from "../../application/use-cases/menu-item/menu-item-image-update.use-case.js";
import { catchAsync } from "../../../../shared/utils/CatchAsync.js";
import { NextFunction, Request, Response } from "express";
import { MenuDomainError } from "../../domain/errors/menu-domain.error.js";
import { sendResponse } from "../../../../shared/utils/AppResonse.js";

@injectable()
export class MenuItemImageUpdateController {
  constructor(

    @inject(MenuTokens.MenuItemImageUpdateUseCase)
    private readonly menuItemImageUpdateUseCase: MenuItemImageUpdateUseCase

  ) { }

  handle = catchAsync(async (req: Request, res: Response, next: NextFunction) => {

    const ownerId = req.user?.id as string
    const restaurantId = req.params.restaurantId as string
    const menuCategoryId = req.params.categoryId as string
    const menuItemId = req.params.menuItemId as string

    if (!req.file) {
      throw new MenuDomainError("Menu item image file is required", 400)
    }

    await this.menuItemImageUpdateUseCase.execute({
      id: menuItemId,
      restaurantId,
      ownerId,
      menuCategoryId,
      file: req.file
    })

    sendResponse(res, 200, {
      success: true,
      message: "Menu item image updated successfully"
    })

  })
}
