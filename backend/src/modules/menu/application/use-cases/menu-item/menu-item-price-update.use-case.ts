import { MenuItemPriceUpdateInput } from "../../dto/menu-item/menu-item-price-update.dto.js";

export interface MenuItemPriceUpdateUseCase {
  execute(input: MenuItemPriceUpdateInput): Promise<void>
}
