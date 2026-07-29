/** @type {import('next').NextConfig} */
const isProd = process.env.GITHUB_PAGES === 'true';

const nextConfig = {
  reactStrictMode: true,
  output: 'export',
  basePath: isProd ? '/SentinelOT-X' : '',
  assetPrefix: isProd ? '/SentinelOT-X/' : '',
  images: {
    unoptimized: true,
  },
  trailingSlash: false,
};

export default nextConfig;
