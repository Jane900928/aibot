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
          console.error(`DeepSeek API error: ${response.status} ${response.statusText}`);
          const errorText = await response.text();
          console.error('DeepSeek API error details:', errorText);
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

// Simple GraphQL executor with better error handling
async function executeGraphQL(query, variables, context) {
  try {
    console.log('Received GraphQL request:', { query, variables });
    
    // Handle hello query
    if (query.includes('hello') && query.includes('query')) {
      return { hello: resolvers.Query.hello() };
    }
    
    // Handle sendMessage mutation
    if (query.includes('sendMessage') && query.includes('mutation')) {
      if (!variables?.input?.message) {
        throw new Error('Message is required');
      }
      
      const result = await resolvers.Mutation.sendMessage(null, { input: variables.input }, context);
      return { sendMessage: result };
    }
    
    throw new Error('Unsupported GraphQL operation');
  } catch (error) {
    console.error('GraphQL execution error:', error);
    throw error;
  }
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
    console.log(`${request.method} ${url.pathname}`);

    // GraphQL endpoint
    if (url.pathname === '/graphql' && request.method === 'POST') {
      try {
        // Check content type
        const contentType = request.headers.get('content-type');
        if (!contentType || !contentType.includes('application/json')) {
          return new Response(
            JSON.stringify({ 
              errors: [{ message: 'Content-Type must be application/json' }] 
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

        const body = await request.text();
        console.log('Request body:', body);

        if (!body) {
          return new Response(
            JSON.stringify({ 
              errors: [{ message: 'Request body is empty' }] 
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

        let requestData;
        try {
          requestData = JSON.parse(body);
        } catch (parseError) {
          return new Response(
            JSON.stringify({ 
              errors: [{ message: 'Invalid JSON in request body' }] 
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

        const { query, variables } = requestData;
        
        if (!query) {
          return new Response(
            JSON.stringify({ 
              errors: [{ message: 'GraphQL query is required' }] 
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
        
        const context = { env };
        const result = await executeGraphQL(query, variables, context);
        
        return new Response(JSON.stringify({ data: result }), {
          headers: {
            'Content-Type': 'application/json',
            ...corsHeaders,
          },
        });
      } catch (error) {
        console.error('GraphQL endpoint error:', error);
        return new Response(
          JSON.stringify({ 
            errors: [{ message: error.message || 'Internal server error' }] 
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
      return new Response(JSON.stringify({ 
        status: 'ok', 
        timestamp: new Date().toISOString(),
        environment: {
          hasDeepSeekUrl: !!env.DEEPSEEK_API_URL,
          hasApiKey: !!env.DEEPSEEK_API_KEY
        }
      }), {
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders,
        },
      });
    }

    // Default response
    return new Response('DeepSeek AI Chat Worker - Use /graphql endpoint for GraphQL queries', {
      headers: corsHeaders,
    });
  },
};
