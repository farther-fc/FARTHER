if (
  process.env.NEXT_PUBLIC_ENVIRONMENT !== "development" &&
  !process.env.SENTRY_AUTH_TOKEN
) {
  throw new Error("SENTRY_AUTH_TOKEN is required for staging & prod");
}

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  webpack: (config) => {
    config.resolve.fallback = { fs: false, net: false, tls: false };
    return config;
  },
  experimental: {
    scrollRestoration: true,
  },
  images: {
    remotePatterns: [
      {
        hostname: `farther.s3.us-west-1.amazonaws.com`,
      },
      {
        hostname: `dbcnf51dyo2p6.cloudfront.net`,
      },
    ],
  },
  transpilePackages: ["@farther/backend", "@farther/common"],
  async headers() {
    return [
      {
        // matching all API routes
        source: "/api/:path*",
        headers: [
          { key: "Access-Control-Allow-Credentials", value: "true" },
          { key: "Access-Control-Allow-Origin", value: "*" },
          {
            key: "Access-Control-Allow-Methods",
            value: "GET,OPTIONS,PATCH,DELETE,POST,PUT",
          },
          {
            key: "Access-Control-Allow-Headers",
            value:
              "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version",
          },
        ],
      },
    ];
  },
  async redirects() {
    return [
      // Basic redirect
      {
        source: "/rewards",
        destination: "/user/profile",
        permanent: true,
      },
    ];
  },
};

module.exports = nextConfig;

// Injected content via Sentry wizard below

const { withSentryConfig } = require("@sentry/nextjs");

module.exports = withSentryConfig(
  nextConfig,
  {
    // For all available options, see:
    // https://github.com/getsentry/sentry-webpack-plugin#options

    // Suppresses source map uploading logs during build
    silent: true,
    org: "farther-sentry",
    project: "webapp",
  },
  {
    // For all available options, see:
    // https://docs.sentry.io/platforms/javascript/guides/nextjs/manual-setup/

    // Upload a larger set of source maps for prettier stack traces (increases build time)
    widenClientFileUpload: true,

    // Transpiles SDK to be compatible with IE11 (increases bundle size)
    transpileClientSDK: true,

    // Routes browser requests to Sentry through a Next.js rewrite to circumvent ad-blockers (increases server load)
    tunnelRoute: "/monitoring",

    // Hides source maps from generated client bundles
    hideSourceMaps: true,

    // Automatically tree-shake Sentry logger statements to reduce bundle size
    disableLogger: true,

    // Enables automatic instrumentation of Vercel Cron Monitors.
    // See the following for more information:
    // https://docs.sentry.io/product/crons/
    // https://vercel.com/docs/cron-jobs
    automaticVercelMonitors: true,

    authToken: process.env.SENTRY_AUTH_TOKEN,

    headers: () => {
      return ["/tips", "/user/profile"].map((source) => ({
        source,
        headers: [
          {
            key: "Cache-Control",
            value: "no-store",
          },
        ],
      }));
    },
  },
);
