/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  // CDN 配置
  assetPrefix: process.env.CDN_URL || '',

  // 图片优化配置
  images: {
    domains: [
      'images.unsplash.com',
      'localhost',
      'avatars.githubusercontent.com',
      'api.dicebear.com',
      'www.refactoringui.com',
      'lh3.googleusercontent.com'
    ],
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60 * 60 * 24 * 30, // 30天
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
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
      },
      // CDN 域名
      {
        protocol: 'https',
        hostname: 'cdn.hxzy.life',
        pathname: '/**',
      }
    ],
  },

  // 压缩配置
  compress: true,

  // 实验性功能
  experimental: {
    scrollRestoration: true,
    optimizeCss: true,
    optimizePackageImports: ['antd', 'lodash'],
  },

  // 构建优化（swcMinify 在 Next.js 13+ 中默认启用，无需显式设置）

  // 缓存配置
  onDemandEntries: {
    maxInactiveAge: 25 * 1000,
    pagesBufferLength: 2,
  },

  // 静态文件缓存
  async headers() {
    return [
      {
        source: '/uploads/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        source: '/_next/static/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        source: '/_next/image',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ];
  },
}

module.exports = nextConfig