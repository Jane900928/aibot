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

    // 处理代码块 ```
    processedText = processedText.replace(
      /```([\s\S]*?)```/g,
      '<pre class="bg-gray-100 dark:bg-gray-800 p-3 rounded-lg overflow-x-auto my-2"><code class="text-sm">$1</code></pre>'
    )

    // 处理行内代码 `code`
    processedText = processedText.replace(
      /`([^`]+)`/g,
      '<code class="bg-gray-100 dark:bg-gray-800 px-1 py-0.5 rounded text-sm font-mono">$1</code>'
    )

    // 处理标题 ### ## #
    processedText = processedText.replace(
      /^### (.*$)/gm,
      '<h3 class="text-lg font-semibold mt-4 mb-2 text-gray-800 dark:text-gray-200">$1</h3>'
    )
    processedText = processedText.replace(
      /^## (.*$)/gm,
      '<h2 class="text-xl font-bold mt-4 mb-2 text-gray-800 dark:text-gray-200">$1</h2>'
    )
    processedText = processedText.replace(
      /^# (.*$)/gm,
      '<h1 class="text-2xl font-bold mt-4 mb-2 text-gray-800 dark:text-gray-200">$1</h1>'
    )

    // 处理粗体 **text** 或 __text__
    processedText = processedText.replace(
      /\*\*(.*?)\*\*/g,
      '<strong class="font-bold text-gray-900 dark:text-gray-100">$1</strong>'
    )
    processedText = processedText.replace(
      /__(.*?)__/g,
      '<strong class="font-bold text-gray-900 dark:text-gray-100">$1</strong>'
    )

    // 处理斜体 *text* 或 _text_
    processedText = processedText.replace(
      /\*(.*?)\*/g,
      '<em class="italic text-gray-700 dark:text-gray-300">$1</em>'
    )
    processedText = processedText.replace(
      /_(.*?)_/g,
      '<em class="italic text-gray-700 dark:text-gray-300">$1</em>'
    )

    // 处理链接 [text](url)
    processedText = processedText.replace(
      /\[([^\]]+)\]\(([^)]+)\)/g,
      '<a href="$2" class="text-blue-600 dark:text-blue-400 hover:underline" target="_blank" rel="noopener noreferrer">$1</a>'
    )

    // 处理无序列表 - 或 *
    processedText = processedText.replace(
      /^[\-\*] (.*)$/gm,
      '<li class="ml-4 mb-1">• $1</li>'
    )

    // 处理有序列表 1. 2. 3.
    processedText = processedText.replace(
      /^(\d+)\. (.*)$/gm,
      '<li class="ml-4 mb-1">$1. $2</li>'
    )

    // 处理删除线 ~~text~~
    processedText = processedText.replace(
      /~~(.*?)~~/g,
      '<del class="line-through text-gray-500 dark:text-gray-400">$1</del>'
    )

    // 处理高亮 ==text==
    processedText = processedText.replace(
      /==(.*?)==/g,
      '<mark class="bg-yellow-200 dark:bg-yellow-800 px-1 rounded">$1</mark>'
    )

    // 处理换行
    processedText = processedText.replace(/\n\n/g, '</p><p class="mb-2">')
    processedText = processedText.replace(/\n/g, '<br>')

    // 包装在段落中
    if (processedText && !processedText.startsWith('<')) {
      processedText = '<p class="mb-2">' + processedText + '</p>'
    }

    return processedText
  }

  return (
    <div 
      className={`prose prose-sm max-w-none ${className}`}
      dangerouslySetInnerHTML={{ __html: renderMarkdown(content) }}
    />
  )
}
