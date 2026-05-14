import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://72.62.245.149:3000/api/:path*',
      },
    ];
  },
};


export default nextConfig;
