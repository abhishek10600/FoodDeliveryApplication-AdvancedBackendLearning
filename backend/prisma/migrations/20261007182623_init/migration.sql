/*
  Warnings:

  - A unique constraint covering the columns `[menuAddOnGroupId,menu_add_on_name]` on the table `menu_add_ons` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "menu_add_ons_menuAddOnGroupId_menu_add_on_name_key" ON "menu_add_ons"("menuAddOnGroupId", "menu_add_on_name");
