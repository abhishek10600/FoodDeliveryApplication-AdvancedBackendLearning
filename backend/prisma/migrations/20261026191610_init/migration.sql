/*
  Warnings:

  - Added the required column `firstName` to the `drivers` table without a default value. This is not possible if the table is not empty.
  - Added the required column `lastName` to the `drivers` table without a default value. This is not possible if the table is not empty.
  - Added the required column `phone` to the `drivers` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "drivers" ADD COLUMN     "firstName" TEXT NOT NULL,
ADD COLUMN     "lastName" TEXT NOT NULL,
ADD COLUMN     "phone" VARCHAR(15) NOT NULL,
ALTER COLUMN "status" SET DEFAULT 'ACTIVE';
