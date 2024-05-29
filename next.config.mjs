/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "mern-ts-fullstack-server.onrender.com",
      },
    ],
  },
};

export default nextConfig;
