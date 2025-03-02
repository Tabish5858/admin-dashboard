/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["res.cloudinary.com"],
  },
  eslint: {
    ignoreDuringBuilds: true, // Add this line to ignore ESLint errors during build
  },
};

export default nextConfig;
