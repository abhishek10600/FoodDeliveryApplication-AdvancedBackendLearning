import { injectable, inject } from "tsyringe"
import { MenuTokens } from "../../infrastructure/persistence/tokens/menu.tokens.js";
import type { MenuAddOnByIdUseCase } from "../../application/use-cases/menu-add-on/menu-add-on-by-id.use-case.js";
import { catchAsync } from "../../../../shared/utils/CatchAsync.js";
import { NextFunction, Request, Response } from "express";
import { sendResponse } from "../../../../shared/utils/AppResonse.js";

@injectable()
export class MenuAddOnByIdController {

  constructor(

    @inject(MenuTokens.MenuAddOnByIdUseCase)
    private menuAddOnByIdUseCase: MenuAddOnByIdUseCase

  ) { }

  handle = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const menuAddOnId = req.params.id as string

    const result = await this.menuAddOnByIdUseCase.execute({
      id: menuAddOnId
    })

    sendResponse(res, 200, {
      success: true,
      message: "Menu add on fetched successfully",
      data: result
    })
  })

}
