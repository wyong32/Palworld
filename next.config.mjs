/** @type {import('next').NextConfig} */
const nextConfig = {
  reactCompiler: true,
  images: {
    minimumCacheTTL: 2678400,
  },
};

export default nextConfig;
