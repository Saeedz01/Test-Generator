-- Unique role names (merge duplicates first so the index can be created safely)
UPDATE "user" u
  SET "roleId" = keep.id
  FROM "user_role" dup
  JOIN LATERAL (
    SELECT r.id FROM "user_role" r
    WHERE r."role_name" = dup."role_name"
    ORDER BY r.id::text
    LIMIT 1
  ) keep ON true
  WHERE u."roleId" = dup.id
    AND dup.id <> keep.id;

DELETE FROM "user_role" a
  USING "user_role" b
  WHERE a."role_name" = b."role_name"
    AND a.id::text > b.id::text;

CREATE UNIQUE INDEX "user_role_role_name_key" ON "user_role"("role_name");

-- Foreign-key lookup indexes
CREATE INDEX "books_classId_idx" ON "books"("classId");
CREATE INDEX "chapters_bookId_idx" ON "chapters"("bookId");

-- Persistent brute-force counters for login OTP and password-reset codes
ALTER TABLE "user" ADD COLUMN "otpFailedAttempts" INTEGER NOT NULL DEFAULT 0;
ALTER TABLE "user" ADD COLUMN "otpLockedUntil" TIMESTAMPTZ(6);
ALTER TABLE "user" ADD COLUMN "resetOtpAttempts" INTEGER NOT NULL DEFAULT 0;

-- Per-session refresh tokens replace the single refresh-token slot per user.
-- Dropping the old column signs everyone out once after deploy.
ALTER TABLE "user" DROP COLUMN IF EXISTS "refreshTokenHash";

CREATE TABLE "auth_sessions" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "userId" UUID NOT NULL,
    "tokenHash" VARCHAR(64) NOT NULL,
    "previousTokenHash" VARCHAR(64),
    "previousRotatedAt" TIMESTAMPTZ(6),
    "expiresAt" TIMESTAMPTZ(6) NOT NULL,
    "revokedAt" TIMESTAMPTZ(6),
    "revokedReason" VARCHAR(50),
    "userAgent" VARCHAR(255),
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lastUsedAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "auth_sessions_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "auth_sessions_userId_idx" ON "auth_sessions"("userId");

ALTER TABLE "auth_sessions" ADD CONSTRAINT "auth_sessions_userId_fkey"
  FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;
