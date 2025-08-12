'use client'

import MarkdownRenderer from './MarkdownRenderer'

export default function MarkdownDemo() {
  const demoContent = `# DeepSeek AI Markdown 支持演示

## 文本格式化

这是一个 **粗体文本** 和 *斜体文本* 的演示。你也可以使用 __粗体__ 和 _斜体_ 的替代语法。

你可以使用 ~~删除线~~ 文本和 ==高亮文本==。

## 链接支持演示

AI 现在可以智能识别各种类型的网址：

### 标准 HTTP/HTTPS 链接
https://www.deepseek.com - DeepSeek 官网
https://github.com/Jane900928/aibot - 项目仓库
https://docs.anthropic.com/claude/docs - 文档链接

### www 开头的链接
www.google.com - 搜索引擎
www.github.com - GitHub 首页

### 普通域名
openai.com - OpenAI 官网
stackoverflow.com - 开发者社区
medium.com - 博客平台

### Markdown 链接语法
[DeepSeek 官网](https://www.deepseek.com) - 带描述的链接
[GitHub 项目](https://github.com/Jane900928/aibot) - 项目地址

### 邮箱地址
contact@deepseek.com - 联系邮箱
support@example.com - 技术支持

## 代码支持

这是行内代码：\`console.log('Hello World')\`

这是代码块：

\`\`\`javascript
function fibonacci(n) {
  if (n <= 1) return n;
  return fibonacci(n - 1) + fibonacci(n - 2);
}

console.log(fibonacci(10)); // 输出: 55
\`\`\`

\`\`\`python
def hello_world():
    print("Hello, DeepSeek AI!")
    return "Success"

hello_world()
\`\`\`

## 列表

### 无序列表
- 第一项
- 第二项
  - 嵌套项目
  - 另一个嵌套项目
- 第三项

### 有序列表
1. 首先做这个
2. 然后做那个
3. 最后做这个

### 任务列表
- [x] 已完成的任务
- [ ] 未完成的任务
- [x] 另一个已完成的任务

## 引用

> 这是一个引用块的例子。DeepSeek AI 可以帮助你处理各种任务，从编程到写作，再到数据分析。
> 
> 引用中的链接也会被识别：https://www.deepseek.com

## 表格

| 功能 | 支持状态 | 说明 |
|------|----------|------|
| 文本格式化 | ✅ | 支持粗体、斜体等 |
| 代码高亮 | ✅ | 支持多种编程语言 |
| 表格 | ✅ | 支持表格渲染 |
| 数学公式 | ✅ | 支持 LaTeX 格式 |
| **自动链接** | ✅ | **智能识别各种URL格式** |

## 数学公式

行内数学：$E = mc^2$

块级数学：
$$\\int_{-\\infty}^{\\infty} e^{-x^2} dx = \\sqrt{\\pi}$$

## 特殊元素

键盘快捷键：按 <kbd>Ctrl</kbd> + <kbd>C</kbd> 复制

分隔线：

---

## Emoji 支持

DeepSeek AI 支持 emoji：🚀 ✨ 🤖 💻 📊 🎯

数字标记：①②③④⑤

## 混合内容示例

在这段文本中，我们可以看到各种元素的组合：

**重要提示**：访问 https://platform.deepseek.com 注册账户，查看 *API 文档* 了解更多信息。你也可以通过邮箱 api-support@deepseek.com 联系技术支持。

代码示例：\`fetch('https://api.deepseek.com/v1/chat')\`

相关资源：
- 官方网站：www.deepseek.com
- GitHub：github.com/deepseek-ai
- 文档：docs.deepseek.com

## 小贴士

💡 **提示**：现在 AI 返回的任何网址都会自动变成可点击的链接，支持：
- 🔗 完整 URL (https://...)
- 🌐 www 开头的地址
- 🌍 普通域名格式
- 📧 邮箱地址
- 外部链接图标和悬停效果
`

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Markdown 渲染演示</h2>
        <p className="text-gray-600">DeepSeek AI 返回的消息将自动渲染以下格式，包括智能链接识别：</p>
      </div>
      
      <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
        <MarkdownRenderer content={demoContent} />
      </div>
      
      <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <h3 className="text-lg font-semibold text-blue-800 mb-2">支持的格式总结</h3>
        <ul className="text-sm text-blue-700 space-y-1">
          <li>✅ 标题 (# ## ###)</li>
          <li>✅ 粗体 (**text**) 和斜体 (*text*)</li>
          <li>✅ 行内代码 (`code`) 和代码块 (```)</li>
          <li>✅ 链接 ([text](url)) 和自动链接</li>
          <li>✅ **智能URL识别** (https://, www., 域名, 邮箱)</li>
          <li>✅ 列表 (有序、无序、任务列表)</li>
          <li>✅ 引用块 (&gt; text)</li>
          <li>✅ 表格 (| col1 | col2 |)</li>
          <li>✅ 删除线 (~~text~~) 和高亮 (==text==)</li>
          <li>✅ 数学公式 ($formula$ 和 $$block$$)</li>
          <li>✅ 键盘按键 (&lt;kbd&gt;key&lt;/kbd&gt;)</li>
          <li>✅ Emoji 和特殊符号</li>
        </ul>
      </div>

      <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
        <h3 className="text-lg font-semibold text-green-800 mb-2">🔗 链接功能特色</h3>
        <ul className="text-sm text-green-700 space-y-1">
          <li>🔗 自动检测 https:// 和 http:// 链接</li>
          <li>🌐 识别 www. 开头的网址</li>
          <li>🌍 智能识别普通域名 (如 google.com)</li>
          <li>📧 自动识别邮箱地址</li>
          <li>✨ 美观的链接样式和悬停效果</li>
          <li>🎯 外部链接图标指示</li>
          <li>🛡️ 安全的 target="_blank" 和 rel="noopener noreferrer"</li>
          <li>🎨 不同类型链接使用不同图标</li>
        </ul>
      </div>
    </div>
  )
}
