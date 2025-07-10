/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['images.unsplash.com', 'localhost', 'avatars.githubusercontent.com', 'api.dicebear.com', 'www.refactoringui.com','lh3.googleusercontent.com'],
    formats: ['image/avif', 'image/webp'],
    // 允许本地上传的图片
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '3000',
        pathname: '/uploads/**',
      },
      {
        protocol: 'https',
        hostname: '**',
        pathname: '/uploads/**',
      }
    ],
  },
  experimental: {
    scrollRestoration: true,
  },
}

module.exports = nextConfig 