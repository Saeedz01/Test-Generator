-- Drop redundant denormalized FKs.
-- Chapters belong to a book (class is derived via book.classId).
-- Questions belong to a chapter (book/class are derived via chapter.book).

-- Chapters: remove classId; require bookId
DELETE FROM "chapters" WHERE "bookId" IS NULL;
ALTER TABLE "chapters" DROP CONSTRAINT IF EXISTS "chapters_classId_fkey";
ALTER TABLE "chapters" DROP COLUMN IF EXISTS "classId";
ALTER TABLE "chapters" ALTER COLUMN "bookId" SET NOT NULL;

-- Long questions: keep chapterId only
DELETE FROM "long_questions" WHERE "chapterId" IS NULL;
ALTER TABLE "long_questions" DROP CONSTRAINT IF EXISTS "long_questions_classId_fkey";
ALTER TABLE "long_questions" DROP CONSTRAINT IF EXISTS "long_questions_bookId_fkey";
ALTER TABLE "long_questions" DROP COLUMN IF EXISTS "classId";
ALTER TABLE "long_questions" DROP COLUMN IF EXISTS "bookId";
ALTER TABLE "long_questions" ALTER COLUMN "chapterId" SET NOT NULL;

-- Short questions: keep chapterId only
DELETE FROM "short_questions" WHERE "chapterId" IS NULL;
ALTER TABLE "short_questions" DROP CONSTRAINT IF EXISTS "short_questions_classId_fkey";
ALTER TABLE "short_questions" DROP CONSTRAINT IF EXISTS "short_questions_bookId_fkey";
ALTER TABLE "short_questions" DROP COLUMN IF EXISTS "classId";
ALTER TABLE "short_questions" DROP COLUMN IF EXISTS "bookId";
ALTER TABLE "short_questions" ALTER COLUMN "chapterId" SET NOT NULL;

-- MCQ questions: keep chapterId only
DELETE FROM "mcq_questions" WHERE "chapterId" IS NULL;
ALTER TABLE "mcq_questions" DROP CONSTRAINT IF EXISTS "mcq_questions_classId_fkey";
ALTER TABLE "mcq_questions" DROP CONSTRAINT IF EXISTS "mcq_questions_bookId_fkey";
ALTER TABLE "mcq_questions" DROP COLUMN IF EXISTS "classId";
ALTER TABLE "mcq_questions" DROP COLUMN IF EXISTS "bookId";
ALTER TABLE "mcq_questions" ALTER COLUMN "chapterId" SET NOT NULL;
