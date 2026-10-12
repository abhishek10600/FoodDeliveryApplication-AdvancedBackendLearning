import { injectable, inject } from "tsyringe"
import { MenuTokens } from "../../infrastructure/persistence/tokens/menu.tokens.js";
import type { MenuCategoryByIdUseCase } from "../../application/use-cases/menu-category/menu-category-by-id.use-case.js";
import { catchAsync } from "../../../../shared/utils/CatchAsync.js";
import { NextFunction, Request, Response } from "express";
import { sendResponse } from "../../../../shared/utils/AppResonse.js";

@injectable()
export class MenuCategoryByIdController {
  constructor(

    @inject(MenuTokens.MenuCategoryByIdUseCase)
    private readonly menuCategoryByIdUseCase: MenuCategoryByIdUseCase

  ) { }

  handle = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const categoryId = req.params.categoryId as string

    console.log({categoryId})

    const result = await this.menuCategoryByIdUseCase.execute({
      id: categoryId
    })

    console.log({result})

    sendResponse(res, 200, {
      success: true,
      message: "Menu category fetched successfully",
      data: result
    })
  })
}
