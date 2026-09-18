-- Bring databases whose tables were originally created by TypeORM in line with
-- schema.prisma (Prisma-style constraint names, JSONB options) and change
-- user.roleId to ON DELETE RESTRICT (deleting a role must never delete users).
-- Every step is catalog-driven, so it is also correct (and mostly a no-op) on
-- databases built from 0_init.

DO $reconcile$
DECLARE
  t TEXT;
  c RECORD;
  spec RECORD;
BEGIN
  -- Primary keys: <table>_pkey
  FOREACH t IN ARRAY ARRAY['user_role', 'user', 'classes', 'books', 'chapters',
                           'long_questions', 'short_questions', 'mcq_questions']
  LOOP
    FOR c IN
      SELECT conname FROM pg_constraint
      WHERE conrelid = format('public.%I', t)::regclass
        AND contype = 'p'
        AND conname <> t || '_pkey'
    LOOP
      EXECUTE format('ALTER TABLE %I RENAME CONSTRAINT %I TO %I', t, c.conname, t || '_pkey');
    END LOOP;
  END LOOP;

  -- Single-column unique constraints: replace with Prisma-named unique indexes
  FOR spec IN
    SELECT * FROM (VALUES ('classes', 'name'), ('classes', 'code'), ('user', 'email'))
      AS v(tbl, col)
  LOOP
    FOR c IN
      SELECT con.conname
      FROM pg_constraint con
      JOIN pg_attribute att
        ON att.attrelid = con.conrelid AND att.attnum = ANY (con.conkey)
      WHERE con.conrelid = format('public.%I', spec.tbl)::regclass
        AND con.contype = 'u'
        AND array_length(con.conkey, 1) = 1
        AND att.attname = spec.col
    LOOP
      EXECUTE format('ALTER TABLE %I DROP CONSTRAINT %I', spec.tbl, c.conname);
    END LOOP;
    EXECUTE format('CREATE UNIQUE INDEX IF NOT EXISTS %I ON %I (%I)',
                   spec.tbl || '_' || spec.col || '_key', spec.tbl, spec.col);
  END LOOP;

  -- Foreign keys: drop whatever exists on the column, recreate with Prisma names
  FOR spec IN
    SELECT * FROM (VALUES
      ('user', 'roleId', 'user_role', 'RESTRICT'),
      ('books', 'classId', 'classes', 'CASCADE'),
      ('chapters', 'bookId', 'books', 'CASCADE'),
      ('long_questions', 'chapterId', 'chapters', 'CASCADE'),
      ('short_questions', 'chapterId', 'chapters', 'CASCADE'),
      ('mcq_questions', 'chapterId', 'chapters', 'CASCADE')
    ) AS v(tbl, col, ref, on_delete)
  LOOP
    FOR c IN
      SELECT con.conname
      FROM pg_constraint con
      JOIN pg_attribute att
        ON att.attrelid = con.conrelid AND att.attnum = ANY (con.conkey)
      WHERE con.conrelid = format('public.%I', spec.tbl)::regclass
        AND con.contype = 'f'
        AND att.attname = spec.col
    LOOP
      EXECUTE format('ALTER TABLE %I DROP CONSTRAINT %I', spec.tbl, c.conname);
    END LOOP;
    EXECUTE format(
      'ALTER TABLE %I ADD CONSTRAINT %I FOREIGN KEY (%I) REFERENCES %I("id") ON DELETE %s ON UPDATE CASCADE',
      spec.tbl, spec.tbl || '_' || spec.col || '_fkey', spec.col, spec.ref, spec.on_delete);
  END LOOP;
END
$reconcile$;

-- Prisma's Json maps to JSONB
ALTER TABLE "mcq_questions" ALTER COLUMN "options" SET DATA TYPE JSONB USING "options"::jsonb;
