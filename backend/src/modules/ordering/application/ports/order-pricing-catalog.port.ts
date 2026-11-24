export interface IOrderPricingMenuItem {
  id: string
  name: string
  price: number
  currency: string
  status: string
  isAvailable: boolean
}

export interface IOrderPricingCategory {
  status: string
}

export interface IOrderPricingMenu {
  status: string
}

export interface IOrderPricingRestaurant {
  id: string
  status: string
}

export interface IOrderPricingCatalogRecord {

  menuItem: IOrderPricingMenuItem
  category: IOrderPricingCategory
  menu: IOrderPricingMenu
  restaurant: IOrderPricingRestaurant
}

export interface IOrderPricingCatalog {
  findByMenuItemId(menuItemId: string): Promise<IOrderPricingCatalogRecord | null>
}
