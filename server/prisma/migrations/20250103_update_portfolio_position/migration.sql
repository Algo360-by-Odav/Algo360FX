-- AlterTable Portfolio
ALTER TABLE "Portfolio" 
ADD COLUMN "description" TEXT,
ADD COLUMN "isPublic" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN "config" JSONB;

-- AlterTable Position
ALTER TABLE "Position" 
ADD COLUMN "portfolioId" TEXT,
ADD COLUMN "metadata" JSONB,
ALTER COLUMN "volume" RENAME TO "size",
ALTER COLUMN "openPrice" RENAME TO "entryPrice",
ALTER COLUMN "status" SET DEFAULT 'OPEN';

-- AddForeignKey
ALTER TABLE "Position" ADD CONSTRAINT "Position_portfolioId_fkey" FOREIGN KEY ("portfolioId") REFERENCES "Portfolio"("id") ON DELETE CASCADE ON UPDATE CASCADE;
