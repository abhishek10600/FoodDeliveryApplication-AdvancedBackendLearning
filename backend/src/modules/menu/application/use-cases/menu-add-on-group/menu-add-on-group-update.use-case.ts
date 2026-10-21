import { MenuAddOnGroupUpdateInput } from "../../dto/menu-add-on-group/menu-add-on-group-update.dto.js";

export interface MenuAddOnGroupUpdateUseCase {
  execute(input: MenuAddOnGroupUpdateInput): Promise<void>
}
