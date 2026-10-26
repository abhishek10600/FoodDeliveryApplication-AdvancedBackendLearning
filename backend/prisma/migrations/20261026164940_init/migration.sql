-- CreateEnum
CREATE TYPE "DriverAvailability" AS ENUM ('OFFLINE', 'ONLINE');

-- CreateEnum
CREATE TYPE "DriverStatus" AS ENUM ('PENDING', 'ACTIVE', 'INACTIVE', 'SUSPENDED');

-- CreateEnum
CREATE TYPE "DriverVehicleType" AS ENUM ('bicycle', 'scooter', 'motorbike', 'car');

-- CreateTable
CREATE TABLE "drivers" (
    "id" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "status" "DriverStatus" NOT NULL DEFAULT 'PENDING',
    "availability" "DriverAvailability" NOT NULL DEFAULT 'OFFLINE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "drivers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "driver_vehicles" (
    "id" UUID NOT NULL,
    "driverId" UUID NOT NULL,
    "vehicleType" "DriverVehicleType" NOT NULL,
    "driver_vehicle_registration_number_number" INTEGER NOT NULL,
    "driver_vehicle_color" VARCHAR(100) NOT NULL,
    "driver_vehicle_model" VARCHAR(100) NOT NULL,
    "driver_vehicle_make" VARCHAR(100) NOT NULL,
    "driver_vehicle_is_active" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "driver_vehicles_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "drivers_userId_key" ON "drivers"("userId");

-- CreateIndex
CREATE INDEX "drivers_status_createdAt_idx" ON "drivers"("status", "createdAt");

-- CreateIndex
CREATE INDEX "drivers_status_availability_idx" ON "drivers"("status", "availability");

-- CreateIndex
CREATE UNIQUE INDEX "driver_vehicles_driverId_key" ON "driver_vehicles"("driverId");

-- CreateIndex
CREATE INDEX "driver_vehicles_driverId_driver_vehicle_is_active_idx" ON "driver_vehicles"("driverId", "driver_vehicle_is_active");

-- AddForeignKey
ALTER TABLE "drivers" ADD CONSTRAINT "drivers_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "driver_vehicles" ADD CONSTRAINT "driver_vehicles_driverId_fkey" FOREIGN KEY ("driverId") REFERENCES "drivers"("id") ON DELETE CASCADE ON UPDATE CASCADE;
