import { injectable, inject } from "tsyringe"
import { MenuTokens } from "../../infrastructure/persistence/tokens/menu.tokens.js";
import type { MenuCategoryListUseCase } from "../../application/use-cases/menu-category/menu-category-list.use-case.js";
import { catchAsync } from "../../../../shared/utils/CatchAsync.js";
import { NextFunction, Request, Response } from "express";
import { sendResponse } from "../../../../shared/utils/AppResonse.js";

@injectable()
export class MenuCategoryListController {
  constructor(

    @inject(MenuTokens.MenuCategoryListUseCase)
    private readonly menuCategoryListUseCase: MenuCategoryListUseCase

  ) { }

  handle = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const menuId = req.params.menuId as string

    const result = await this.menuCategoryListUseCase.execute({
      menuId
    })

    sendResponse(res, 200, {
      success: true,
      message: "Menu category list fetched successfully",
      data: result
    })
  })
}
