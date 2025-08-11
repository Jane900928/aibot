// GraphQL Schema
const typeDefs = `
  type Query {
    hello: String
  }

  type Mutation {
    sendMessage(input: MessageInput!): ChatResponse!
  }

  input MessageInput {
    message: String!
    conversationId: String
  }

  type ChatResponse {
    id: String!
    message: String!
    timestamp: String!
    conversationId: String!
  }
`;

// GraphQL Resolvers
const resolvers = {
  Query: {
    hello: () => 'Hello from DeepSeek AI Chat!',
  },
  Mutation: {
    sendMessage: async (parent, { input }, context) => {
      const { message, conversationId } = input;
      
      try {
        // Call DeepSeek API
        const response = await fetch(`${context.env.DEEPSEEK_API_URL}/v1/chat/completions`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${context.env.DEEPSEEK_API_KEY}`,
          },
          body: JSON.stringify({
            model: 'deepseek-chat',
            messages: [
              {
                role: 'user',
                content: message,
              },
            ],
            max_tokens: 1000,
            temperature: 0.7,
          }),
        });

        if (!response.ok) {
          throw new Error(`DeepSeek API error: ${response.status}`);
        }

        const data = await response.json();
        const aiMessage = data.choices[0]?.message?.content || 'Sorry, I could not generate a response.';

        return {
          id: generateId(),
          message: aiMessage,
          timestamp: new Date().toISOString(),
          conversationId: conversationId || generateId(),
        };
      } catch (error) {
        console.error('Error calling DeepSeek API:', error);
        return {
          id: generateId(),
          message: 'Sorry, there was an error processing your request.',
          timestamp: new Date().toISOString(),
          conversationId: conversationId || generateId(),
        };
      }
    },
  },
};

// Simple GraphQL executor
async function executeGraphQL(query, variables, context) {
  // This is a simplified GraphQL executor
  // In production, you'd use a proper GraphQL library
  
  if (query.includes('mutation sendMessage')) {
    const messageMatch = variables?.input?.message;
    const conversationId = variables?.input?.conversationId;
    
    if (messageMatch) {
      return await resolvers.Mutation.sendMessage(null, { input: { message: messageMatch, conversationId } }, context);
    }
  }
  
  if (query.includes('query') && query.includes('hello')) {
    return { hello: resolvers.Query.hello() };
  }
  
  throw new Error('Query not supported');
}

// Utility function to generate IDs
function generateId() {
  return Math.random().toString(36).substr(2, 9);
}

// CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

// Main Cloudflare Worker handler
export default {
  async fetch(request, env, ctx) {
    // Handle CORS preflight requests
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        status: 200,
        headers: corsHeaders,
      });
    }

    const url = new URL(request.url);

    // GraphQL endpoint
    if (url.pathname === '/graphql' && request.method === 'POST') {
      try {
        const { query, variables } = await request.json();
        
        const context = { env };
        const result = await executeGraphQL(query, variables, context);
        
        return new Response(JSON.stringify({ data: result }), {
          headers: {
            'Content-Type': 'application/json',
            ...corsHeaders,
          },
        });
      } catch (error) {
        return new Response(
          JSON.stringify({ 
            errors: [{ message: error.message }] 
          }), 
          {
            status: 400,
            headers: {
              'Content-Type': 'application/json',
              ...corsHeaders,
            },
          }
        );
      }
    }

    // Health check endpoint
    if (url.pathname === '/health') {
      return new Response(JSON.stringify({ status: 'ok' }), {
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders,
        },
      });
    }

    // Default response
    return new Response('DeepSeek AI Chat Worker', {
      headers: corsHeaders,
    });
  },
};
