const ENVIRONMENT = process.env.NEXT_PUBLIC_ENVIRONMENT;

if (ENVIRONMENT !== "production" && ENVIRONMENT !== "staging") {
  throw new Error("ENVIRONMENT must be either production or staging");
}

export default {
  sources: [
    {
      name: "farther",
      handler: {
        graphql: {
          endpoint: `https://farther.squids.live/farther-${ENVIRONMENT}/graphql`,
        },
      },
    },
  ],
  documents: ["../common/src/gql-queries.ts"],
};
