import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {
    root: __dirname,
    resolveAlias: {
      // Optional AWS SDK peer dep of @strands-agents/sdk's Bedrock-oriented
      // S3 context-offloader plugin, which this project never uses.
      "@aws-sdk/client-s3": "./stubs/empty-aws-s3.ts",
    },
  },
};

export default nextConfig;
