import { injectable, inject } from "tsyringe"
import { IOrderPricingCatalog, IOrderPricingCatalogRecord } from "../../application/ports/order-pricing-catalog.port.js";
import { MenuTokens } from "../../../menu/infrastructure/persistence/tokens/menu.tokens.js";
import type { IMenuItemRepository } from "../../../menu/domain/repositories/menu-item.repository.js";

@injectable()
export class MenuItemPricingCatalogAdapter implements IOrderPricingCatalog {
  constructor(

    @inject(MenuTokens.MenuItemRepository)
    private readonly menuItemRepo: IMenuItemRepository

  ) { }

  async findByMenuItemId(menuItemId: string): Promise<IOrderPricingCatalogRecord | null> {
    const menuItem = await this.menuItemRepo.findByIdIncludeForeignData(menuItemId)

    if (!menuItem) {
      return null
    }

    return {
      menuItem: {
        id: menuItem.menuItem.getId(),
        name: menuItem.menuItem.getName().getValue(),
        price: menuItem.menuItem.getPrice(),
        currency: menuItem.menuItem.getCurrency(),
        status: menuItem.menuItem.getStatus(),
        isAvailable: menuItem.menuItem.getIsAvailable()
      },
      category: {
        status: menuItem.category.status
      },

      menu: {
        status: menuItem.menu.status
      },

      restaurant: {
        id: menuItem.restaurant.id,
        status: menuItem.restaurant.status
      }
    }
  }
}
