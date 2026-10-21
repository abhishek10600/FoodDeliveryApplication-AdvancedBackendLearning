import { MenuAddOnGroupCreationInput } from "../../dto/menu-add-on-group/menu-add-on-group-creation.dto.js";

export interface MenuAddOnGroupCreationUseCase {
  execute(input: MenuAddOnGroupCreationInput): Promise<unknown>
}
