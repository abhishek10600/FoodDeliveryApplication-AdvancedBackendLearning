import { injectable, inject } from "tsyringe";
import { CustomerTokens } from "../../infrastructure/persistence/tokens/customer.tokens.js";
import type { CustomerAvatarUploadWithoutStreamUseCase } from "../../application/use-cases/customer-avatar-upload-without-stream.use-case.js";
import { catchAsync } from "../../../../shared/utils/CatchAsync.js";
import { NextFunction, Request, Response } from "express";
import { AppError } from "../../../../shared/errors/AppError.js";
import { sendResponse } from "../../../../shared/utils/AppResonse.js";

@injectable()
export class CustomerAvatarUploadWithoutStreamController {

  constructor(

    @inject(CustomerTokens.CustomerAvatarUploadWithoutStreamUseCase)
    private readonly customerAvatarUploadWithoutStreamUseCase: CustomerAvatarUploadWithoutStreamUseCase

  ) { }

  handle = catchAsync(async (req: Request, res: Response, next: NextFunction) => {

    const userId = req.user?.id as string

    if (!req.file) {
      throw new AppError("Avatar file is required", 400, "AVATAR_FILE_NOT_FOUND", true)
    }

    await this.customerAvatarUploadWithoutStreamUseCase.execute({
      userId,

      file: req.file
    })

    sendResponse(res, 200, {
      success: true,
      message: "Customer avatar updated successfully"
    })

  })

}
