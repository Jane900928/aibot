import ChatInterface from './components/ChatInterface'

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <header className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              DeepSeek AI 聊天
            </h1>
            <p className="text-gray-600">
              基于 DeepSeek AI 的智能对话助手
            </p>
          </header>
          
          <ChatInterface />
        </div>
      </div>
    </main>
  )
}
