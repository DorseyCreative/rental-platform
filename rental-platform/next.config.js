/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['localhost', 'supabase.co', 'via.placeholder.com'],
    unoptimized: process.env.NODE_ENV === 'production' && process.env.GITHUB_PAGES === 'true',
  },
  // GitHub Pages deployment configuration
  assetPrefix: process.env.NEXT_PUBLIC_ASSET_PREFIX || '',
  basePath: process.env.NEXT_PUBLIC_BASE_PATH || '',
  output: process.env.GITHUB_PAGES === 'true' ? 'export' : undefined,
  trailingSlash: process.env.GITHUB_PAGES === 'true',
  distDir: 'out',
  // Disable server-side features for static export
  ...(process.env.GITHUB_PAGES === 'true' && {
    images: {
      unoptimized: true,
    },
  }),
}

module.exports = nextConfig