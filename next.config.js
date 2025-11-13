const path = require('path');

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    typedRoutes: true,
  },
  webpack: (config, { isServer, webpack }) => {
    // Configure webpack for pdfjs-dist
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        path: false,
        crypto: false,
        canvas: false,
      };
      
      // Use IgnorePlugin to ignore canvas module when required from pdfjs-dist
      // This prevents webpack from trying to resolve the Node.js canvas module
      config.plugins.push(
        new webpack.IgnorePlugin({
          checkResource(resource, context) {
            // Ignore canvas when it's required from pdfjs-dist
            if (resource === 'canvas' && context.includes('pdfjs-dist')) {
              return true;
            }
            return false;
          },
        })
      );
      
      // Also configure alias and fallback as backup
      if (!config.resolve.alias) {
        config.resolve.alias = {};
      }
      config.resolve.alias['canvas'] = false;
    }
    
    return config;
  },
};

module.exports = nextConfig;
