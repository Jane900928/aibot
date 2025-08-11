/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export', // 静态导出，适配 Cloudflare Pages
  trailingSlash: true,
  skipTrailingSlashRedirect: true,
  distDir: 'dist', // 输出目录
  images: {
    unoptimized: true // 禁用图片优化以支持静态导出
  },
  async rewrites() {
    return [
      {
        source: '/api/graphql',
        destination: 'https://deepseek-ai-worker.konglin928.workers.dev/graphql', // 替换为你的 Worker URL
      },
    ];
  },
};

module.exports = nextConfig;
