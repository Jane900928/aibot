# Tailwind CSS 颜色修复指南

## 🐛 问题描述

在部署时遇到了 Tailwind CSS 错误：
```
The `border-primary-200` class does not exist. If `border-primary-200` is a custom class, make sure it is defined within a @layer directive.
```

## ✅ 解决方案

### 1. 更新 Tailwind 配置

已在 `tailwind.config.js` 中添加了完整的 primary 颜色配置：

```javascript
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a',
        },
      },
    },
  },
}
```

### 2. 替换为标准颜色

为了更好的兼容性，我们将所有 `primary-*` 颜色类替换为标准的 `blue-*` 颜色类：

#### 修改的文件：

**app/globals.css**:
- `primary-600` → `blue-600`
- `primary-700` → `blue-700`
- `primary-800` → `blue-800`
- `primary-200` → `blue-200`
- `primary-400` → `blue-400`
- `primary-500` → `blue-500`
- `primary-50` → `blue-50`

**app/components/ChatInterface.tsx**:
- `bg-primary-600` → `bg-blue-600`
- `bg-primary-700` → `bg-blue-700`
- `hover:bg-primary-800` → `hover:bg-blue-800`
- `focus:ring-primary-500` → `focus:ring-blue-500`
- `focus:border-primary-500` → `focus:border-blue-500`

**app/components/MarkdownRenderer.tsx**:
- `border-primary-400` → `border-blue-400`
- `bg-primary-50` → `bg-blue-50`
- `text-primary-700` → `text-blue-700`
- `border-primary-200` → `border-blue-200`

### 3. 颜色映射对照表

| 原颜色类 | 新颜色类 | 用途 |
|---------|---------|------|
| `primary-50` | `blue-50` | 浅色背景 |
| `primary-100` | `blue-100` | 很浅的背景 |
| `primary-200` | `blue-200` | 边框、分隔线 |
| `primary-400` | `blue-400` | 强调边框 |
| `primary-500` | `blue-500` | 焦点环 |
| `primary-600` | `blue-600` | 主要按钮背景 |
| `primary-700` | `blue-700` | 按钮悬停状态 |
| `primary-800` | `blue-800` | 按钮激活状态 |

### 4. 验证修复

所有颜色类现在都使用 Tailwind CSS 的标准蓝色调色板，确保：
- ✅ 构建时不会出现 CSS 类不存在的错误
- ✅ 保持了原有的视觉设计
- ✅ 具有更好的浏览器兼容性
- ✅ 遵循 Tailwind CSS 最佳实践

### 5. 如果需要自定义颜色

如果以后想要使用自定义的品牌颜色，建议：

1. **定义自定义颜色**：
```javascript
// tailwind.config.js
colors: {
  brand: {
    50: '#your-color-50',
    // ... 完整的颜色梯度
    900: '#your-color-900',
  }
}
```

2. **使用 CSS 变量**：
```css
:root {
  --color-primary: #3b82f6;
  --color-primary-hover: #2563eb;
}
```

3. **通过 @layer 指令定义**：
```css
@layer utilities {
  .bg-brand-primary {
    background-color: var(--color-primary);
  }
}
```

## 🎯 结果

现在项目使用标准的 Tailwind CSS 蓝色调色板，确保了：
- 构建成功
- 样式一致性
- 更好的维护性
- 开发者友好性

所有 Markdown 格式化功能保持完整，包括代码高亮、表格、链接等特殊样式都正常工作。
