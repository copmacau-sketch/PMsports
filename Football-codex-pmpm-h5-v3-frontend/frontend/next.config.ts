import path from "node:path";
import type { NextConfig } from "next";

// PmPm v3 H5 prototype — operational data is sourced from the
// crown-explorer FastAPI backend (see /Volumes/T7/Crown/crown-explorer).
// In dev the backend listens on 127.0.0.1:8787; override with
// CROWN_API_BASE if it moves. The Next dev server proxies same-origin
// `/api/*` requests through `rewrites()` so the browser never has to
// deal with CORS.
const API_BASE = process.env.CROWN_API_BASE || "http://127.0.0.1:8787";
const IS_EXPORT = process.env.NEXT_EXPORT === "1";

const nextConfig: NextConfig = {
  turbopack: { root: path.resolve(__dirname) },
  // Static export for Apache deployment (NEXT_EXPORT=1);
  // standalone for pmppm.com Node deployment (default).
  output: IS_EXPORT ? "export" : "standalone",
  // Static export goes to /h5/ sub-path on the Crown server.
  basePath: IS_EXPORT ? "/h5" : "",
  async rewrites() {
    if (IS_EXPORT) return []; // no rewrites in static export
    return [
      { source: "/api/:path*", destination: `${API_BASE}/api/:path*` },
      { source: "/health", destination: `${API_BASE}/health` },
    ];
  },
};

export default nextConfig;
