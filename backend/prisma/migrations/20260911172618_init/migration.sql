/*
  Warnings:

  - You are about to drop the column `cuisine_name` on the `restaurant_cuisines` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[restaurantId,cuisineId]` on the table `restaurant_cuisines` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `cuisineId` to the `restaurant_cuisines` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "CuisineStatus" AS ENUM ('ACTIVE', 'INACTIVE');

-- DropIndex
DROP INDEX "restaurant_cuisines_cuisine_name_idx";

-- DropIndex
DROP INDEX "restaurant_cuisines_restaurantId_cuisine_name_key";

-- AlterTable
ALTER TABLE "restaurant_cuisines" DROP COLUMN "cuisine_name",
ADD COLUMN     "cuisineId" UUID NOT NULL;

-- CreateTable
CREATE TABLE "cuisines" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "cuisine_status" "CuisineStatus" NOT NULL DEFAULT 'ACTIVE',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "cuisines_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "cuisines_name_key" ON "cuisines"("name");

-- CreateIndex
CREATE UNIQUE INDEX "cuisines_slug_key" ON "cuisines"("slug");

-- CreateIndex
CREATE INDEX "cuisines_slug_idx" ON "cuisines"("slug");

-- CreateIndex
CREATE INDEX "restaurant_cuisines_cuisineId_idx" ON "restaurant_cuisines"("cuisineId");

-- CreateIndex
CREATE UNIQUE INDEX "restaurant_cuisines_restaurantId_cuisineId_key" ON "restaurant_cuisines"("restaurantId", "cuisineId");

-- AddForeignKey
ALTER TABLE "restaurant_cuisines" ADD CONSTRAINT "restaurant_cuisines_cuisineId_fkey" FOREIGN KEY ("cuisineId") REFERENCES "cuisines"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
