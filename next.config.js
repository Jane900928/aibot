/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export', // 静态导出，适配 Cloudflare Pages
  trailingSlash: true,
  skipTrailingSlashRedirect: true,
  distDir: 'dist', // 输出目录
  images: {
    unoptimized: true // 禁用图片优化以支持静态导出
  }
  // 移除 rewrites，因为静态导出不支持
  // 改为在前端直接配置 API 端点
};

module.exports = nextConfig;
