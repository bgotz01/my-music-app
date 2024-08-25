// next.config.mjs

/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
      remotePatterns: [
        {
          protocol: 'https',
          hostname: 'bujiaudio.s3.amazonaws.com',
          pathname: '/**',
        },
      ],
    },
  };
  
  export default nextConfig;
  