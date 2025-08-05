import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  optimizePackageImports:['@prisma/client'],
  experimental:{
    webpackMemoryOptimizations: true
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "ssl.gstatic.com",
        pathname: "/**", 
      },
    ],
  },
};

export default nextConfig;
