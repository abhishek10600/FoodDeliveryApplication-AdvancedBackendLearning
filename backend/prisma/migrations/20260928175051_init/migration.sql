/*
  Warnings:

  - Added the required column `city` to the `restaurants` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "restaurants" ADD COLUMN     "city" TEXT NOT NULL;

-- CreateIndex
CREATE INDEX "restaurants_city_idx" ON "restaurants"("city");
