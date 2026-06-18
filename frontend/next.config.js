
const nextConfig= {
  output: 'standalone',
  eslint: {
    ignoreDuringBuilds: true, 
  },
images: {
   domains: ['res.cloudinary.com'],
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '3005',
        pathname: '/api/**',
      },
      {
        protocol: 'https',
        hostname: 'example.com',
        pathname: '/images/**',
      },
    ],
  },
};

export default nextConfig;

