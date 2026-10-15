import type { NextConfig } from "next";

const isProd = process.env.NODE_ENV === "production";
// The repository is 'Abrar_2026'. On GitHub Pages, the site is served at /Abrar_2026
// Setting NEXT_PUBLIC_BASE_PATH="" allows testing locally or custom domains without subpath.
const basePath = process.env.NEXT_PUBLIC_BASE_PATH !== undefined
  ? process.env.NEXT_PUBLIC_BASE_PATH
  : (isProd ? "/Abrar_2026" : "");

const nextConfig: NextConfig = {
  output: "export",
  basePath: basePath || undefined,
  trailingSlash: true,
  poweredByHeader: false,
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
