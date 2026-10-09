import { MenuActivateInput } from "../../dto/menu/menu-activate.dto.js";

export interface MenuActivateUseCase {
  execute(input: MenuActivateInput): Promise<void>
}
