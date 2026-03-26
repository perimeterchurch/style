import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  outputFileTracingRoot: import.meta.dirname,
  serverExternalPackages: ["shiki"],
  turbopack: {
    root: import.meta.dirname,
  },
};

export default nextConfig;
