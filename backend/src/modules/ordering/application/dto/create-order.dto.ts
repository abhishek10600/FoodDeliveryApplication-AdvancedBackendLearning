export interface CreateOrderItemInput {
  menuItemId: string
  quantity: string
}

export interface CreateOrderInput {
  restaurantId: string
  addressId: string
  items: CreateOrderItemInput[]
}


