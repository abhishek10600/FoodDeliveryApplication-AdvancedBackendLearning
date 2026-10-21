import { injectable, inject } from "tsyringe"
import { MenuTokens } from "../../infrastructure/persistence/tokens/menu.tokens.js";
import type { MenuAddOnGroupUpdateUseCase } from "../../application/use-cases/menu-add-on-group/menu-add-on-group-update.use-case.js";
import { catchAsync } from "../../../../shared/utils/CatchAsync.js";
import { NextFunction, Request, Response } from "express";
import { sendResponse } from "../../../../shared/utils/AppResonse.js";

@injectable()
export class MenuAddOnGroupUpdateController {
  constructor(

    @inject(MenuTokens.MenuAddOnGroupUpdateUseCase)
    private readonly menuAddOnGroupUpdateUseCase: MenuAddOnGroupUpdateUseCase

  ) { }

  handle = catchAsync(async (req: Request, res: Response, next: NextFunction) => {

    const ownerId = req.user?.id as string
    const menuItemId = req.params.menuItemId as string
    const menuAddOnGroupId = req.params.menuAddOnGroupId as string

    await this.menuAddOnGroupUpdateUseCase.execute({
      id: menuAddOnGroupId,
      menuItemId,
      ownerId,
      name: req.body.name,
      minSelections: req.body.minSelections,
      maxSelections: req.body.maxSelections,
      displayOrder: req.body.displayOrder
    })

    sendResponse(res, 200, {
      success: true,
      message: "Menu add on group updated successfully"
    })

  })
}
