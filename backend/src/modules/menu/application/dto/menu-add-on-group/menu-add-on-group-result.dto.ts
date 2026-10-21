import { MenuAddOnGroupStatus } from "../../../domain/enums/menu-add-on-group-status.enum.js";

export interface MenuAddOnGroupResult {
  id: string
  menuItemId: string
  name: string
  minSelections: number;
  maxSelections: number;
  status: MenuAddOnGroupStatus;
  displayOrder: number;
  createdAt: Date;
  updatedAt: Date;
}
