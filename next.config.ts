/** @type {import('next').NextConfig} */
const nextConfig = {
  /* config options here */
  reactStrictMode: true,
  devIndicators: false,

  experimental: {
    optimizePackageImports: ["lucide-react"],
  },

  async rewrites() {
    return [
      {
        source: '/api/backend/:path*',
        destination: 'http://127.0.0.1:8000/:path*',
        // destination: 'https://grammrlyst.in/:path*',
      },
    ]
  },

  async redirects() {
    return [
      {
        source: "/",
        destination: "/dashboard",
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
