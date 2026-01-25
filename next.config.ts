/** @type {import('next').NextConfig} */
const nextConfig = {
  /* config options here */
  reactStrictMode: true,
  devIndicators: false,

  async rewrites() {
    return [
      {
        source: '/api/backend/:path*',
        destination: 'http://ec2-3-110-219-38.ap-south-1.compute.amazonaws.com:8000/:path*',
      },
    ]
  },
};

export default nextConfig;