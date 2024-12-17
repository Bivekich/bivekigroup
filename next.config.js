/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone', // Оптимизирует сборку для Docker
  poweredByHeader: false, // Убирает заголовок X-Powered-By
  reactStrictMode: true,
  swcMinify: true,
};

module.exports = nextConfig;
