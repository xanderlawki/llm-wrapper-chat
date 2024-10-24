/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
    NEXT_PUBLIC_GOOGLE_AUTH_URL: process.env.NEXT_PUBLIC_GOOGLE_AUTH_URL,
    NEXT_SCRAPPER_API_KEY: process.env.NEXT_SCRAPPER_API_KEY,
  },
};

export default nextConfig;
