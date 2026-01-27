import type { NextConfig } from "next";
import withBundleAnalyzer from "@next/bundle-analyzer";

const bundleAnalyzer = withBundleAnalyzer({
  enabled: process.env.ANALYZE === "true",
});

const nextConfig: NextConfig = {
  // Optimize images
  images: {
    formats: ["image/avif", "image/webp"],
    minimumCacheTTL: 60,
  },

  // Compiler options
  compiler: {
    removeConsole: process.env.NODE_ENV === "production",
  },

  // Experimental features
  experimental: {
    optimizePackageImports: ["framer-motion", "lucide-react"],
  },
};

export default bundleAnalyzer(nextConfig);
