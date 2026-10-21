import { injectable, inject } from "tsyringe"
import { MenuTokens } from "../../infrastructure/persistence/tokens/menu.tokens.js";
import type { MenuAddOnGroupByMenuItemIdUseCase } from "../../application/use-cases/menu-add-on-group/menu-add-on-group-by-menu-item-id.use-case.js";
import { catchAsync } from "../../../../shared/utils/CatchAsync.js";
import { NextFunction, Request, Response } from "express";
import { sendResponse } from "../../../../shared/utils/AppResonse.js";

@injectable()
export class MenuAddOnGroupByMenuItemIdController {
  constructor(

    @inject(MenuTokens.MenuAddOnGroupByMenuItemIdUseCase)
    private readonly menuAddOnGroupByMenuItemIdUseCase: MenuAddOnGroupByMenuItemIdUseCase

  ) { }

  handle = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const menuItemId = req.params.id as string

    const result = await this.menuAddOnGroupByMenuItemIdUseCase.execute({
      menuItemId
    })

    sendResponse(res, 200, {
      success: true,
      message: "Menu add on groups fetched successfully",
      data: result
    })
  })
}
