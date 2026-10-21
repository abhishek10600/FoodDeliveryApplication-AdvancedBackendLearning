import { MenuAddOnGroupStatusUpdateInput } from "../../dto/menu-add-on-group/menu-add-on-group-status-update.dto.js";

export interface MenuAddOnGroupStatusUpdateUseCase {
  execute(input: MenuAddOnGroupStatusUpdateInput): Promise<void>
}
