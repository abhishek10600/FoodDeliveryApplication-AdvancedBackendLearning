import { injectable, inject} from "tsyringe"
import { MenuTokens } from "../../infrastructure/persistence/tokens/menu.tokens.js";
import type { MenuUpdationUseCase } from "../../application/use-cases/menu/menu-updation.use-case.js";
import { catchAsync } from "../../../../shared/utils/CatchAsync.js";
import { NextFunction, Request, Response } from "express";
import { sendResponse } from "../../../../shared/utils/AppResonse.js";

@injectable()
export class MenuUpdationController {
  constructor(

    @inject(MenuTokens.MenuUpdationUseCase)
    private readonly menuUpdationUseCase: MenuUpdationUseCase

  ) { }

  handle = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const ownerId = req.user?.id as string
    const menuId = req.params.menuId as string

    const result = await this.menuUpdationUseCase.execute({
      menuId,
      ownerId,
      name: req.body.name
    })

    sendResponse(res, 200, {
      success: true,
      message: "Menu updated successfully",
      data: result
    })

  })
}
