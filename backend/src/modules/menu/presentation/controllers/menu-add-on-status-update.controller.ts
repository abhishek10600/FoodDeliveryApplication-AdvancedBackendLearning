import { injectable, inject } from "tsyringe"
import { MenuTokens } from "../../infrastructure/persistence/tokens/menu.tokens.js";
import type { MenuAddOnStatusUpdateUseCase } from "../../application/use-cases/menu-add-on/menu-add-on-status-update.use-case.js";
import { catchAsync } from "../../../../shared/utils/CatchAsync.js";
import { NextFunction, Request, Response } from "express";
import { sendResponse } from "../../../../shared/utils/AppResonse.js";

@injectable()
export class MenuAddOnStatusUpdateController {

  constructor(

    @inject(MenuTokens.MenuAddOnStatusUpdateUseCase)
    private readonly menuAddOnStatusUpdateUseCase: MenuAddOnStatusUpdateUseCase

  ) { }

  handle = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const ownerId = req.user?.id as string
    const menuAddOnId = req.params.id as string
    const menuAddOnGroupId = req.params.menuAddOnGroupId as string

    await this.menuAddOnStatusUpdateUseCase.execute({
      id: menuAddOnId,
      menuAddOnGroupId,
      ownerId
    })

    sendResponse(res, 200, {
      success: true,
      message: "Menu add on status updated successfully"
    })

  })

}
