/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: 'export',
  basePath: '/SentinelOT-X',
  assetPrefix: '/SentinelOT-X/',
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
