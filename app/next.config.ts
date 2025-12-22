import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    images: {
        domains: [
            "lawaadzoxwufjbskafzu.supabase.co" // your existing domain
        ],
        remotePatterns: [
            {
                protocol: "https",
                hostname: "**",
            },
            {
                protocol: "http",
                hostname: "**",
            }
        ]
    }
};

export default nextConfig;
