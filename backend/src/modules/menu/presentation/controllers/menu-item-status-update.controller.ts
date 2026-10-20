import { injectable, inject } from "tsyringe"
import { MenuTokens } from "../../infrastructure/persistence/tokens/menu.tokens.js";
import type { MenuItemStatusUpdateUseCase } from "../../application/use-cases/menu-item/menu-item-status-update.use-case.js";
import { catchAsync } from "../../../../shared/utils/CatchAsync.js";
import { NextFunction, Request, Response } from "express";
import { sendResponse } from "../../../../shared/utils/AppResonse.js";

@injectable()
export class MenuItemStatusUpdateController {
  constructor(

    @inject(MenuTokens.MenuItemStatusUpdateUseCase)
    private readonly menuItemStatusUpdateUseCase: MenuItemStatusUpdateUseCase

  ) { }

  handle = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const ownerId = req.user?.id as string
    const menuItemId = req.params.id as string

    await this.menuItemStatusUpdateUseCase.execute({
      id: menuItemId,
      ownerId
    })

    sendResponse(res, 200, {
      success: true,
      message: "Menu item status updated successfully"
    })
  })
}
