import { injectable, inject } from "tsyringe"
import { MenuTokens } from "../../infrastructure/persistence/tokens/menu.tokens.js";
import type { MenuItemCurrencyUpdateUseCase } from "../../application/use-cases/menu-item/menu-item-currency-update.use-case.js";
import { catchAsync } from "../../../../shared/utils/CatchAsync.js";
import { NextFunction, Request, Response } from "express";
import { sendResponse } from "../../../../shared/utils/AppResonse.js";

@injectable()
export class MenuItemCurrencyUpdateController {
  constructor(

    @inject(MenuTokens.MenuItemCurrencyUpdateUseCase)
    private readonly menuItemCurrencyUpdateUseCase: MenuItemCurrencyUpdateUseCase

  ) { }

  handle = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const ownerId = req.user?.id as string
    const menuItemId = req.params.id as string

    await this.menuItemCurrencyUpdateUseCase.execute({
      id: menuItemId,
      ownerId,
      currency: req.body.currency
    })

    sendResponse(res, 200, {
      success: true,
      message: "Menu item currency updated successfully"
    })
  })
}
