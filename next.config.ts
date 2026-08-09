import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // The site ships responsive, locally curated assets. Serving them directly
  // keeps local preview and the Cloudflare worker on the same code path and
  // avoids relying on a runtime image binding before the backend phase.
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
