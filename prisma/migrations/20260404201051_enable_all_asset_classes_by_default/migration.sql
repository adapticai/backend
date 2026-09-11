-- AlterTable
ALTER TABLE "trading_policies" ALTER COLUMN "cryptoEnabled" SET DEFAULT true,
ALTER COLUMN "optionsEnabled" SET DEFAULT true,
ALTER COLUMN "futuresEnabled" SET DEFAULT true,
ALTER COLUMN "forexEnabled" SET DEFAULT true;
