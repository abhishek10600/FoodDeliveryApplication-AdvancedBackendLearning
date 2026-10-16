export interface MenuItemCreationInput {
  restaurantId: string
  ownerId: string
  menuCategoryId: string
  name: string
  description?: string
  price: number
  currency: string
}
