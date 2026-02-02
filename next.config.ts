/** @type {import('next').NextConfig} */
const nextConfig = {
  /* config options here */
  reactStrictMode: true,
  devIndicators: false,

  async rewrites() {
    return [
      {
        source: '/api/backend/:path*',
        //destination: 'http://127.0.0.1:9000/:path*',
        destination: 'https://grammrlyst.in/:path*',
      },
    ]
  },
};

export default nextConfig;
