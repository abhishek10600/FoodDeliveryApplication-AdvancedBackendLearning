import { IMenuItemWithForeignData } from "../../types/index.js";
import { MenuItem } from "../entities/menu-item.entity.js";

export interface IMenuItemRepository {
  findById(id: string): Promise<MenuItem | null>
  findByIdIncludeForeignData(id: string): Promise<IMenuItemWithForeignData | null>
  findManyByIdsIncludeForeignData(ids: string[]): Promise<IMenuItemWithForeignData[]>
  findByMenuCategoryId(menuCategoryId: string): Promise<MenuItem[]>
  existsByName(menuCategoryId: string, name: string): Promise<boolean>
  create(menuItem: MenuItem): Promise<MenuItem>
  update(id: string, menuItem: MenuItem): Promise<void>
  delete(id: string): Promise<void>
}
