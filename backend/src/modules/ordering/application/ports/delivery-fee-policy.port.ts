export interface IDeliveryFeeInput {
  restaurantId: string
  currency: string
  subTotal: number
}

export interface IDeliveryFeePolicy {
  calculate(input: IDeliveryFeeInput): Promise<number>
}
