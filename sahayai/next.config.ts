import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // This line enables the standalone output mode, which is crucial for
  // creating optimized Docker images. It creates a separate folder with
  // only the necessary files to run the Next.js server.
  output: 'standalone',

  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        pathname: "/**", // allow all paths
      },
    ],
  },
};

export default nextConfig;
