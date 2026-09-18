import withPWAInit from "@ducanh2912/next-pwa";

/** @type {import('next').NextConfig} */
const isProduction = process.env.NODE_ENV === "production";

/**
 * Optional same-origin API proxy (server-side env, read at build time).
 * When set, `/api/*` on this app is rewritten to `${API_PROXY_TARGET}/api/*`,
 * so NEXT_PUBLIC_API_URL can point at the frontend's own origin and the
 * backend's SameSite=Lax auth cookies become first-party. See README.
 */
const API_PROXY_TARGET = process.env.API_PROXY_TARGET?.replace(/\/$/, "") || "";

/** Origin the browser calls for the API (same default as src/services). */
function apiOrigin() {
  try {
    return new URL(process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000")
      .origin;
  } catch {
    return "";
  }
}

const API_ORIGIN = apiOrigin();

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/**
 * Service-worker runtime caching, checked before next-pwa's defaults
 * (first match wins). Handlers must stay closure-free: Workbox serializes
 * them into public/sw.js.
 */
const runtimeCaching = [
  // Authenticated API responses must never land in Cache Storage:
  // same-origin /api/* (proxy mode) and anything on the API origin.
  {
    urlPattern: ({ url }) => url.pathname.startsWith("/api/"),
    handler: "NetworkOnly",
  },
  ...(API_ORIGIN
    ? [
        {
          urlPattern: new RegExp(`^${escapeRegExp(API_ORIGIN)}/`),
          handler: "NetworkOnly",
        },
      ]
    : []),
  // Large PDF-engine assets: not precached; cached after first real use.
  {
    urlPattern: /\/libhtml2realpdf\.wasm$/i,
    handler: "CacheFirst",
    options: {
      cacheName: "pdf-engine",
      expiration: { maxEntries: 2, maxAgeSeconds: 30 * 24 * 60 * 60 },
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

export default withPWA(nextConfig);
