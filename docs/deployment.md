# 部署指南

本指南将帮助您部署 DeepSeek AI 聊天应用。

## 前置要求

1. Node.js 18+ 
2. Cloudflare 账户
3. DeepSeek API 密钥

## 部署步骤

### 1. 克隆仓库

```bash
git clone https://github.com/Jane900928/aibot.git
cd aibot
```

### 2. 安装依赖

```bash
npm install
```

### 3. 配置环境变量

复制环境变量示例文件：
```bash
cp .env.example .env.local
```

### 4. 部署 Cloudflare Worker

首先，安装 Wrangler CLI：
```bash
npm install -g wrangler
```

登录 Cloudflare：
```bash
wrangler login
```

设置 DeepSeek API 密钥：
```bash
wrangler secret put DEEPSEEK_API_KEY
# 输入您的 DeepSeek API 密钥
```

部署 Worker：
```bash
npm run worker:deploy
```

### 5. 更新前端配置

部署完成后，更新 `next.config.js` 中的 Worker URL：

```javascript
async rewrites() {
  return [
    {
      source: '/api/graphql',
      destination: 'https://YOUR_WORKER_NAME.YOUR_SUBDOMAIN.workers.dev/graphql',
    },
  ];
},
```

### 6. 部署前端

您可以选择以下平台之一部署前端：

#### Vercel (推荐)
```bash
npm install -g vercel
vercel --prod
```

#### Netlify
```bash
npm run build
# 上传 .next 目录到 Netlify
```

### 7. 获取 DeepSeek API 密钥

1. 访问 [DeepSeek 官网](https://platform.deepseek.com/)
2. 注册账户并创建 API 密钥
3. 将密钥添加到 Cloudflare Worker

## 本地开发

### 启动本地开发服务器

```bash
# 启动前端开发服务器
npm run dev

# 在另一个终端启动 Worker 开发服务器
npm run worker:dev
```

访问 http://localhost:3000 查看应用。

## 故障排除

### Worker 部署失败
- 检查 `wrangler.toml` 配置
- 确保已设置 API 密钥
- 检查 Cloudflare 账户权限

### GraphQL 请求失败
- 检查 Worker URL 配置
- 验证 CORS 设置
- 查看浏览器开发者工具的网络选项卡

### API 调用失败
- 验证 DeepSeek API 密钥
- 检查 API 调用频率限制
- 查看 Worker 日志：`wrangler tail`

## 监控和日志

查看 Worker 实时日志：
```bash
wrangler tail
```

在 Cloudflare 仪表板中查看详细分析和日志。
