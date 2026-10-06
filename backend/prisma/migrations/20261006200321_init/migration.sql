/*
  Warnings:

  - A unique constraint covering the columns `[menuCategoryId,menu_item_name]` on the table `menu_items` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "menu_items_menuCategoryId_menu_item_name_key" ON "menu_items"("menuCategoryId", "menu_item_name");
