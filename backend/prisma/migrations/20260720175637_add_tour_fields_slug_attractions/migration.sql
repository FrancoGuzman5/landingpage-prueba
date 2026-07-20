-- AlterTable
ALTER TABLE "Tour" ADD COLUMN     "accommodation" JSONB,
ADD COLUMN     "attractions" JSONB,
ADD COLUMN     "image" TEXT,
ADD COLUMN     "priceOriginal" DOUBLE PRECISION,
ADD COLUMN     "slug" TEXT NOT NULL,
ALTER COLUMN "capacityMin" DROP NOT NULL,
ALTER COLUMN "capacityMax" DROP NOT NULL,
DROP COLUMN "includes",
ADD COLUMN     "includes" TEXT[] DEFAULT ARRAY[]::TEXT[],
DROP COLUMN "notIncluded",
ADD COLUMN     "notIncluded" TEXT[] DEFAULT ARRAY[]::TEXT[];

-- CreateIndex
CREATE UNIQUE INDEX "Tour_slug_key" ON "Tour"("slug");

