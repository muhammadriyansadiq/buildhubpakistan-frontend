import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'https://builder-pi-two.vercel.app/api/:path*',
      },
    ];
  },
};

export default nextConfig;
