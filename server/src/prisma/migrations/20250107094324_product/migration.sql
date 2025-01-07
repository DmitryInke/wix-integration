-- CreateEnum
CREATE TYPE "ProductType" AS ENUM ('PHYSICAL');

-- CreateTable
CREATE TABLE "Product" (
    "id" TEXT NOT NULL,
    "inventoryItemId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "productType" "ProductType" NOT NULL,
    "description" TEXT,
    "sku" TEXT,
    "price" DOUBLE PRECISION NOT NULL,
    "inventory" TEXT NOT NULL,
    "productOptions" JSONB,
    "imageUrl" TEXT,
    "createdDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lastUpdated" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Product_pkey" PRIMARY KEY ("id")
);
