import { injectable, inject } from "tsyringe"
import { MenuTokens } from "../../infrastructure/persistence/tokens/menu.tokens.js";
import type { MenuItemDeletionUseCase } from "../../application/use-cases/menu-item/menu-item-deletion.use-case.js";
import { catchAsync } from "../../../../shared/utils/CatchAsync.js";
import { NextFunction, Request, Response } from "express";
import { sendResponse } from "../../../../shared/utils/AppResonse.js";

@injectable()
export class MenuItemDeletionController {
  constructor(

    @inject(MenuTokens.MenuItemDeletionUseCase)
    private readonly menuItemDeletionUseCase: MenuItemDeletionUseCase

  ) { }

  handle = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const ownerId = req.user?.id as string
    const menuItemId = req.params.id as string

    await this.menuItemDeletionUseCase.execute({
      id: menuItemId,
      ownerId
    })

    sendResponse(res, 200, {
      success: true,
      message: "Menu item deleted successfully"
    })
  })
}
