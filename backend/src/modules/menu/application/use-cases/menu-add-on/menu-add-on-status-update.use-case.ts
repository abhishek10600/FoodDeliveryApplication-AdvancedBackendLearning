import { MenuAddOnStatusUpdateInput } from "../../dto/menu-add-on/menu-add-on-status-update.dto.js";

export interface MenuAddOnStatusUpdateUseCase {
  execute(input: MenuAddOnStatusUpdateInput): Promise<void>
}
