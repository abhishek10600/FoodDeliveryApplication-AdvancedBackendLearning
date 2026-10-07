/*
  Warnings:

  - A unique constraint covering the columns `[restaurantId]` on the table `menus` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "menus_restaurantId_key" ON "menus"("restaurantId");
