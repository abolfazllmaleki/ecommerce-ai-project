import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true, // غیرفعال کردن ESLint هنگام build
  },
};

export default nextConfig;
