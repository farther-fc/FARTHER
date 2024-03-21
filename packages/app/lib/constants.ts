export const ALLOWED_IMAGE_FORMATS = ["jpg", "png"];

export declare const MAX_UPLOAD_FILE_SIZE_BYTES = 2e7; // 20MB

export const ACCEPTED_IMAGE_TYPES = "image/jpeg, image/jpg, image/png";

export const S3_BUCKET_NAME = "farther";

export const CLOUDFRONT_URI = "dbcnf51dyo2p6.cloudfront.net";

export const networkNames = {
  1: "mainnet",
  8453: "base",
  10: "optimism",
  11155420: "op-sepolia",
  11155111: "sepolia",
  1337: "hardhat",
};

export const defaultChainId = 8453;

export const ROUTES = {
  airdrop: {
    title: "Airdrop",
    path: "/airdrop",
  },
  liquidty: {
    title: "Liqudity",
    path: "/liquidity",
  },
  evangelize: {
    title: "Evangelize",
    path: "/evangelize",
  },
} as const;
