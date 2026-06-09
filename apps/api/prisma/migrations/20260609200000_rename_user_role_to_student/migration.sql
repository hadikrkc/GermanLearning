-- Rename enum value USER -> STUDENT
-- PostgreSQL 10+ supports renaming enum values in-place.
-- Existing rows with role='USER' automatically reflect the new name.
ALTER TYPE "UserRole" RENAME VALUE 'USER' TO 'STUDENT';

-- Update column default
ALTER TABLE "user" ALTER COLUMN "role" SET DEFAULT 'STUDENT'::"UserRole";
