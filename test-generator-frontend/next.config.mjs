/** @type {import('next').NextConfig} */
const nextConfig = {
  reactCompiler: true,
  async redirects() {
    return [
      {
        source:
          "/classes/:classId/books/:bookId/chapters/:chapterId/questions",
        destination:
          "/classes/:classId/books/:bookId/chapters/:chapterId",
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
