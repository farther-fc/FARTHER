import type { CodegenConfig } from "@graphql-codegen/cli";

const ENVIRONMENT = process.env.NEXT_PUBLIC_ENVIRONMENT;

if (ENVIRONMENT !== "production" && ENVIRONMENT !== "staging") {
  throw new Error("ENVIRONMENT must be either production or staging");
}

const config: CodegenConfig = {
  schema: `https://farther.squids.live/farther-${ENVIRONMENT}/graphql`,
  documents: ["src/**/*.tsx"],
  generates: {
    "./src/gql/": {
      preset: "client",
    },
  },
};
export default config;
