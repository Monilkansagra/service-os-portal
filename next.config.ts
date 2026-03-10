import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {
    // Use the process working directory to correctly identify workspace root
    root: process.cwd(),
  },
};

export default nextConfig;
