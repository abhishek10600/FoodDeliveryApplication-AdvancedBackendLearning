export interface IOrderPricingRequestItem {
  menuItemId: string
  quantity: number
}

export interface IOrderPricingInput {
  restaurantId: string
  items: IOrderPricingRequestItem[]
}

export interface IPricedOrderItem {
  menuItemId: string
  itemName: string
  unitPrice: number
  quantity: number
  lineTotal: number
}

export interface IOrderPricingResult {
  items: IPricedOrderItem[]
  currency: string
  subTotal: number
  deliveryFee: number
  total: number
}
