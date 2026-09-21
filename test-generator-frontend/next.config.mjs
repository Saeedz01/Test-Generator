import { readFileSync } from "node:fs";
import withPWAInit from "@ducanh2912/next-pwa";
import { PHASE_PRODUCTION_BUILD } from "next/constants.js";

/** @type {import('next').NextConfig} */
const isProduction = process.env.NODE_ENV === "production";

const LOCAL_HOSTS = new Set(["localhost", "127.0.0.1", "[::1]"]);

/**
 * Production builds must not silently fall back to localhost: the public
 * URLs are inlined into the bundle, so a missing or wrong value would ship a
 * broken site (API calls, CSP, canonical URLs, sitemap). Fail the build with
 * a clear message instead. http:// is only accepted for localhost (local
 * production builds); real deployments must use https://.
 */
function validatePublicUrls() {
  const errors = [];
  const check = (name, { originOnly }) => {
    const raw = process.env[name]?.trim();
    if (!raw) {
      errors.push(`${name} is required for production builds.`);
      return;
    }
    let url;
    try {
      url = new URL(raw);
    } catch {
      errors.push(`${name} must be an absolute URL (got "${raw}").`);
      return;
    }
    if (url.protocol !== "https:" && url.protocol !== "http:") {
      errors.push(`${name} must use https:// (got "${raw}").`);
    } else if (url.protocol === "http:" && !LOCAL_HOSTS.has(url.hostname)) {
      errors.push(`${name} must use https:// outside localhost (got "${raw}").`);
    }
    if (url.search || url.hash) {
      errors.push(`${name} must not contain a query string or #fragment.`);
    }
    if (originOnly && url.pathname.replace(/\/+$/, "") !== "") {
      errors.push(`${name} must be a bare origin such as https://testora.example.com.`);
    }
  };
  check("NEXT_PUBLIC_API_URL", { originOnly: false });
  check("NEXT_PUBLIC_SITE_URL", { originOnly: true });
  if (errors.length) {
    throw new Error(
      `Invalid build configuration:\n  - ${errors.join("\n  - ")}\nSee README.md → Environment variables.`,
    );
  }
}

/**
 * Version of the PDF engine; appended to the wasm URL so a package upgrade
 * gets a new cache entry instead of a stale CacheFirst copy.
 */
function pdfEngineVersion() {
  try {
    const pkg = JSON.parse(
      readFileSync(
        new URL("./node_modules/@imggion/html2realpdf/package.json", import.meta.url),
        "utf8",
      ),
    );
    return String(pkg.version || "0");
  } catch {
    return "0";
  }
}

/**
 * Optional same-origin API proxy (server-side env, read at build time).
 * When set, `/api/*` on this app is rewritten to `${API_PROXY_TARGET}/api/*`,
 * so NEXT_PUBLIC_API_URL can point at the frontend's own origin and the
 * backend's SameSite=Lax auth cookies become first-party. See README.
 */
const API_PROXY_TARGET = process.env.API_PROXY_TARGET?.replace(/\/$/, "") || "";

/** Origin of a configured URL, with the same dev defaults as src/constants/site.js. */
function originOf(value, devFallback) {
  try {
    return new URL(value || (isProduction ? "" : devFallback)).origin;
  } catch {
    return "";
  }
}

/** Origin the browser calls for the API. */
const API_ORIGIN = originOf(process.env.NEXT_PUBLIC_API_URL, "http://localhost:5000");
/** This site's own origin. */
const SITE_ORIGIN = originOf(process.env.NEXT_PUBLIC_SITE_URL, "http://localhost:3000");

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/**
 * Service-worker runtime caching, checked before next-pwa's defaults
 * (first match wins). Handlers must stay closure-free: Workbox serializes
 * them into public/sw.js.
 */
const runtimeCaching = [
  // API responses (question bank, auth) must never land in Cache Storage:
  // same-origin /api/* (proxy mode) and anything on a separate API origin.
  {
    urlPattern: ({ url }) => url.pathname.startsWith("/api/"),
    handler: "NetworkOnly",
  },
  // Only when the API has its own origin. In proxy mode the API origin *is*
  // this site, and a catch-all rule here would stop every page, font and
  // PDF-engine request from being cached (first matching rule wins).
  ...(API_ORIGIN && API_ORIGIN !== SITE_ORIGIN
    ? [
        {
          urlPattern: new RegExp(`^${escapeRegExp(API_ORIGIN)}/`),
          handler: "NetworkOnly",
        },
      ]
    : []),
  // PDF engine (~8.5 MB): not precached; cached on first use so papers can
  // later be generated offline. The URL carries ?v=<engine version>, and one
  // entry is kept, so an upgrade replaces (not duplicates) the cached copy.
  {
    urlPattern: /\/libhtml2realpdf\.wasm(?:\?.*)?$/i,
    handler: "CacheFirst",
    options: {
      cacheName: "pdf-engine",
      expiration: { maxEntries: 1, maxAgeSeconds: 30 * 24 * 60 * 60 },
    },
  },
  {
    urlPattern: /\/fonts\/.+\.(?:ttf|otf|woff2?)$/i,
    handler: "CacheFirst",
    options: {
      cacheName: "paper-fonts",
      expiration: { maxEntries: 8, maxAgeSeconds: 30 * 24 * 60 * 60 },
    },
  },
];

const withPWA = withPWAInit({
  dest: "public",
  disable: process.env.NODE_ENV === "development",
  register: true,
  fallbacks: {
    document: "/offline",
  },
  // Keep first-visit precache small: the 8.5 MB PDF engine, Urdu fonts, and
  // banner photos load on demand (runtime-cached above / by defaults).
  publicExcludes: [
    "!noprecache/**/*",
    "!libhtml2realpdf.wasm",
    "!fonts/**/*",
    "!images/banner/**/*",
  ],
  extendDefaultRuntimeCaching: true,
  workboxOptions: {
    disableDevLogs: true,
    runtimeCaching,
    // next-pwa defaults + never precache wasm emitted under /_next/static.
    exclude: [
      /\/_next\/static\/.*(?<!\.p)\.woff2/,
      /\.map$/,
      /^manifest.*\.js$/,
      /\.wasm$/,
    ],
  },
});

/**
 * Content-Security-Policy. `script-src` keeps 'unsafe-inline' because Next's
 * inline bootstrap scripts and the theme boot script (themeBootScript.js) are
 * inline and this app is statically rendered (no per-request nonce).
 * 'wasm-unsafe-eval' is required to compile the PDF engine's WebAssembly.
 */
const contentSecurityPolicy = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline' 'wasm-unsafe-eval'${isProduction ? "" : " 'unsafe-eval'"}`,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob:",
  "font-src 'self' data:",
  `connect-src 'self' data: blob:${API_ORIGIN ? ` ${API_ORIGIN}` : ""}`,
  "frame-src 'self' blob:",
  "worker-src 'self' blob:",
  "manifest-src 'self'",
  "media-src 'self' data: blob:",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
].join("; ");

const securityHeaders = [
  { key: "Content-Security-Policy", value: contentSecurityPolicy },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=()",
  },
  ...(isProduction
    ? [
        {
          key: "Strict-Transport-Security",
          value: "max-age=15552000; includeSubDomains",
        },
      ]
    : []),
];

const nextConfig = {
  env: {
    NEXT_PUBLIC_PDF_ENGINE_VERSION: pdfEngineVersion(),
  },
  reactCompiler: true,
  poweredByHeader: false,
  transpilePackages: ["@imggion/html2realpdf"],
  webpack: (config) => {
    config.experiments = {
      ...config.experiments,
      asyncWebAssembly: true,
    };
    // The PDF engine is always loaded from /libhtml2realpdf.wasm (public/,
    // copied on postinstall). Don't also emit the package's default
    // `new URL("./libhtml2realpdf.wasm", import.meta.url)` copy (8.5 MB).
    config.module.rules.push({
      test: /[\\/]@imggion[\\/]html2realpdf[\\/]dist[\\/]libhtml2realpdf\.wasm$/,
      type: "asset/resource",
      generator: { emit: false },
    });
    return config;
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: securityHeaders,
      },
    ];
  },
  async rewrites() {
    if (!API_PROXY_TARGET) return [];
    return [
      {
        source: "/api/:path*",
        destination: `${API_PROXY_TARGET}/api/:path*`,
      },
    ];
  },
  async redirects() {
    return [
      {
        source:
          "/classes/:classId/books/:bookId/chapters/:chapterId/questions",
        destination: "/classes/:classId/books/:bookId/chapters/:chapterId",
        permanent: false,
      },
    ];
  },
};

export default function config(phase, context) {
  if (phase === PHASE_PRODUCTION_BUILD) {
    validatePublicUrls();
  }
  const resolved = withPWA(nextConfig);
  return typeof resolved === "function" ? resolved(phase, context) : resolved;
}
