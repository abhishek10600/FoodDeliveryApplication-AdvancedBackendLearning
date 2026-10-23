import { MenuAddOnByIdInput } from "../../dto/menu-add-on/menu-add-on-by-id.dto.js";
import { MenuAddOnResult } from "../../dto/menu-add-on/menu-add-on-result.dto.js";

export interface MenuAddOnByIdUseCase {
  execute(input: MenuAddOnByIdInput): Promise<MenuAddOnResult>
}
