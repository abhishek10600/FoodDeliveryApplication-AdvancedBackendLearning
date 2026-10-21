import { injectable, inject } from "tsyringe"
import { MenuTokens } from "../../infrastructure/persistence/tokens/menu.tokens.js";
import type { MenuAddOnGroupCreationUseCase } from "../../application/use-cases/menu-add-on-group/menu-add-on-group-creation.use-case.js";
import { catchAsync } from "../../../../shared/utils/CatchAsync.js";
import { NextFunction, Request, Response } from "express";
import { sendResponse } from "../../../../shared/utils/AppResonse.js";

@injectable()
export class MenuAddOnGroupCreationController {
  constructor(

    @inject(MenuTokens.MenuAddOnGroupCreationUseCase)
    private readonly menuAddOnGroupCreationUseCase: MenuAddOnGroupCreationUseCase

  ) { }

  handle = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const ownerId = req.user?.id as string
    const menuItemId = req.params.id as string

    const result = await this.menuAddOnGroupCreationUseCase.execute({
      menuItemId,
      ownerId,
      name: req.body.name
    })

    sendResponse(res, 201, {
      success: true,
      message: "Menu add on group created successfully",
      data: result
    })
  })
}
