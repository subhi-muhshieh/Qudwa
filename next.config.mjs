/** @type {import('next').NextConfig} */
const nextConfig = {
  // We removed "output: export" so API routes work again!
  images: {
    unoptimized: true,
  },
};

export default nextConfig;