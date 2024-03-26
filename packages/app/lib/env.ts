export const NODE_ENV = process.env.NODE_ENV || "development";

const DEPLOY_ENVIRONMENT_ENV = process.env.NEXT_PUBLIC_ENVIRONMENT || NODE_ENV;

export const ENVIRONMENT =
  (["production", "development", "staging"] as const).find(
    (v) => v === DEPLOY_ENVIRONMENT_ENV,
  ) ||
  (() => {
    throw Error(
      `Invalid DEPLOY_ENVIRONMENT value: ${DEPLOY_ENVIRONMENT_ENV}, expected: 'production' | 'staging' | 'development'`,
    );
  })();

export { ENVIRONMENT as DEPLOY_ENVIRONMENT };

export const isProduction = ENVIRONMENT === "production";
