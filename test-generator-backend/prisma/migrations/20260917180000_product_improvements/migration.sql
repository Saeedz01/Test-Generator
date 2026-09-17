-- Archive support for classes
ALTER TABLE "classes" ADD COLUMN IF NOT EXISTS "isArchived" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "classes" ADD COLUMN IF NOT EXISTS "archivedAt" TIMESTAMP(6);

-- Book timestamp naming
ALTER TABLE "books" RENAME COLUMN "created_At" TO "createdAt";
ALTER TABLE "books" RENAME COLUMN "updated_At" TO "updatedAt";

-- Separate password-reset OTP from login OTP
ALTER TABLE "user" ADD COLUMN IF NOT EXISTS "resetOtp" VARCHAR(255);
ALTER TABLE "user" ADD COLUMN IF NOT EXISTS "resetOtpExpiresAt" TIMESTAMPTZ(6);

-- Marks + difficulty on questions
DO $$ BEGIN
  CREATE TYPE "QuestionDifficulty" AS ENUM ('easy', 'medium', 'hard');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

ALTER TABLE "long_questions" ADD COLUMN IF NOT EXISTS "marks" INTEGER NOT NULL DEFAULT 5;
ALTER TABLE "long_questions" ADD COLUMN IF NOT EXISTS "difficulty" "QuestionDifficulty" NOT NULL DEFAULT 'medium';
ALTER TABLE "short_questions" ADD COLUMN IF NOT EXISTS "marks" INTEGER NOT NULL DEFAULT 2;
ALTER TABLE "short_questions" ADD COLUMN IF NOT EXISTS "difficulty" "QuestionDifficulty" NOT NULL DEFAULT 'medium';
ALTER TABLE "mcq_questions" ADD COLUMN IF NOT EXISTS "marks" INTEGER NOT NULL DEFAULT 1;
ALTER TABLE "mcq_questions" ADD COLUMN IF NOT EXISTS "difficulty" "QuestionDifficulty" NOT NULL DEFAULT 'medium';

-- Per-chapter uniqueness (dedupe existing conflicts by keeping earliest row)
DELETE FROM "long_questions" a
  USING "long_questions" b
  WHERE a."chapterId" = b."chapterId"
    AND a."question_text" = b."question_text"
    AND a."createdAt" > b."createdAt";
DELETE FROM "short_questions" a
  USING "short_questions" b
  WHERE a."chapterId" = b."chapterId"
    AND a."question_text" = b."question_text"
    AND a."createdAt" > b."createdAt";
DELETE FROM "mcq_questions" a
  USING "mcq_questions" b
  WHERE a."chapterId" = b."chapterId"
    AND a."question_text" = b."question_text"
    AND a."createdAt" > b."createdAt";

CREATE UNIQUE INDEX IF NOT EXISTS "long_questions_chapterId_question_text_key"
  ON "long_questions"("chapterId", "question_text");
CREATE UNIQUE INDEX IF NOT EXISTS "short_questions_chapterId_question_text_key"
  ON "short_questions"("chapterId", "question_text");
CREATE UNIQUE INDEX IF NOT EXISTS "mcq_questions_chapterId_question_text_key"
  ON "mcq_questions"("chapterId", "question_text");
