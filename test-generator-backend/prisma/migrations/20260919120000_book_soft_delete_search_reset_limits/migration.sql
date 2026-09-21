-- Trigram indexes back the library search (ILIKE '%term%'). pg_trgm is a
-- trusted extension (PostgreSQL 13+): the database owner can create it.
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- Soft delete for books: admin "delete" hides the book instead of cascading
-- to its chapters and questions.
ALTER TABLE "books" ADD COLUMN "deletedAt" TIMESTAMP(6);

-- Per-account password-reset limits (not tied to the client IP).
ALTER TABLE "user" ADD COLUMN "resetFailedCount" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN "resetLastSentAt" TIMESTAMPTZ(6),
ADD COLUMN "resetRequestCount" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN "resetWindowStartedAt" TIMESTAMPTZ(6);

-- One book name per class. Normalise surrounding whitespace first, then
-- rename (never delete) any existing duplicates so the unique index can be
-- built without losing chapters or questions: the oldest copy keeps its name,
-- later copies become "Name (duplicate 2)", "Name (duplicate 3)", ...
UPDATE "books"
  SET "book_name" = btrim("book_name")
  WHERE "book_name" <> btrim("book_name");

WITH ranked AS (
  SELECT id,
         ROW_NUMBER() OVER (
           PARTITION BY "classId", "book_name"
           ORDER BY "createdAt", id
         ) AS rn
  FROM "books"
  WHERE "classId" IS NOT NULL
)
UPDATE "books" b
  SET "book_name" = LEFT(b."book_name", 230) || ' (duplicate ' || r.rn || ')'
  FROM ranked r
  WHERE b.id = r.id
    AND r.rn > 1;

CREATE UNIQUE INDEX "books_classId_book_name_key" ON "books"("classId", "book_name");

-- Search indexes
CREATE INDEX "books_book_name_trgm_idx" ON "books" USING GIN ("book_name" gin_trgm_ops);
CREATE INDEX "chapters_chapter_name_trgm_idx" ON "chapters" USING GIN ("chapter_name" gin_trgm_ops);
CREATE INDEX "long_questions_question_text_trgm_idx" ON "long_questions" USING GIN ("question_text" gin_trgm_ops);
CREATE INDEX "long_questions_question_text_ur_trgm_idx" ON "long_questions" USING GIN ("questionTextUr" gin_trgm_ops);
CREATE INDEX "short_questions_question_text_trgm_idx" ON "short_questions" USING GIN ("question_text" gin_trgm_ops);
CREATE INDEX "short_questions_question_text_ur_trgm_idx" ON "short_questions" USING GIN ("questionTextUr" gin_trgm_ops);
CREATE INDEX "mcq_questions_question_text_trgm_idx" ON "mcq_questions" USING GIN ("question_text" gin_trgm_ops);
CREATE INDEX "mcq_questions_question_text_ur_trgm_idx" ON "mcq_questions" USING GIN ("questionTextUr" gin_trgm_ops);
