import { MenuItemCurrencyUpdateInput } from "../../dto/menu-item/menu-item-currency-update.dto.js";

export interface MenuItemCurrencyUpdateUseCase {
  execute(input: MenuItemCurrencyUpdateInput): Promise<void>
}
