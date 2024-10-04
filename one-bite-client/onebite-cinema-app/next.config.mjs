/** @type {import('next').NextConfig} */
const nextConfig = {
  logging: { fetches: { fullUrl: true } },
  images: { domains: ["media.themoviedb.org"] },
};

export default nextConfig;
