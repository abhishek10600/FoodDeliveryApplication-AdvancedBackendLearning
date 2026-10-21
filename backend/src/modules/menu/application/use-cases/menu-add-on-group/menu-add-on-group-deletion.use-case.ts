import { MenuAddOnGroupDeletionInput } from "../../dto/menu-add-on-group/menu-add-on-group-deletion.dto.js";

export interface MenuAddOnGroupDeletionUseCase {
  execute(input: MenuAddOnGroupDeletionInput): Promise<void>
}
