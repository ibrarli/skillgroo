import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {
    root: __dirname, // ensures Turbopack uses this folder as root
  },};

export default nextConfig;
