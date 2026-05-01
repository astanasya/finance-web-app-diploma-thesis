/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "utfs.io", // Домен UploadThing
      },
    ],
  },
  // Якщо у тебе є інші налаштування, залиш їх
};

export default nextConfig;