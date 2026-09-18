<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg" alt="Donate us"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow" alt="Follow us on Twitter"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

## Testora backend — operations guide

### Environment

Copy `.env.example` to `.env`. Configuration is validated at boot
(`src/config/env.validation.ts`); the app refuses to start and lists every
problem if something is missing or unsafe. Highlights:

- `JWT_ACCESS_SECRET` / `JWT_REFRESH_SECRET` are required everywhere, must be
  at least 32 characters and different from each other. Generate each with
  `openssl rand -hex 32`. Production also rejects human-chosen values.
- `CORS_ORIGINS` is required in production.
- `MAIL_ENABLED` must be `true` in production (OTP login and password reset
  are email based); `MAIL_HOST`, `MAIL_USER`, `MAIL_PASSWORD`, `MAIL_FROM` are
  then required. With mail disabled in development the login OTP is printed to
  the server log (never in production).
- `NODE_ENV` must be `development`, `production` or `test`.

### Build and run

```bash
npm ci
npm run build              # prisma generate && nest build -> dist/main.js
npm run migrate:deploy     # prisma migrate deploy
npm run start:prod         # node dist/main
```

The `prisma` CLI is a runtime dependency so `npm run migrate:deploy` works in a
production image installed with `npm ci --omit=dev`.

### Database migrations

`prisma migrate deploy` builds the full schema on an empty database: the
`0_init` baseline creates the tables that originally came from TypeORM, and
the later migrations apply on top.

**Existing databases** (created before `0_init` existed, e.g. a developer DB
or production) must record the baseline as applied once, without running it:

```bash
npx prisma migrate resolve --applied 0_init
npx prisma migrate deploy
```

(`0_init` is also guarded — if the `user` table already exists it does
nothing — so an accidental deploy without `resolve` is harmless.)
`20260918120000_reconcile_legacy_constraints` renames the legacy TypeORM
constraint names to Prisma's conventions, so afterwards
`npx prisma migrate diff --from-url "$DATABASE_URL" --to-schema-datamodel prisma/schema.prisma`
reports no drift.

`20260918120100_auth_sessions_and_hardening` replaces the single refresh-token
column with the `auth_sessions` table, so every user is signed out once when
it is deployed.

### Seeding

- `npm run prisma:seed` — seeds sample curriculum only if there is none yet.
- `npm run prisma:seed:reset` — **wipes all classes/books/chapters/questions**
  and reseeds (development).
- With `NODE_ENV=production` the seed refuses to run unless
  `SEED_ALLOW_DESTRUCTIVE=true` (or `--force`) is set.
- `AUTH_SEED=true` (development only) creates the seed super admin / admin
  accounts from `AUTH_SEED_*` if they do not exist. It never changes existing
  accounts. Seed passwords must be at least 12 characters.

### Auth sessions

Each login creates a row in `auth_sessions` (one per device). The refresh
token rotates on every `POST /api/auth/refresh`; the previous token stays valid
for 30 seconds (concurrent tabs), after which presenting it is treated as token
theft and revokes that session. Logout revokes the current session (works with
an expired access token). Password reset/change and suspension revoke all of
the user's sessions, and access tokens are rejected as soon as their session
is revoked.

### Deployment notes

- **Cookies / domains.** Auth uses `httpOnly` cookies with `SameSite=lax` by
  default, so the browser must see the API as *same-site* with the frontend:
  - Recommended: proxy the API through the frontend (Next.js rewrite of
    `/api/*` to this backend) and point `NEXT_PUBLIC_API_URL` at the frontend
    origin. Cookies are then first-party; leave `COOKIE_DOMAIN` empty. The
    browser's `Origin` is the frontend origin, so it must be listed in
    `CORS_ORIGINS` (the CSRF origin check uses that list).
  - Or host both on the same registrable domain (e.g. `app.example.com` and
    `api.example.com`) and set `COOKIE_DOMAIN=example.com` if the frontend
    needs to send the cookies to the API host.
  - `COOKIE_SAMESITE=none` (fully cross-site) is supported but not
    recommended; third-party-cookie blocking will break it in many browsers.
- The refresh cookie is scoped to `/api/auth` (only sent to refresh/logout).
- **Reverse proxy.** Set `TRUST_PROXY` to the number of proxies in front of
  the API (default 1), or `false` if it is exposed directly.
- **Rate limiting** uses an in-memory store (per process). With several
  instances the effective limit is multiplied by the instance count; use a
  shared store (e.g. `@nest-lab/throttler-storage-redis`) or rate-limit at the
  proxy if that matters. The global default is `THROTTLE_LIMIT`/min per IP
  (300); auth endpoints have stricter fixed limits.
- **Compression / access logs** are expected to be handled by the reverse
  proxy (nginx, load balancer, platform router).
- The API accepts JSON bodies only (no urlencoded form posts).

## Project setup

```bash
$ npm install
```

## Compile and run the project

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Run tests

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Deployment

When you're ready to deploy your NestJS application to production, there are some key steps you can take to ensure it runs as efficiently as possible. Check out the [deployment documentation](https://docs.nestjs.com/deployment) for more information.

If you are looking for a cloud-based platform to deploy your NestJS application, check out [Mau](https://mau.nestjs.com), our official platform for deploying NestJS applications on AWS. Mau makes deployment straightforward and fast, requiring just a few simple steps:

```bash
$ npm install -g @nestjs/mau
$ mau deploy
```

With Mau, you can deploy your application in just a few clicks, allowing you to focus on building features rather than managing infrastructure.

## Resources

Check out a few resources that may come in handy when working with NestJS:

- Visit the [NestJS Documentation](https://docs.nestjs.com) to learn more about the framework.
- For questions and support, please visit our [Discord channel](https://discord.gg/G7Qnnhy).
- To dive deeper and get more hands-on experience, check out our official video [courses](https://courses.nestjs.com/).
- Deploy your application to AWS with the help of [NestJS Mau](https://mau.nestjs.com) in just a few clicks.
- Visualize your application graph and interact with the NestJS application in real-time using [NestJS Devtools](https://devtools.nestjs.com).
- Need help with your project (part-time to full-time)? Check out our official [enterprise support](https://enterprise.nestjs.com).
- To stay in the loop and get updates, follow us on [X](https://x.com/nestframework) and [LinkedIn](https://linkedin.com/company/nestjs).
- Looking for a job, or have a job to offer? Check out our official [Jobs board](https://jobs.nestjs.com).

## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## Stay in touch

- Author - [Kamil Myśliwiec](https://twitter.com/kammysliwiec)
- Website - [https://nestjs.com](https://nestjs.com/)
- Twitter - [@nestframework](https://twitter.com/nestframework)

## License

Nest is [MIT licensed](https://github.com/nestjs/nest/blob/master/LICENSE).
