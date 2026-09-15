-- Add bilingual Urdu columns (English columns remain primary)
ALTER TABLE "classes" ADD COLUMN IF NOT EXISTS "nameUr" VARCHAR(255);
ALTER TABLE "classes" ADD COLUMN IF NOT EXISTS "descriptionUr" TEXT;

ALTER TABLE "books" ADD COLUMN IF NOT EXISTS "bookNameUr" VARCHAR(255);
ALTER TABLE "books" ADD COLUMN IF NOT EXISTS "descriptionUr" TEXT;

ALTER TABLE "chapters" ADD COLUMN IF NOT EXISTS "chapterNameUr" VARCHAR(255);
ALTER TABLE "chapters" ADD COLUMN IF NOT EXISTS "descriptionUr" TEXT;

ALTER TABLE "long_questions" ADD COLUMN IF NOT EXISTS "questionTextUr" TEXT;
ALTER TABLE "short_questions" ADD COLUMN IF NOT EXISTS "questionTextUr" TEXT;
ALTER TABLE "mcq_questions" ADD COLUMN IF NOT EXISTS "questionTextUr" TEXT;

-- Widen question text columns for longer bilingual content
ALTER TABLE "long_questions" ALTER COLUMN "question_text" TYPE TEXT;
ALTER TABLE "short_questions" ALTER COLUMN "question_text" TYPE TEXT;
ALTER TABLE "mcq_questions" ALTER COLUMN "question_text" TYPE TEXT;

-- Migrate MCQ options from string[] to { en, ur }[]
UPDATE "mcq_questions"
SET "options" = (
  SELECT COALESCE(
    jsonb_agg(
      jsonb_build_object(
        'en',
        CASE
          WHEN jsonb_typeof(elem) = 'string' THEN elem #>> '{}'
          WHEN jsonb_typeof(elem) = 'object' AND elem ? 'en' THEN elem ->> 'en'
          ELSE ''
        END,
        'ur',
        CASE
          WHEN jsonb_typeof(elem) = 'object' AND elem ? 'ur' THEN COALESCE(elem ->> 'ur', '')
          ELSE ''
        END
      )
      ORDER BY ord
    ),
    '[]'::jsonb
  )
  FROM jsonb_array_elements(
    CASE
      WHEN jsonb_typeof("options"::jsonb) = 'array' THEN "options"::jsonb
      ELSE '[]'::jsonb
    END
  ) WITH ORDINALITY AS t(elem, ord)
)
WHERE jsonb_typeof("options"::jsonb) = 'array';
