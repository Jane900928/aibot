'use client'

import { ApolloClient, InMemoryCache, ApolloProvider } from '@apollo/client'

// 直接使用 Worker 的完整 URL
// 部署时请替换为你的实际 Worker URL
const GRAPHQL_ENDPOINT = process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT || 
  'https://deepseek-ai-worker.konglin928.workers.dev/graphql'

const client = new ApolloClient({
  uri: GRAPHQL_ENDPOINT,
  cache: new InMemoryCache(),
})

export function ApolloWrapper({ children }: { children: React.ReactNode }) {
  return (
    <ApolloProvider client={client}>
      {children}
    </ApolloProvider>
  )
}
