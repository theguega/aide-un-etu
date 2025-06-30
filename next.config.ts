import type { NextConfig } from "next";

const nextConfig: NextConfig = {};

module.exports = {
  allowedDevOrigins: ["local-origin.dev", "172.26.150.182"],
  devIndicators: false
};

export default nextConfig;
