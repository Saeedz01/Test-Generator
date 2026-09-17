-- Bilingual storage is questions-only; drop Urdu columns from curriculum entities.
ALTER TABLE "classes" DROP COLUMN IF EXISTS "nameUr";
ALTER TABLE "classes" DROP COLUMN IF EXISTS "descriptionUr";

ALTER TABLE "books" DROP COLUMN IF EXISTS "bookNameUr";
ALTER TABLE "books" DROP COLUMN IF EXISTS "descriptionUr";

ALTER TABLE "chapters" DROP COLUMN IF EXISTS "chapterNameUr";
ALTER TABLE "chapters" DROP COLUMN IF EXISTS "descriptionUr";
