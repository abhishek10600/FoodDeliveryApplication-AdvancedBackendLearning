import { injectable, inject } from "tsyringe"
import { catchAsync } from "../../../../shared/utils/CatchAsync.js"
import { NextFunction, Request, Response } from "express"
import { MenuTokens } from "../../infrastructure/persistence/tokens/menu.tokens.js"
import type { MenuCategoryCreationUseCase } from "../../application/use-cases/menu-category/menu-category-creation.use-case.js"
import { sendResponse } from "../../../../shared/utils/AppResonse.js"

@injectable()
export class MenuCategoryCreationController {
  constructor(

    @inject(MenuTokens.MenuCategoryCreationUseCase)
    private readonly menuCategoryCreationUseCase: MenuCategoryCreationUseCase

  ) { }

  handle = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const ownerId = req.user?.id as string
    const menuId = req.params.menuId as string

    const result = await this.menuCategoryCreationUseCase.execute({
      menuId,
      ownerId,
      name: req.body.name,
      description: req.body.description
    })

    sendResponse(res, 201, {
      success: true,
      message: "Menu category created successfully",
      data: result
    })
  })
}
