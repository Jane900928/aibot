# Cloudflare Pages 部署指南

本指南将详细说明如何将 DeepSeek AI 聊天界面部署到 Cloudflare Pages。

## 🚀 部署步骤

### 第一步：部署 Cloudflare Worker (后端 API)

1. **克隆项目并安装依赖**
```bash
git clone https://github.com/Jane900928/aibot.git
cd aibot
npm install
```

2. **安装 Wrangler CLI**
```bash
npm install -g wrangler
```

3. **登录 Cloudflare**
```bash
wrangler login
```

4. **获取 DeepSeek API 密钥**
   - 访问 [DeepSeek Platform](https://platform.deepseek.com/)
   - 注册账户并创建 API 密钥

5. **设置环境变量**
```bash
wrangler secret put DEEPSEEK_API_KEY
# 输入你的 DeepSeek API 密钥
```

6. **部署 Worker**
```bash
npm run worker:deploy
```

7. **记录 Worker URL**
部署成功后，记住输出的 Worker URL，类似：
```
https://deepseek-ai-worker.your-subdomain.workers.dev
```

### 第二步：更新前端配置

**重要：在部署前端之前，需要更新 Worker URL**

编辑 `next.config.js` 文件，将 `your-subdomain` 替换为你的实际 Worker URL：

```javascript
async rewrites() {
  return [
    {
      source: '/api/graphql',
      destination: 'https://deepseek-ai-worker.YOUR_ACTUAL_SUBDOMAIN.workers.dev/graphql', // 替换这里
    },
  ];
},
```

### 第三步：部署到 Cloudflare Pages

#### 方法一：通过 Cloudflare Dashboard (推荐)

1. **登录 Cloudflare Dashboard**
   - 访问 [Cloudflare Dashboard](https://dash.cloudflare.com/)
   - 选择你的账户

2. **创建 Pages 项目**
   - 点击左侧菜单 **Pages**
   - 点击 **Create a project**
   - 选择 **Connect to Git**

3. **连接 GitHub 仓库**
   - 授权 Cloudflare 访问你的 GitHub
   - 选择 `Jane900928/aibot` 仓库
   - 点击 **Begin setup**

4. **配置构建设置**
```
Project name: aibot-chat (或你喜欢的名称)
Production branch: main
Framework preset: Next.js
Build command: npm run build
Build output directory: dist
Root directory: / (留空)
```

5. **设置环境变量**
点击 **Environment variables**，添加：
```
NODE_VERSION = 18
NEXT_PUBLIC_API_URL = https://your-worker-url.workers.dev
```

6. **部署**
   - 点击 **Save and Deploy**
   - 等待构建完成（通常需要 2-5 分钟）

#### 方法二：使用 Wrangler CLI

1. **安装 Pages CLI**
```bash
npm install -g @cloudflare/wrangler
```

2. **构建项目**
```bash
npm run build
```

3. **部署**
```bash
wrangler pages deploy dist --project-name=aibot-chat
```

### 第四步：验证部署

1. **访问网站**
   - 部署完成后，Cloudflare 会提供一个 URL
   - 类似：`https://aibot-chat.pages.dev`

2. **测试功能**
   - 打开聊天界面
   - 发送一条测试消息
   - 确认 AI 正确回复

## 🔧 常见问题和解决方案

### 构建失败

**问题**: Next.js 构建失败
**解决方案**:
```bash
# 确保使用正确的 Node.js 版本
node --version  # 应该是 18.x

# 清理缓存
rm -rf .next node_modules package-lock.json
npm install
npm run build
```

### API 请求失败

**问题**: 前端无法连接到 Worker API
**解决方案**:
1. 检查 `next.config.js` 中的 Worker URL 是否正确
2. 确认 Worker 已成功部署
3. 检查 CORS 设置

### Worker 部署失败

**问题**: `wrangler deploy` 命令失败
**解决方案**:
```bash
# 检查登录状态
wrangler whoami

# 重新登录
wrangler logout
wrangler login

# 检查 wrangler.toml 配置
```

## 📋 部署清单

- [ ] 部署 Cloudflare Worker
- [ ] 记录 Worker URL
- [ ] 更新 `next.config.js` 中的 Worker URL
- [ ] 推送代码到 GitHub
- [ ] 在 Cloudflare Pages 中连接仓库
- [ ] 配置构建设置
- [ ] 设置环境变量
- [ ] 执行部署
- [ ] 测试功能

## 🎉 部署完成

恭喜！你的 DeepSeek AI 聊天界面现在已经在 Cloudflare Pages 上运行了。

**访问地址**: `https://your-project-name.pages.dev`

## 📝 后续维护

- **更新代码**: 推送到 GitHub main 分支会自动触发重新部署
- **监控**: 在 Cloudflare Dashboard 中查看访问统计和错误日志
- **域名**: 可以在 Pages 设置中绑定自定义域名

如有问题，请查看 [Cloudflare Pages 文档](https://developers.cloudflare.com/pages/) 或提交 Issue。
