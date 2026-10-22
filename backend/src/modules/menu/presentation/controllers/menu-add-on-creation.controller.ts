import { injectable, inject } from "tsyringe"
import { MenuTokens } from "../../infrastructure/persistence/tokens/menu.tokens.js";
import type { MenuAddOnCreationUseCase } from "../../application/use-cases/menu-add-on/menu-add-on-creation.use-case.js";
import { catchAsync } from "../../../../shared/utils/CatchAsync.js";
import { NextFunction, Request, Response } from "express";
import { sendResponse } from "../../../../shared/utils/AppResonse.js";

@injectable()
export class MenuAddOnCreationController {
  constructor(

    @inject(MenuTokens.MenuAddOnCreationUseCase)
    private readonly menuAddOnCreationUseCase: MenuAddOnCreationUseCase

  ) { }

  handle = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const ownerId = req.user?.id as string
    const menuAddOnGroupId = req.params.menuAddOnGroupId as string

    const result = await this.menuAddOnCreationUseCase.execute({
      menuAddOnGroupId,
      ownerId,
      name: req.body.name,
      price: req.body.price,
      currency: req.body.currency
    })

    sendResponse(res, 201, {
      success: true,
      message: "Menu add on created successfully",
      data: result
    })

  })
}
