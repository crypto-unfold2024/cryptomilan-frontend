import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ["unfoldweb3.com", "images.lumacdn.com"],
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  /* config options here */
};

export default nextConfig;
