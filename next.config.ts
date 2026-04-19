import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {
    // Set the project root so Turbopack doesn't pick up the parent workspace
    root: __dirname,
  },
};

export default nextConfig;
