import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    qualities: [75, 95],
  },
  async redirects() {
    return [
      {
        destination: "/info#shipping",
        permanent: true,
        source: "/shipping",
      },
      {
        destination: "/info#returns",
        permanent: true,
        source: "/returns",
      },
      {
        destination: "/info#contact",
        permanent: true,
        source: "/contact",
      },
      {
        destination: "/info#privacy",
        permanent: true,
        source: "/privacy",
      },
      {
        destination: "/info#terms",
        permanent: true,
        source: "/terms",
      },
      {
        destination: "/info#cookies",
        permanent: true,
        source: "/cookies",
      },
      {
        destination: "/lookbook",
        permanent: true,
        source: "/journal",
      },
    ];
  },
};

export default nextConfig;
