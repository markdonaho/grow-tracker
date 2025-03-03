/** @type {import('next').NextConfig} */
const nextConfig = {
    // Enable static exports for standalone mode in Docker
    output: 'standalone',
    
    // Enable image optimization for external sources (if needed)
    images: {
      domains: ['localhost'],
      // Add any other domains you might use for images
    },
    
    // This will be used for strict mode and other experimental features
    reactStrictMode: true,
    
    // Add any experimental features if needed
    experimental: {
      // serverActions: true,
    },
  };
  
  module.exports = nextConfig;