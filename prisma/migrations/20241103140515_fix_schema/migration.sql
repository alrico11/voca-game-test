/*
  Warnings:

  - You are about to drop the `UserWallet` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_UserToUserWallet` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[userId]` on the table `Wallet` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `transactionType` to the `Transaction` table without a default value. This is not possible if the table is not empty.
  - Added the required column `trx` to the `Transaction` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `Wallet` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "TransactionType" AS ENUM ('PAYMENT', 'DEPOSIT', 'WITHDRAWAL');

-- DropForeignKey
ALTER TABLE "Transaction" DROP CONSTRAINT "Transaction_productId_fkey";

-- DropForeignKey
ALTER TABLE "UserWallet" DROP CONSTRAINT "UserWallet_walletId_fkey";

-- DropForeignKey
ALTER TABLE "_UserToUserWallet" DROP CONSTRAINT "_UserToUserWallet_A_fkey";

-- DropForeignKey
ALTER TABLE "_UserToUserWallet" DROP CONSTRAINT "_UserToUserWallet_B_fkey";

-- AlterTable
ALTER TABLE "Transaction" ADD COLUMN     "transactionType" "TransactionType" NOT NULL,
ADD COLUMN     "trx" JSONB NOT NULL,
ALTER COLUMN "productId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "walletId" TEXT;

-- AlterTable
ALTER TABLE "Wallet" ADD COLUMN     "userId" TEXT NOT NULL,
ALTER COLUMN "balance" SET DEFAULT 0;

-- DropTable
DROP TABLE "UserWallet";

-- DropTable
DROP TABLE "_UserToUserWallet";

-- CreateIndex
CREATE UNIQUE INDEX "Wallet_userId_key" ON "Wallet"("userId");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_walletId_fkey" FOREIGN KEY ("walletId") REFERENCES "Wallet"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE SET NULL ON UPDATE CASCADE;
