# 修复静态导出问题 - 部署指南

## ✅ 问题解决

之前遇到的 `"rewrites" cannot be used with "output: export"` 错误已经修复。

### 🔧 解决方案

1. **移除了 rewrites 配置** - 静态导出模式不支持 rewrites
2. **直接配置 API 端点** - 在 Apollo Client 中直接使用 Worker URL
3. **使用环境变量** - 通过环境变量配置 GraphQL 端点

## 🚀 现在的部署步骤

### 第一步：部署 Cloudflare Worker

```bash
# 克隆并进入项目
git clone https://github.com/Jane900928/aibot.git
cd aibot
npm install

# 安装 Wrangler
npm install -g wrangler

# 登录 Cloudflare
wrangler login

# 设置 DeepSeek API 密钥
wrangler secret put DEEPSEEK_API_KEY

# 部署 Worker
npm run worker:deploy
```

### 第二步：记录 Worker URL

部署成功后，记住输出的 URL，例如：
```
https://deepseek-ai-worker.your-subdomain.workers.dev
```

### 第三步：部署到 Cloudflare Pages

#### 方法一：通过 Cloudflare Dashboard

1. 登录 [Cloudflare Dashboard](https://dash.cloudflare.com/)
2. 点击 **Pages** → **Create a project** → **Connect to Git**
3. 选择 `Jane900928/aibot` 仓库
4. 配置构建设置：

```
Framework preset: Next.js
Build command: npm run build
Build output directory: dist
Root directory: (留空)
```

5. **重要：设置环境变量**
```
NODE_VERSION = 18
NEXT_PUBLIC_GRAPHQL_ENDPOINT = https://your-actual-worker-url.workers.dev/graphql
```

6. 点击 **Save and Deploy**

#### 方法二：本地配置环境变量

如果你想在本地测试，创建 `.env.local` 文件：

```bash
# 复制环境变量模板
cp .env.example .env.local

# 编辑 .env.local，设置你的 Worker URL
NEXT_PUBLIC_GRAPHQL_ENDPOINT=https://your-worker-url.workers.dev/graphql
```

### 第四步：本地测试

```bash
# 本地开发
npm run dev

# 本地构建测试
npm run build
npx serve dist
```

## 🎯 关键配置文件

### next.config.js
```javascript
const nextConfig = {
  output: 'export', // 静态导出
  distDir: 'dist',
  images: {
    unoptimized: true
  }
  // 不再使用 rewrites
};
```

### apollo-wrapper.tsx
```javascript
const GRAPHQL_ENDPOINT = process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT || 
  'https://deepseek-ai-worker.konglin928.workers.dev/graphql'
```

## 📋 Cloudflare Pages 构建配置

在 Cloudflare Pages 中的确切配置：

- **Build command**: `npm run build`
- **Build output directory**: `dist`
- **Root directory**: `/` 或留空
- **Environment variables**: 
  - `NODE_VERSION = 18`
  - `NEXT_PUBLIC_GRAPHQL_ENDPOINT = https://你的worker地址.workers.dev/graphql`

## ✅ 验证部署

1. 确保 Worker 正常工作：访问 `https://your-worker.workers.dev/health`
2. 前端应用能正常加载
3. 聊天功能正常工作

## 🔧 常见问题

### Q: 构建仍然失败？
A: 确保：
- 移除了所有 rewrites 配置
- 设置了正确的环境变量
- Worker URL 格式正确

### Q: API 请求失败？
A: 检查：
- Worker 是否成功部署
- 环境变量 `NEXT_PUBLIC_GRAPHQL_ENDPOINT` 是否正确设置
- Worker 的 CORS 配置

### Q: 本地开发如何配置？
A: 创建 `.env.local` 文件并设置 Worker URL

现在你可以成功部署到 Cloudflare Pages 了！🎉
