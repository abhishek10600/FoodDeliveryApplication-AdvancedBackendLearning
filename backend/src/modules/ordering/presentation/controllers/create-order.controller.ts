import { injectable, inject } from "tsyringe"
import { OrderTokens } from "../../infrastructure/persistence/tokens/order.token.js";
import type { OrderCreationMetadata, OrderCreationUseCase } from "../../application/use-cases/order-creation.use-case.js";
import { catchAsync } from "../../../../shared/utils/CatchAsync.js";
import { NextFunction, Request, Response } from "express";
import { sendResponse } from "../../../../shared/utils/AppResonse.js";
import { requestContextStore } from "../../../../shared/request-context/request-context.js";

@injectable()
export class CreateOrderController {

  constructor(

    @inject(OrderTokens.OrderCreationUseCase)
    private readonly orderCreationUseCase: OrderCreationUseCase

  ) { }

  handle = catchAsync(async (req: Request, res: Response, next: NextFunction) => {

    const userId = req.user?.id as string

    const idempotencyKey = req.get("Idempotency-Key")?.trim()

    if (!idempotencyKey) {
      return res.status(400).json({
        success: false,
        message: "Idempotency-Key header is required"
      })
    }

    if (idempotencyKey.length > 128) {
      return res.status(400).json({
        success: false,
        message: "Idempotency-Key cannot exceed 128 characters",
      });
    }

    const context = requestContextStore.getOrThrow()

    const correlationId = context.correlationId

    console.log(`correltationId: ${correlationId}`)

    const metadata: OrderCreationMetadata = { idempotencyKey, correlationId };

    const result = await this.orderCreationUseCase.execute(userId, req.body, metadata)

    sendResponse(res, 201, {
      success: true,
      message: "Order created successfully",
      data: result
    })

  })

}
