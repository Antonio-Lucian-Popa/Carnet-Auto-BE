/*
  Warnings:

  - You are about to drop the column `fullTank` on the `FuelLog` table. All the data in the column will be lost.
  - You are about to drop the column `kilometers` on the `FuelLog` table. All the data in the column will be lost.
  - You are about to alter the column `price` on the `SubscriptionPlan` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Decimal(10,2)`.
  - Added the required column `odometer` to the `FuelLog` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `FuelLog` table without a default value. This is not possible if the table is not empty.
  - Made the column `price` on table `FuelLog` required. This step will fail if there are existing NULL values in that column.
  - Changed the type of `type` on the `Reminder` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "ReminderType" AS ENUM ('ITP', 'RCA', 'ULEI', 'REVIZIE');

-- CreateEnum
CREATE TYPE "SubscriptionType" AS ENUM ('FREE', 'PRO', 'FLEET');

-- AlterTable
ALTER TABLE "FuelLog" DROP COLUMN "fullTank",
DROP COLUMN "kilometers",
ADD COLUMN     "odometer" INTEGER NOT NULL,
ADD COLUMN     "station" TEXT,
ADD COLUMN     "userId" TEXT NOT NULL,
ALTER COLUMN "date" SET DEFAULT CURRENT_TIMESTAMP,
ALTER COLUMN "price" SET NOT NULL;

-- AlterTable
ALTER TABLE "Reminder" DROP COLUMN "type",
ADD COLUMN     "type" "ReminderType" NOT NULL;

-- AlterTable
ALTER TABLE "RepairLog" ALTER COLUMN "date" SET DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "SubscriptionPlan" ALTER COLUMN "price" SET DATA TYPE DECIMAL(10,2);

-- AddForeignKey
ALTER TABLE "FuelLog" ADD CONSTRAINT "FuelLog_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
