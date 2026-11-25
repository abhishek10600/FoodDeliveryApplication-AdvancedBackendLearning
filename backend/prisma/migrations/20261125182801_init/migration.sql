/*
  Warnings:

  - A unique constraint covering the columns `[customer_id,idempotency_key]` on the table `orders` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `idempotency_key` to the `orders` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "orders" ADD COLUMN     "idempotency_key" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "orders_customer_id_idempotency_key_key" ON "orders"("customer_id", "idempotency_key");
