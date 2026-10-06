import { MenuItem } from "../entities/menu-item.entity.js";

export interface IMenuItemRepository {
  findById(id: string): Promise<MenuItem | null>
  findByMenuCategoryId(menuCategoryId: string): Promise<MenuItem[]>
  findByName(menuCategoryId: string, name: string): Promise<MenuItem | null>
  existsByName(menuCategoryId: string, name: string): Promise<Boolean>
  create(menuItem: MenuItem): Promise<MenuItem>
  update(id: string, menuItem: MenuItem): Promise<void>
  delete(id: string): Promise<void>
}
