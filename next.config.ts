import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  env: {
    OLLAMA_IP: process.env.OLLAMA_IP
  }
};

export default nextConfig;
