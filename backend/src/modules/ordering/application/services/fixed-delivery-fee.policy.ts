import { injectable } from "tsyringe"
import { IDeliveryFeeInput, IDeliveryFeePolicy } from "../ports/delivery-fee-policy.port.js";

@injectable()
export class FixedDeliveryFeePolicy implements IDeliveryFeePolicy {

  private readonly deliveryFee: number = 4000

  public async calculate(input: IDeliveryFeeInput): Promise<number> {
    if (input.currency !== "INR") {
      throw new Error(`Unsupported currency: ${input.currency}`)
    }

    return this.deliveryFee
  }

}
