import { injectable, inject } from "tsyringe"
import { MenuTokens } from "../../infrastructure/persistence/tokens/menu.tokens.js";
import type { MenuAddOnUpdateUseCase } from "../../application/use-cases/menu-add-on/menu-add-on-update.use-case.js";
import { catchAsync } from "../../../../shared/utils/CatchAsync.js";
import { NextFunction, Request, Response } from "express";
import { sendResponse } from "../../../../shared/utils/AppResonse.js";

@injectable()
export class MenuAddOnUpdateController {
  constructor(

    @inject(MenuTokens.MenuAddOnUpdateUseCase)
    private readonly menuAddOnUpdateUseCase: MenuAddOnUpdateUseCase

  ) { }

  handle = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const ownerId = req.user?.id as string
    const menuAddOnGroupId = req.params.menuAddOnGroupId as string
    const menuAddOnId = req.params.id as string

    await this.menuAddOnUpdateUseCase.execute({
      id: menuAddOnId,
      menuAddOnGroupId,
      ownerId,
      name: req.body.name,
      price: req.body.price,
      currency: req.body.currency,
      displayOrder: req.body.displayOrder
    })

    sendResponse(res, 200, {
      success: true,
      message: "Menu add on updated successfully"
    })
  })
}
