# AGENTS.md — Strict Instructions for AI Coding Agents

These rules are mandatory for every change in `test-generator-backend`.

## Stack

- NestJS
- TypeScript
- Prisma + PostgreSQL
- Config via `.env` (`ConfigModule`)

## Preserve Commented Code

When editing any file, **do not remove existing commented-out code** unless the user explicitly asks.

- Keep `//`, `/* */`, and `#` blocks that contain disabled code or notes
- Do not delete comments as part of cleanup, refactoring, or "code quality" passes
- Only remove commented code when the user clearly requests it
- If removal seems necessary, ask first

This rule also lives in `.cursor/rules/preserve-commented-code.mdc` (`alwaysApply: true`).

## Code Quality (without deleting comments)

- Remove unused imports and unused variables when safe
- Do not treat commented-out code as dead code to delete automatically
- Prefer minimal, focused diffs
- Match existing module and NestJS conventions in surrounding files

## Environment & Config

- Database and app settings come from `.env`
- Do not commit secrets
- Do not hardcode credentials in source when env vars exist

## Modifying Architecture

- Do not rename or break existing API contracts unless the user asks
- Preserve working auth, guards, decorators, and module wiring when making localized changes
