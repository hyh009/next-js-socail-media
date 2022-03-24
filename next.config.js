/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    CLOUDINARY_URL: "https://api.cloudinary.com/v1_1/dh2splieo/image/upload",
    CLOUDINARY_NAME: "dh2splieo",
    GOOGLE_API_KEY: "AIzaSyAoh4_Cx5tD4mMcq56k6QB-YW-dF9oBGEI",
  },
};

module.exports = nextConfig;
