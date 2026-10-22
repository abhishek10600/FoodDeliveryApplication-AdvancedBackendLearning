import { MenuAddOnCreationInput } from "../../dto/menu-add-on/menu-add-on-creation.dto.js";
import { MenuAddOnResult } from "../../dto/menu-add-on/menu-add-on-result.dto.js";

export interface MenuAddOnCreationUseCase {
  execute(input: MenuAddOnCreationInput): Promise<MenuAddOnResult>
}
