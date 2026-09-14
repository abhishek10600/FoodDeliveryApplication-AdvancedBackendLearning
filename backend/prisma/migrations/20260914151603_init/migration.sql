/*
  Warnings:

  - Added the required column `address` to the `restaurants` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "restaurants" ADD COLUMN     "address" JSONB NOT NULL;
