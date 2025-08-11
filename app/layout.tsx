import { Inter } from 'next/font/google'
import './globals.css'
import { ApolloWrapper } from './apollo-wrapper'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'DeepSeek AI Chat',
  description: 'AI聊天界面 - 基于DeepSeek API',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh">
      <body className={inter.className}>
        <ApolloWrapper>
          {children}
        </ApolloWrapper>
      </body>
    </html>
  )
}
