import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  // The site ships responsive, locally curated assets. Serving them directly
  // keeps local development and the static deployment on the same code path.
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
