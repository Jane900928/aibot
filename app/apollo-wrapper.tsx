'use client'

import { ApolloClient, InMemoryCache, ApolloProvider } from '@apollo/client'

// 优先使用环境变量，如果没有则使用自定义域名
const GRAPHQL_ENDPOINT = process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT || 
  'https://api.yourdomain.com/graphql' // 替换为你的自定义域名

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
