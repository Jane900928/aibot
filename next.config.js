/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
  },
  async rewrites() {
    return [
      {
        source: '/api/graphql',
        destination: 'https://your-worker.your-subdomain.workers.dev/graphql', // Replace with your worker URL
      },
    ];
  },
};

module.exports = nextConfig;
