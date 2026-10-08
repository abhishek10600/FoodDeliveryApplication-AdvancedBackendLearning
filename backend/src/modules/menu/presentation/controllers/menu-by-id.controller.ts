import { injectable, inject } from "tsyringe"
import { MenuTokens } from "../../infrastructure/persistence/tokens/menu.tokens.js";
import type { MenuByIdUseCase } from "../../application/use-cases/menu/menu-by-id.use-case.js";
import { catchAsync } from "../../../../shared/utils/CatchAsync.js";
import { NextFunction, Request, Response } from "express";
import { sendResponse } from "../../../../shared/utils/AppResonse.js";

@injectable()
export class MenuByIdController {
  constructor(

    @inject(MenuTokens.MenuByIdUseCase)
    private readonly menuByIdUseCase: MenuByIdUseCase

  ) { }

  handle = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const menuId = req.params.menuId as string

    const result = await this.menuByIdUseCase.execute({
      id: menuId
    })

    sendResponse(res, 200, {
      success: true,
      message: "Menu fetched successfully",
      data: result
    })
  })
}
