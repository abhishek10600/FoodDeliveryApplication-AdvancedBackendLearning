import { injectable, inject } from "tsyringe"
import { MenuTokens } from "../../infrastructure/persistence/tokens/menu.tokens.js";
import type { MenuDeactivateUseCase } from "../../application/use-cases/menu/menu-deactivate.use-case.js";
import { catchAsync } from "../../../../shared/utils/CatchAsync.js";
import { NextFunction, Request, Response } from "express";
import { sendResponse } from "../../../../shared/utils/AppResonse.js";

@injectable()
export class MenuDeactivateController {
  constructor(

    @inject(MenuTokens.MenuDeactivateUseCase)
    private readonly menuDeactivateUseCase: MenuDeactivateUseCase

  ) { }

  handle = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const ownerId = req.user?.id as string
    const menuId = req.params.menuId as string

    await this.menuDeactivateUseCase.execute({
      menuId,
      ownerId
    })

    sendResponse(res, 200, {
      success: true,
      message: "Menu deactivated successfully"
    })
  })
}
