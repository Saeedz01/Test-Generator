-- Runs before 20260917180000_product_improvements.
--
-- That migration dedupes (chapterId, question_text) by keeping the row with the
-- earliest "createdAt", but rows sharing the exact same "createdAt" (e.g. bulk
-- inserts) survive and the following CREATE UNIQUE INDEX fails. It has already
-- been applied to existing databases, so it is not edited here (that would
-- change its checksum). Instead this migration removes such duplicates first,
-- keeping the earliest row and breaking ties by id.
--
-- On databases that already applied 20260917180000 the unique indexes exist,
-- so there are no duplicates and every statement below deletes nothing.

DELETE FROM "long_questions" a
  USING "long_questions" b
  WHERE a."chapterId" = b."chapterId"
    AND a."question_text" = b."question_text"
    AND (a."createdAt", a."id"::text) > (b."createdAt", b."id"::text);

DELETE FROM "short_questions" a
  USING "short_questions" b
  WHERE a."chapterId" = b."chapterId"
    AND a."question_text" = b."question_text"
    AND (a."createdAt", a."id"::text) > (b."createdAt", b."id"::text);

DELETE FROM "mcq_questions" a
  USING "mcq_questions" b
  WHERE a."chapterId" = b."chapterId"
    AND a."question_text" = b."question_text"
    AND (a."createdAt", a."id"::text) > (b."createdAt", b."id"::text);
