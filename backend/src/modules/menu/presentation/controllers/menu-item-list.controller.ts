import { injectable, inject } from "tsyringe"
import { MenuTokens } from "../../infrastructure/persistence/tokens/menu.tokens.js";
import type { MenuItemListUseCase } from "../../application/use-cases/menu-item/menu-item-list.use-case.js";
import { catchAsync } from "../../../../shared/utils/CatchAsync.js";
import { NextFunction, Request, Response } from "express";
import { sendResponse } from "../../../../shared/utils/AppResonse.js";

@injectable()
export class MenuItemListController {
  constructor(

    @inject(MenuTokens.MenuItemListUseCase)
    private readonly menuListUseCase: MenuItemListUseCase

  ) { }

  handle = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const menuCategoryId = req.params.categoryId as string

    const result = await this.menuListUseCase.execute({
      menuCategoryId
    })

    sendResponse(res, 200, {
      success: true,
      message: "Menu items fetched successfully",
      data: result
    })

  })
}
