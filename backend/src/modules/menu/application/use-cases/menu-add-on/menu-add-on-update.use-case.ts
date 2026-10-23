import { MenuAddOnUpdateInput } from "../../dto/menu-add-on/menu-add-on-update.dto.js";

export interface MenuAddOnUpdateUseCase {
  execute(input: MenuAddOnUpdateInput): Promise<void>
}
