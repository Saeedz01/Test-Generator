import withPWAInit from "@ducanh2912/next-pwa";

/** @type {import('next').NextConfig} */
const isProduction = process.env.NODE_ENV === "production";

const withPWA = withPWAInit({
  dest: "public",
  disable: process.env.NODE_ENV === "development",
  register: true,
  fallbacks: {
    document: "/",
  },
  workboxOptions: {
    disableDevLogs: true,
  },
});

const securityHeaders = [
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
  async headers() {
    return [
      {
        source: "/:path*",
        headers: securityHeaders,
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
