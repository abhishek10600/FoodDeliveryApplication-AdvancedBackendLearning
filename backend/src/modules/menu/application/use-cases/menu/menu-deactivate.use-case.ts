import { MenuDeactivateInput } from "../../dto/menu/menu-deactivate.dto.js";

export interface MenuDeactivateUseCase {
  execute(input: MenuDeactivateInput): Promise<void>
}
