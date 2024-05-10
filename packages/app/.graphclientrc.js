export default {
  sources: [
    {
      name: "farther",
      handler: {
        graphql: {
          endpoint: `https://farther.squids.live/farther-production/graphql`,
        },
      },
    },
  ],
  documents: ["../common/src/gql-queries.ts"],
};
