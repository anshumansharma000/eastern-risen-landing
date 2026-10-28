import type { NextConfig } from "next";

const isStaticBuild = process.env.NODE_ENV === "production";

const nextConfig: NextConfig = {
  output: isStaticBuild ? "export" : undefined,
  trailingSlash: true,
  // The static host reads public/_redirects and public/_headers. Next's local
  // development server needs equivalent rules to open a private token URL.
  ...(!isStaticBuild && {
    async rewrites() {
      return [{ source: "/quote/:token", destination: "/quote" }, { source: "/account/:path*", destination: "/account" }];
    },
    async headers() {
      return [{
        source: "/:area(quote|account)/:path*",
        headers: [
          { key: "Cache-Control", value: "no-store" },
          { key: "Referrer-Policy", value: "no-referrer" },
          { key: "X-Robots-Tag", value: "noindex, nofollow, noarchive" },
        ],
      }];
    },
  }),
  // The site ships responsive, locally curated assets. Serving them directly
  // keeps local development and the static deployment on the same code path.
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
