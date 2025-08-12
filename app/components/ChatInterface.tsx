'use client'

import { useState, useRef, useEffect } from 'react'
import { useMutation } from '@apollo/client'
import { gql } from '@apollo/client'
import MarkdownRenderer from './MarkdownRenderer'

const SEND_MESSAGE = gql`
  mutation SendMessage($input: MessageInput!) {
    sendMessage(input: $input) {
      id
      message
      timestamp
      conversationId
    }
  }
`

interface Message {
  id: string
  content: string
  isUser: boolean
  timestamp: string
}

export default function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([])
  const [inputValue, setInputValue] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [conversationId, setConversationId] = useState<string>('')
  const messagesEndRef = useRef<HTMLDivElement>(null)
  
  const [sendMessage] = useMutation(SEND_MESSAGE)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputValue.trim(),
      isUser: true,
      timestamp: new Date().toISOString(),
    }

    setMessages(prev => [...prev, userMessage])
    setInputValue('')
    setIsLoading(true)

    try {
      const { data } = await sendMessage({
        variables: {
          input: {
            message: inputValue.trim(),
            conversationId: conversationId || undefined,
          },
        },
      })

      if (data?.sendMessage) {
        const aiMessage: Message = {
          id: data.sendMessage.id,
          content: data.sendMessage.message,
          isUser: false,
          timestamp: data.sendMessage.timestamp,
        }

        setMessages(prev => [...prev, aiMessage])
        
        if (!conversationId) {
          setConversationId(data.sendMessage.conversationId)
        }
      }
    } catch (error) {
      console.error('Error sending message:', error)
      const errorMessage: Message = {
        id: Date.now().toString(),
        content: '抱歉，发送消息时出现了错误。请稍后重试。',
        isUser: false,
        timestamp: new Date().toISOString(),
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const clearChat = () => {
    setMessages([])
    setConversationId('')
  }

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
      {/* Header */}
      <div className="bg-primary-600 text-white p-4 flex justify-between items-center">
        <h2 className="text-xl font-semibold">🤖 AI 对话助手</h2>
        <button
          onClick={clearChat}
          className="px-3 py-1 bg-primary-700 hover:bg-primary-800 rounded text-sm transition-colors duration-200"
        >
          清空对话
        </button>
      </div>

      {/* Messages */}
      <div className="chat-container p-4 overflow-y-auto bg-gray-50">
        {messages.length === 0 ? (
          <div className="text-center text-gray-500 mt-8">
            <div className="text-6xl mb-4">🤖</div>
            <p className="text-lg mb-2 font-medium">欢迎使用 DeepSeek AI 聊天</p>
            <p className="text-sm text-gray-400">我支持 Markdown 格式，可以回复：</p>
            <div className="mt-4 text-xs text-gray-400 space-y-1">
              <p>• **粗体文本** 和 *斜体文本*</p>
              <p>• `代码` 和 ```代码块```</p>
              <p>• # 标题 和 > 引用</p>
              <p>• 列表、表格、链接等</p>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`max-w-xs lg:max-w-2xl ${message.isUser ? 'order-1' : 'order-2'}`}>
                  {/* 消息气泡 */}
                  <div
                    className={`px-4 py-3 rounded-lg ${
                      message.isUser 
                        ? 'bg-primary-600 text-white ml-auto' 
                        : 'bg-white border border-gray-200 shadow-sm'
                    }`}
                  >
                    {message.isUser ? (
                      <p className="whitespace-pre-wrap">{message.content}</p>
                    ) : (
                      <MarkdownRenderer 
                        content={message.content} 
                        className="text-gray-800"
                      />
                    )}
                  </div>
                  
                  {/* 时间戳 */}
                  <div className={`text-xs mt-1 ${
                    message.isUser 
                      ? 'text-gray-400 text-right' 
                      : 'text-gray-400 text-left'
                  }`}>
                    {new Date(message.timestamp).toLocaleTimeString()}
                  </div>
                </div>
                
                {/* 头像 */}
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm ${
                  message.isUser 
                    ? 'bg-primary-600 text-white order-2 ml-2' 
                    : 'bg-gray-200 text-gray-600 order-1 mr-2'
                }`}>
                  {message.isUser ? '👤' : '🤖'}
                </div>
              </div>
            ))}
            
            {isLoading && (
              <div className="flex justify-start">
                <div className="w-8 h-8 rounded-full bg-gray-200 text-gray-600 flex items-center justify-center text-sm order-1 mr-2">
                  🤖
                </div>
                <div className="max-w-xs lg:max-w-2xl order-2">
                  <div className="bg-white border border-gray-200 shadow-sm px-4 py-3 rounded-lg">
                    <div className="typing-indicator">
                      <div className="typing-dot"></div>
                      <div className="typing-dot"></div>
                      <div className="typing-dot"></div>
                    </div>
                    <p className="text-xs text-gray-400 mt-2">AI 正在思考中...</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="border-t bg-white p-4">
        <div className="flex space-x-3">
          <div className="flex-1">
            <textarea
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="输入您的消息... (支持 Markdown 格式)"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 resize-none transition-colors"
              rows={2}
              disabled={isLoading}
            />
            <div className="text-xs text-gray-400 mt-1">
              支持 **粗体**、*斜体*、`代码`、# 标题等 Markdown 格式
            </div>
          </div>
          <button
            onClick={handleSendMessage}
            disabled={!inputValue.trim() || isLoading}
            className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 self-start"
          >
            {isLoading ? (
              <div className="flex items-center space-x-1">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>发送中</span>
              </div>
            ) : (
              '发送'
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
