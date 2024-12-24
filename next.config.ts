import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	images: {
		remotePatterns: [
			{
				protocol: "http",
				hostname: "127.0.0.1",
				port: "8090",
				pathname: "/api/files/**",
			},
		],
	},
	eslint: {
		ignoreDuringBuilds: true,
	},
};

export default nextConfig;
