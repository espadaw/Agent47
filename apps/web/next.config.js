const nextConfig = {
    transpilePackages: ['@agent47/aggregator', '@agent47/integrations', '@agent47/shared'],
    output: 'standalone', // Required for Docker deployment
};

export default nextConfig;

