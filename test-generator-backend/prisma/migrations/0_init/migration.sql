-- Baseline: the schema as it existed before 20260907013000_add_refresh_token_hash.
--
-- The original tables were created outside Prisma Migrate (TypeORM synchronize),
-- so the first recorded migration only ALTERed existing tables and
-- `prisma migrate deploy` could not build a database from scratch.
--
-- This migration recreates that starting point so all later migrations apply
-- cleanly on an empty database. It is guarded: if the "user" table already
-- exists it does nothing, so running it against an existing database is safe.
-- Existing databases should still record it as applied without running it:
--   npx prisma migrate resolve --applied 0_init

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

DO $baseline$
BEGIN
  IF to_regclass('public."user"') IS NOT NULL THEN
    RAISE NOTICE '0_init: existing schema detected, skipping baseline';
    RETURN;
  END IF;

  CREATE TABLE "user_role" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "role_name" VARCHAR(255) NOT NULL,
    CONSTRAINT "user_role_pkey" PRIMARY KEY ("id")
  );

  CREATE TABLE "user" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "name" VARCHAR(255) NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "password" VARCHAR(255) NOT NULL,
    "otp" VARCHAR(255),
    "otpExpiresAt" TIMESTAMPTZ(6),
    "roleId" UUID,
    "isSuspended" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "user_pkey" PRIMARY KEY ("id")
  );
  CREATE UNIQUE INDEX "user_email_key" ON "user"("email");

  CREATE TABLE "classes" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "name" VARCHAR(255) NOT NULL,
    "code" VARCHAR(50) NOT NULL,
    "description" TEXT,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "classes_pkey" PRIMARY KEY ("id")
  );
  CREATE UNIQUE INDEX "classes_name_key" ON "classes"("name");
  CREATE UNIQUE INDEX "classes_code_key" ON "classes"("code");

  CREATE TABLE "books" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "book_name" VARCHAR(255) NOT NULL,
    "description" TEXT,
    "edition" VARCHAR(100),
    "created_At" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_At" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "classId" UUID,
    CONSTRAINT "books_pkey" PRIMARY KEY ("id")
  );

  CREATE TABLE "chapters" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "chapter_name" VARCHAR(255) NOT NULL,
    "order" INTEGER NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "bookId" UUID,
    "classId" UUID,
    CONSTRAINT "chapters_pkey" PRIMARY KEY ("id")
  );

  CREATE TABLE "long_questions" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "question_text" VARCHAR NOT NULL,
    "createdAt" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "chapterId" UUID,
    "bookId" UUID,
    "classId" UUID,
    CONSTRAINT "long_questions_pkey" PRIMARY KEY ("id")
  );

  CREATE TABLE "short_questions" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "question_text" VARCHAR NOT NULL,
    "createdAt" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "chapterId" UUID,
    "bookId" UUID,
    "classId" UUID,
    CONSTRAINT "short_questions_pkey" PRIMARY KEY ("id")
  );

  CREATE TABLE "mcq_questions" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "question_text" VARCHAR NOT NULL,
    "options" JSON NOT NULL,
    "createdAt" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "chapterId" UUID,
    "bookId" UUID,
    "classId" UUID,
    CONSTRAINT "mcq_questions_pkey" PRIMARY KEY ("id")
  );

  ALTER TABLE "user" ADD CONSTRAINT "user_roleId_fkey"
    FOREIGN KEY ("roleId") REFERENCES "user_role"("id") ON DELETE CASCADE ON UPDATE CASCADE;
  ALTER TABLE "books" ADD CONSTRAINT "books_classId_fkey"
    FOREIGN KEY ("classId") REFERENCES "classes"("id") ON DELETE CASCADE ON UPDATE CASCADE;
  ALTER TABLE "chapters" ADD CONSTRAINT "chapters_bookId_fkey"
    FOREIGN KEY ("bookId") REFERENCES "books"("id") ON DELETE CASCADE ON UPDATE CASCADE;
  ALTER TABLE "chapters" ADD CONSTRAINT "chapters_classId_fkey"
    FOREIGN KEY ("classId") REFERENCES "classes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

  ALTER TABLE "long_questions" ADD CONSTRAINT "long_questions_chapterId_fkey"
    FOREIGN KEY ("chapterId") REFERENCES "chapters"("id") ON DELETE CASCADE ON UPDATE CASCADE;
  ALTER TABLE "long_questions" ADD CONSTRAINT "long_questions_bookId_fkey"
    FOREIGN KEY ("bookId") REFERENCES "books"("id") ON DELETE CASCADE ON UPDATE CASCADE;
  ALTER TABLE "long_questions" ADD CONSTRAINT "long_questions_classId_fkey"
    FOREIGN KEY ("classId") REFERENCES "classes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

  ALTER TABLE "short_questions" ADD CONSTRAINT "short_questions_chapterId_fkey"
    FOREIGN KEY ("chapterId") REFERENCES "chapters"("id") ON DELETE CASCADE ON UPDATE CASCADE;
  ALTER TABLE "short_questions" ADD CONSTRAINT "short_questions_bookId_fkey"
    FOREIGN KEY ("bookId") REFERENCES "books"("id") ON DELETE CASCADE ON UPDATE CASCADE;
  ALTER TABLE "short_questions" ADD CONSTRAINT "short_questions_classId_fkey"
    FOREIGN KEY ("classId") REFERENCES "classes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

  ALTER TABLE "mcq_questions" ADD CONSTRAINT "mcq_questions_chapterId_fkey"
    FOREIGN KEY ("chapterId") REFERENCES "chapters"("id") ON DELETE CASCADE ON UPDATE CASCADE;
  ALTER TABLE "mcq_questions" ADD CONSTRAINT "mcq_questions_bookId_fkey"
    FOREIGN KEY ("bookId") REFERENCES "books"("id") ON DELETE CASCADE ON UPDATE CASCADE;
  ALTER TABLE "mcq_questions" ADD CONSTRAINT "mcq_questions_classId_fkey"
    FOREIGN KEY ("classId") REFERENCES "classes"("id") ON DELETE CASCADE ON UPDATE CASCADE;
END
$baseline$;
