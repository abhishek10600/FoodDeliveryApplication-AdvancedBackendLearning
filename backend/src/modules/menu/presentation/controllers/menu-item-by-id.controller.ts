import { injectable, inject} from "tsyringe"
import { MenuTokens } from "../../infrastructure/persistence/tokens/menu.tokens.js";
import type { MenuItemByIdUseCase } from "../../application/use-cases/menu-item/menu-item-by-id.use-case.js";
import { catchAsync } from "../../../../shared/utils/CatchAsync.js";
import { NextFunction, Request, Response } from "express";
import { sendResponse } from "../../../../shared/utils/AppResonse.js";

@injectable()
export class MenuItemByIdController {
  constructor(

    @inject(MenuTokens.MenuItemByIdUseCase)
    private readonly menuItemByIdUseCase: MenuItemByIdUseCase

  ) { }

  handle = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const menuItemId = req.params.id as string

    const result = await this.menuItemByIdUseCase.execute({
      id: menuItemId
    })

    sendResponse(res, 200, {
      success: true,
      message: "Menu item fetched successfully",
      data: result
    })
  })
}
