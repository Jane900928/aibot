# DeepSeek AI 聊天界面

基于 React + GraphQL + Cloudflare Worker 的 AI 聊天应用

## 功能特性

- 🤖 集成 DeepSeek AI API
- ⚡ React + Next.js 前端
- 🔗 GraphQL API
- ☁️ Cloudflare Worker 后端
- 💬 实时聊天界面
- 🎨 现代化 UI 设计

## 快速开始

### 前端开发

```bash
npm install
npm run dev
```

### Cloudflare Worker 部署

```bash
# 设置 DeepSeek API 密钥
wrangler secret put DEEPSEEK_API_KEY

# 本地开发
npm run worker:dev

# 部署到 Cloudflare
npm run worker:deploy
```

## 环境配置

1. 获取 DeepSeek API 密钥
2. 配置 Cloudflare Worker 环境变量
3. 更新 `next.config.js` 中的 Worker URL

## 技术栈

- **前端**: React, Next.js, TypeScript, Tailwind CSS
- **API**: GraphQL, Apollo Client
- **后端**: Cloudflare Worker
- **AI**: DeepSeek API
