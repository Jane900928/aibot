# DeepSeek AI 聊天界面

基于 React + GraphQL + Cloudflare Worker 的 AI 聊天应用

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![React](https://img.shields.io/badge/React-18.2.0-blue.svg)
![Next.js](https://img.shields.io/badge/Next.js-13.4.19-black.svg)
![TypeScript](https://img.shields.io/badge/TypeScript-5.1.6-blue.svg)

## 🌟 功能特性

- 🤖 **智能对话**: 集成 DeepSeek AI API，提供高质量的 AI 对话体验
- ⚡ **现代技术栈**: React + Next.js + TypeScript + Tailwind CSS
- 🔗 **GraphQL API**: 使用 GraphQL 进行数据查询和变更
- ☁️ **无服务器架构**: Cloudflare Worker 提供高性能后端服务
- 💬 **实时聊天**: 流畅的聊天界面，支持消息历史记录
- 🎨 **响应式设计**: 适配桌面和移动设备
- 🚀 **快速部署**: 一键部署到 Vercel 或 Netlify

## 🚀 快速开始

### 前置要求

- Node.js 18+
- Cloudflare 账户
- DeepSeek API 密钥

### 安装

```bash
# 克隆仓库
git clone https://github.com/Jane900928/aibot.git
cd aibot

# 安装依赖
npm install

# 复制环境变量
cp .env.example .env.local
```

### 本地开发

```bash
# 启动前端开发服务器
npm run dev

# 在另一个终端启动 Worker 开发服务器  
npm run worker:dev
```

访问 [http://localhost:3000](http://localhost:3000) 查看应用。

## 📦 部署

### 1. 部署 Cloudflare Worker

```bash
# 安装 Wrangler CLI
npm install -g wrangler

# 登录 Cloudflare
wrangler login

# 设置 DeepSeek API 密钥
wrangler secret put DEEPSEEK_API_KEY

# 部署 Worker
npm run worker:deploy
```

### 2. 部署前端

#### 使用 Vercel（推荐）

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/Jane900928/aibot)

#### 手动部署

```bash
npm run build
npm start
```

详细部署指南请查看 [部署文档](docs/deployment.md)。

## 🏗️ 项目结构

```
aibot/
├── app/                    # Next.js App Router
│   ├── components/         # React 组件
│   ├── globals.css        # 全局样式
│   ├── layout.tsx         # 根布局
│   └── page.tsx           # 主页面
├── worker/                # Cloudflare Worker
│   └── src/
│       └── index.js       # Worker 入口文件
├── docs/                  # 文档
├── public/                # 静态资源
├── package.json           # 项目配置
├── next.config.js         # Next.js 配置
├── tailwind.config.js     # Tailwind CSS 配置
├── tsconfig.json          # TypeScript 配置
└── wrangler.toml          # Cloudflare Worker 配置
```

## 🔧 配置

### 环境变量

创建 `.env.local` 文件：

```env
# Cloudflare Worker GraphQL 端点
NEXT_PUBLIC_GRAPHQL_ENDPOINT=https://your-worker.your-subdomain.workers.dev/graphql
```

### Cloudflare Worker 配置

在 `wrangler.toml` 中配置 Worker：

```toml
name = "deepseek-ai-worker"
main = "worker/src/index.js"
compatibility_date = "2023-08-01"

[vars]
DEEPSEEK_API_URL = "https://api.deepseek.com"
```

## 📚 API 文档

### GraphQL Schema

```graphql
type Mutation {
  sendMessage(input: MessageInput!): ChatResponse!
}

input MessageInput {
  message: String!
  conversationId: String
}

type ChatResponse {
  id: String!
  message: String!
  timestamp: String!
  conversationId: String!
}
```

更多 API 文档请查看 [GraphQL 文档](docs/graphql.md)。

## 🎨 技术栈

### 前端
- **React 18** - 用户界面库
- **Next.js 13** - React 框架，支持 App Router
- **TypeScript** - 类型安全的 JavaScript
- **Tailwind CSS** - 实用优先的 CSS 框架
- **Apollo Client** - GraphQL 客户端

### 后端
- **Cloudflare Worker** - 无服务器运行时
- **GraphQL** - API 查询语言
- **DeepSeek API** - AI 对话服务

### 开发工具
- **ESLint** - 代码检查
- **Wrangler** - Cloudflare Worker CLI

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

1. Fork 项目
2. 创建功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 打开 Pull Request

## 📄 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情。

## 🙏 致谢

- [DeepSeek](https://www.deepseek.com/) - 提供强大的 AI API
- [Cloudflare](https://workers.cloudflare.com/) - 无服务器计算平台
- [Next.js](https://nextjs.org/) - React 框架
- [Tailwind CSS](https://tailwindcss.com/) - CSS 框架

## 📞 联系方式

如有问题或建议，请通过以下方式联系：

- 提交 [Issue](https://github.com/Jane900928/aibot/issues)
- 发送邮件至：konglin928@gmail.com

---

⭐ 如果这个项目对您有帮助，请给它一个星标！
