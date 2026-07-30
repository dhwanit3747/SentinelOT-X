/** @type {import('next').NextConfig} */
const isGithubPages = process.env.GITHUB_PAGES === 'true';

const nextConfig = {
  reactStrictMode: true,
  output: 'export',
  basePath: isGithubPages ? '/SentinelOT-X' : '',
  assetPrefix: isGithubPages ? '/SentinelOT-X/' : '',
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
