'use client'

import React from 'react'

interface MarkdownRendererProps {
  content: string
  className?: string
}

export default function MarkdownRenderer({ content, className = '' }: MarkdownRendererProps) {
  // 处理 Markdown 格式的函数
  const renderMarkdown = (text: string) => {
    let processedText = text

    // 处理代码块 ```language
    processedText = processedText.replace(
      /```(\w+)?\n?([\s\S]*?)```/g,
      (match, language, code) => {
        const lang = language || 'text'
        return `<div class="code-block relative bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto my-3 border-l-4 border-blue-500" data-lang="${lang}">
          <div class="absolute top-2 right-2 text-xs text-gray-400 bg-gray-800 px-2 py-1 rounded">${lang}</div>
          <pre><code class="text-sm leading-relaxed">${code.trim()}</code></pre>
        </div>`
      }
    )

    // 处理行内代码 `code` (在处理链接之前)
    processedText = processedText.replace(
      /`([^`]+)`/g,
      '<code class="bg-gray-100 text-gray-800 px-1.5 py-0.5 rounded text-sm font-mono">$1</code>'
    )

    // 处理表格
    processedText = processedText.replace(
      /\|(.+)\|\n\|[-\s|:]+\|\n((?:\|.+\|\n?)+)/g,
      (match, header, rows) => {
        const headerCells = header.split('|').filter((cell: string) => cell.trim()).map((cell: string) => 
          `<th class="px-3 py-2 text-left font-semibold text-gray-900 bg-gray-50 border border-gray-300">${cell.trim()}</th>`
        ).join('')
        
        const bodyRows = rows.trim().split('\n').map((row: string) => {
          const cells = row.split('|').filter((cell: string) => cell.trim()).map((cell: string) => 
            `<td class="px-3 py-2 text-gray-700 border border-gray-300">${cell.trim()}</td>`
          ).join('')
          return `<tr>${cells}</tr>`
        }).join('')
        
        return `<div class="table-container overflow-x-auto my-4">
          <table class="min-w-full border-collapse border border-gray-300">
            <thead><tr>${headerCells}</tr></thead>
            <tbody>${bodyRows}</tbody>
          </table>
        </div>`
      }
    )

    // 处理引用块 > text
    processedText = processedText.replace(
      /^> (.*)$/gm,
      '<blockquote class="border-l-4 border-blue-400 pl-4 py-2 my-3 bg-blue-50 italic text-gray-700 rounded-r">$1</blockquote>'
    )

    // 处理标题 ### ## #
    processedText = processedText.replace(
      /^### (.*$)/gm,
      '<h3 class="text-lg font-bold mb-2 mt-4 text-gray-700">$1</h3>'
    )
    processedText = processedText.replace(
      /^## (.*$)/gm,
      '<h2 class="text-xl font-bold mb-3 mt-5 text-gray-800 border-b border-gray-200 pb-1">$1</h2>'
    )
    processedText = processedText.replace(
      /^# (.*$)/gm,
      '<h1 class="text-2xl font-bold mb-4 mt-6 text-gray-900 border-b-2 border-blue-200 pb-2">$1</h1>'
    )

    // 处理 Markdown 链接 [text](url) (在处理自动链接之前)
    processedText = processedText.replace(
      /\[([^\]]+)\]\(([^)]+)\)/g,
      '<a href="$2" class="inline-flex items-center text-blue-600 hover:text-blue-800 underline decoration-2 underline-offset-2 transition-colors group" target="_blank" rel="noopener noreferrer">$1<svg class="w-3 h-3 ml-1 opacity-60 group-hover:opacity-100 transition-opacity" fill="currentColor" viewBox="0 0 20 20"><path d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z"></path><path d="M5 5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-1a1 1 0 10-2 0v1H5V7h1a1 1 0 000-2H5z"></path></svg></a>'
    )

    // 增强的自动链接检测 - 支持更多URL格式和域名
    // 检测 HTTP/HTTPS 链接
    processedText = processedText.replace(
      /(?<![\w"])(https?:\/\/(?:[-\w.])+(?:\:[0-9]+)?(?:\/(?:[\w\/_.])*)?(?:\?(?:[\w&=%._-])*)?(?:\#(?:[\w._-])*)?)/gi,
      '<a href="$1" class="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium underline decoration-2 underline-offset-2 transition-all duration-200 hover:bg-blue-50 px-1 py-0.5 rounded group" target="_blank" rel="noopener noreferrer">🔗 $1<svg class="w-3 h-3 ml-1 opacity-60 group-hover:opacity-100 transition-opacity" fill="currentColor" viewBox="0 0 20 20"><path d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z"></path><path d="M5 5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-1a1 1 0 10-2 0v1H5V7h1a1 1 0 000-2H5z"></path></svg></a>'
    )

    // 检测 www 开头的链接
    processedText = processedText.replace(
      /(?<![\w"])(www\.(?:[-\w.])+(?:\:[0-9]+)?(?:\/(?:[\w\/_.])*)?(?:\?(?:[\w&=%._-])*)?(?:\#(?:[\w._-])*)?)/gi,
      '<a href="https://$1" class="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium underline decoration-2 underline-offset-2 transition-all duration-200 hover:bg-blue-50 px-1 py-0.5 rounded group" target="_blank" rel="noopener noreferrer">🌐 $1<svg class="w-3 h-3 ml-1 opacity-60 group-hover:opacity-100 transition-opacity" fill="currentColor" viewBox="0 0 20 20"><path d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z"></path><path d="M5 5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-1a1 1 0 10-2 0v1H5V7h1a1 1 0 000-2H5z"></path></svg></a>'
    )

    // 检测常见的域名格式（不带协议前缀）
    processedText = processedText.replace(
      /(?<![\w".])\b([a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,}(?:\/(?:[\w\/_.])*)?(?:\?(?:[\w&=%._-])*)?(?:\#(?:[\w._-])*)?(?![a-zA-Z0-9.])/g,
      (match) => {
        // 排除一些常见的非URL文本（如文件扩展名、版本号等）
        if (match.match(/^\d+\.\d+/) || match.match(/\.(txt|doc|pdf|jpg|png)$/i)) {
          return match
        }
        return `<a href="https://${match}" class="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium underline decoration-2 underline-offset-2 transition-all duration-200 hover:bg-blue-50 px-1 py-0.5 rounded group" target="_blank" rel="noopener noreferrer">🌍 ${match}<svg class="w-3 h-3 ml-1 opacity-60 group-hover:opacity-100 transition-opacity" fill="currentColor" viewBox="0 0 20 20"><path d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z"></path><path d="M5 5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-1a1 1 0 10-2 0v1H5V7h1a1 1 0 000-2H5z"></path></svg></a>`
      }
    )

    // 检测邮箱地址
    processedText = processedText.replace(
      /(?<![\w"])\b([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})\b/g,
      '<a href="mailto:$1" class="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium underline decoration-2 underline-offset-2 transition-all duration-200 hover:bg-blue-50 px-1 py-0.5 rounded">📧 $1</a>'
    )

    // 处理粗体 **text** 或 __text__
    processedText = processedText.replace(
      /\*\*(.*?)\*\*/g,
      '<strong class="font-bold text-blue-700 bg-blue-50 px-1 py-0.5 rounded">$1</strong>'
    )
    processedText = processedText.replace(
      /__(.*?)__/g,
      '<strong class="font-bold text-blue-700 bg-blue-50 px-1 py-0.5 rounded">$1</strong>'
    )

    // 处理斜体 *text* 或 _text_ (避免与列表符号冲突)
    processedText = processedText.replace(
      /(?<![\*\s])\*([^*\s][^*]*[^*\s]|\S)\*(?![\*\s])/g,
      '<em class="italic text-gray-700 bg-gray-100 px-1 py-0.5 rounded">$1</em>'
    )

    // 处理无序列表 - 或 *
    processedText = processedText.replace(
      /^[-*] (.*)$/gm,
      '<li class="text-gray-700 leading-relaxed ml-4 mb-1">• $1</li>'
    )

    // 处理有序列表 1. 2. 3.
    processedText = processedText.replace(
      /^(\d+)\. (.*)$/gm,
      '<li class="text-gray-700 leading-relaxed ml-4 mb-1">$1. $2</li>'
    )

    // 处理删除线 ~~text~~
    processedText = processedText.replace(
      /~~(.*?)~~/g,
      '<del class="line-through text-gray-500">$1</del>'
    )

    // 处理高亮 ==text==
    processedText = processedText.replace(
      /==(.*?)==/g,
      '<mark class="bg-yellow-200 px-1 rounded">$1</mark>'
    )

    // 处理分隔线 ---
    processedText = processedText.replace(
      /^---$/gm,
      '<hr class="my-6 border-t-2 border-gray-200">'
    )

    // 处理数学公式 $$...$$
    processedText = processedText.replace(
      /\$\$(.*?)\$\$/g,
      '<div class="math-block bg-gray-50 p-3 rounded-lg my-3 text-center font-mono text-sm">$1</div>'
    )

    // 处理行内数学 $...$
    processedText = processedText.replace(
      /\$([^$]+)\$/g,
      '<span class="math-inline bg-gray-100 px-1 rounded font-mono text-sm">$1</span>'
    )

    // 处理任务列表 - [ ] 和 - [x]
    processedText = processedText.replace(
      /^- \[ \] (.*)$/gm,
      '<div class="flex items-center mb-1"><input type="checkbox" disabled class="mr-2 w-4 h-4"><span class="text-gray-700">$1</span></div>'
    )
    processedText = processedText.replace(
      /^- \[x\] (.*)$/gm,
      '<div class="flex items-center mb-1"><input type="checkbox" checked disabled class="mr-2 w-4 h-4"><span class="text-gray-700 line-through">$1</span></div>'
    )

    // 处理键盘按键 <kbd>key</kbd>
    processedText = processedText.replace(
      /<kbd>(.*?)<\/kbd>/g,
      '<kbd class="bg-gray-200 border border-gray-300 rounded px-1 py-0.5 text-xs font-mono shadow-sm">$1</kbd>'
    )

    // 处理特殊符号和表情符号保持原样
    // 数字带圆圈的符号 ①②③④⑤
    processedText = processedText.replace(
      /([①②③④⑤⑥⑦⑧⑨⑩])/g,
      '<span class="inline-block bg-blue-100 text-blue-800 w-6 h-6 rounded-full text-center text-sm font-bold">$1</span>'
    )

    // 处理 emoji 表情符号，保持原样显示
    processedText = processedText.replace(
      /([\u{1F600}-\u{1F64F}]|[\u{1F300}-\u{1F5FF}]|[\u{1F680}-\u{1F6FF}]|[\u{1F1E0}-\u{1F1FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}])/gu,
      '<span class="text-lg">$1</span>'
    )

    // 处理换行：双换行变段落，单换行变<br>
    processedText = processedText.replace(/\n\n+/g, '</p><p class="mb-3 leading-relaxed">')
    processedText = processedText.replace(/\n/g, '<br>')

    // 包装在段落中
    if (processedText && !processedText.includes('<h') && !processedText.includes('<div') && !processedText.includes('<ul') && !processedText.includes('<ol') && !processedText.includes('<blockquote')) {
      processedText = '<p class="mb-3 leading-relaxed">' + processedText + '</p>'
    }

    return processedText
  }

  return (
    <div 
      className={`markdown-content prose prose-sm max-w-none ${className}`}
      dangerouslySetInnerHTML={{ __html: renderMarkdown(content) }}
    />
  )
}
