import { injectable, inject } from "tsyringe"
import { MenuTokens } from "../../infrastructure/persistence/tokens/menu.tokens.js";
import type { MenuCreationUseCase } from "../../application/use-cases/menu/menu-creation.use-case.js";
import { catchAsync } from "../../../../shared/utils/CatchAsync.js";
import { NextFunction, Request, Response } from "express";
import { sendResponse } from "../../../../shared/utils/AppResonse.js";

@injectable()
export class MenuCreationController {

  constructor(

    @inject(MenuTokens.MenuCreationUseCase)
    private readonly menuCreationUseCase: MenuCreationUseCase

  ) { }

  handle = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const ownerId = req.user?.id as string

    const restaurantId = req.params.restaurantId as string

    const result = await this.menuCreationUseCase.execute({
      restaurantId,
      name: req.body.name,
    }, ownerId)

    sendResponse(res, 201, {
      success: true,
      message: "Menu created successfully",
      data: result
    })
  })

}
