/*
  Warnings:

  - You are about to drop the `health_check` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('USER', 'ADMIN');

-- CreateEnum
CREATE TYPE "ContentStatus" AS ENUM ('DRAFT', 'ACTIVE', 'INACTIVE');

-- CreateEnum
CREATE TYPE "CefrMainLevel" AS ENUM ('A1', 'A2', 'B1', 'B2', 'C1', 'C2');

-- DropTable
DROP TABLE "health_check";

-- CreateTable
CREATE TABLE "user" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "role" "UserRole" NOT NULL DEFAULT 'USER',
    "displayName" TEXT,
    "dailyGoalCount" INTEGER NOT NULL DEFAULT 10,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "lastLoginAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "user_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "refresh_token" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "tokenHash" TEXT NOT NULL,
    "userAgent" TEXT,
    "ipAddress" TEXT,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "revokedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "refresh_token_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "level" (
    "id" TEXT NOT NULL,
    "code" "CefrMainLevel" NOT NULL,
    "displayName" TEXT NOT NULL,
    "sortOrder" INTEGER NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "level_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sub_level" (
    "id" TEXT NOT NULL,
    "levelId" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "displayName" TEXT NOT NULL,
    "sortOrder" INTEGER NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "sub_level_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_level" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "subLevelId" TEXT NOT NULL,
    "isPrimary" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "user_level_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "topic" (
    "id" TEXT NOT NULL,
    "subLevelId" TEXT NOT NULL,
    "levelId" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "displayName" TEXT NOT NULL,
    "description" TEXT,
    "sortOrder" INTEGER NOT NULL,
    "status" "ContentStatus" NOT NULL DEFAULT 'DRAFT',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "topic_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "user_email_key" ON "user"("email");

-- CreateIndex
CREATE INDEX "user_createdAt_idx" ON "user"("createdAt");

-- CreateIndex
CREATE INDEX "refresh_token_userId_idx" ON "refresh_token"("userId");

-- CreateIndex
CREATE INDEX "refresh_token_expiresAt_idx" ON "refresh_token"("expiresAt");

-- CreateIndex
CREATE UNIQUE INDEX "level_code_key" ON "level"("code");

-- CreateIndex
CREATE UNIQUE INDEX "sub_level_code_key" ON "sub_level"("code");

-- CreateIndex
CREATE INDEX "sub_level_levelId_idx" ON "sub_level"("levelId");

-- CreateIndex
CREATE INDEX "user_level_userId_idx" ON "user_level"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "user_level_userId_subLevelId_key" ON "user_level"("userId", "subLevelId");

-- CreateIndex
CREATE UNIQUE INDEX "topic_slug_key" ON "topic"("slug");

-- CreateIndex
CREATE INDEX "topic_subLevelId_idx" ON "topic"("subLevelId");

-- CreateIndex
CREATE INDEX "topic_levelId_idx" ON "topic"("levelId");

-- CreateIndex
CREATE INDEX "topic_status_idx" ON "topic"("status");

-- AddForeignKey
ALTER TABLE "refresh_token" ADD CONSTRAINT "refresh_token_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sub_level" ADD CONSTRAINT "sub_level_levelId_fkey" FOREIGN KEY ("levelId") REFERENCES "level"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_level" ADD CONSTRAINT "user_level_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_level" ADD CONSTRAINT "user_level_subLevelId_fkey" FOREIGN KEY ("subLevelId") REFERENCES "sub_level"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "topic" ADD CONSTRAINT "topic_subLevelId_fkey" FOREIGN KEY ("subLevelId") REFERENCES "sub_level"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "topic" ADD CONSTRAINT "topic_levelId_fkey" FOREIGN KEY ("levelId") REFERENCES "level"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
