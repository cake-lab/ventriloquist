/** @type {import('next').NextConfig} */

const GITHUB_PAGES = true; // Keep this true for deployment

const nextConfig = {
  reactStrictMode: true,
  assetPrefix: GITHUB_PAGES ? "/ventriloquist/" : "/",
  basePath: GITHUB_PAGES ? "/ventriloquist" : "",
};

module.exports = nextConfig;
