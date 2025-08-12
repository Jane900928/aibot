'use client'

import { marked } from 'marked'
import { useEffect, useState } from 'react'

interface MarkdownRendererProps {
  content: string
  className?: string
}

export default function MarkdownRenderer({ content, className = '' }: MarkdownRendererProps) {
  const [htmlContent, setHtmlContent] = useState('')

  useEffect(() => {
    // 配置 marked 选项
    marked.setOptions({
      breaks: true, // 支持换行
      gfm: true,    // GitHub Flavored Markdown
    })

    // 自定义渲染器
    const renderer = new marked.Renderer()
    
    // 自定义标题渲染
    renderer.heading = (text, level) => {
      const sizes = {
        1: 'text-2xl font-bold text-gray-900 mb-4 mt-6',
        2: 'text-xl font-bold text-gray-800 mb-3 mt-5',
        3: 'text-lg font-semibold text-gray-700 mb-2 mt-4',
        4: 'text-base font-semibold text-gray-600 mb-2 mt-3',
        5: 'text-sm font-semibold text-gray-600 mb-1 mt-2',
        6: 'text-xs font-semibold text-gray-600 mb-1 mt-2'
      }
      return `<h${level} class="${sizes[level as keyof typeof sizes] || sizes[3]}">${text}</h${level}>`
    }

    // 自定义强调文本渲染
    renderer.strong = (text) => {
      return `<strong class="font-bold text-primary-700 bg-primary-50 px-1 py-0.5 rounded">${text}</strong>`
    }

    // 自定义斜体文本渲染
    renderer.em = (text) => {
      return `<em class="italic text-gray-700 bg-gray-100 px-1 py-0.5 rounded">${text}</em>`
    }

    // 自定义代码块渲染
    renderer.code = (code, language) => {
      return `
        <div class="relative">
          <pre class="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto my-3 border-l-4 border-primary-500">
            <code class="text-sm font-mono">${code}</code>
          </pre>
          <div class="absolute top-2 right-2 text-xs text-gray-400">${language || 'code'}</div>
        </div>
      `
    }

    // 自定义行内代码渲染
    renderer.codespan = (code) => {
      return `<code class="bg-gray-200 text-gray-800 px-2 py-1 rounded text-sm font-mono border">${code}</code>`
    }

    // 自定义列表渲染
    renderer.list = (body, ordered) => {
      const tag = ordered ? 'ol' : 'ul'
      const classes = ordered 
        ? 'list-decimal list-inside space-y-1 ml-4 my-2' 
        : 'list-disc list-inside space-y-1 ml-4 my-2'
      return `<${tag} class="${classes}">${body}</${tag}>`
    }

    renderer.listitem = (text) => {
      return `<li class="text-gray-700 leading-relaxed">${text}</li>`
    }

    // 自定义段落渲染
    renderer.paragraph = (text) => {
      return `<p class="text-gray-700 leading-relaxed mb-3">${text}</p>`
    }

    // 自定义链接渲染
    renderer.link = (href, title, text) => {
      return `<a href="${href}" class="text-primary-600 hover:text-primary-800 underline decoration-2 underline-offset-2" target="_blank" rel="noopener noreferrer" title="${title || ''}">${text}</a>`
    }

    // 自定义引用渲染
    renderer.blockquote = (quote) => {
      return `<blockquote class="border-l-4 border-primary-400 pl-4 py-2 my-4 bg-primary-50 italic text-gray-700">${quote}</blockquote>`
    }

    // 自定义表格渲染
    renderer.table = (header, body) => {
      return `
        <div class="overflow-x-auto my-4">
          <table class="min-w-full border-collapse border border-gray-300">
            <thead class="bg-gray-50">${header}</thead>
            <tbody>${body}</tbody>
          </table>
        </div>
      `
    }

    renderer.tablerow = (content) => {
      return `<tr class="border-b border-gray-200">${content}</tr>`
    }

    renderer.tablecell = (content, flags) => {
      const tag = flags.header ? 'th' : 'td'
      const classes = flags.header 
        ? 'px-4 py-2 text-left font-semibold text-gray-900 border border-gray-300'
        : 'px-4 py-2 text-gray-700 border border-gray-300'
      return `<${tag} class="${classes}">${content}</${tag}>`
    }

    // 自定义水平分割线
    renderer.hr = () => {
      return `<hr class="my-6 border-t-2 border-gray-200">`
    }

    // 渲染 Markdown
    const processedContent = marked(content, { renderer })
    setHtmlContent(processedContent)
  }, [content])

  return (
    <div 
      className={`markdown-content ${className}`}
      dangerouslySetInnerHTML={{ __html: htmlContent }}
    />
  )
}
