import { injectable, inject } from "tsyringe"
import { MenuTokens } from "../../infrastructure/persistence/tokens/menu.tokens.js";
import type { MenuAddOnGroupStatusUpdateUseCase } from "../../application/use-cases/menu-add-on-group/menu-add-on-group-status-update.use-case.js";
import { catchAsync } from "../../../../shared/utils/CatchAsync.js";
import { NextFunction, Request, Response } from "express";
import { sendResponse } from "../../../../shared/utils/AppResonse.js";

@injectable()
export class MenuAddOnGroupStatusUpdateController {
  constructor(

    @inject(MenuTokens.MenuAddOnGroupStatusUpdateUseCase)
    private readonly menuAddOnGroupStatusUpdateUseCase: MenuAddOnGroupStatusUpdateUseCase

  ) { }

  handle = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const ownerId = req.user?.id as string
    const menuAddOnGroupId = req.params.menuAddOnGroupId as string
    const menuItemId = req.params.menuItemId as string

    await this.menuAddOnGroupStatusUpdateUseCase.execute({
      id: menuAddOnGroupId,
      menuItemId,
      ownerId
    })

    sendResponse(res, 200, {
      success: true,
      message: "Menu add on group status updated successfully"
    })

  })
}
