export default {
  sources: [
    {
      name: "farther",
      handler: {
        graphql: {
          endpoint: `https://farther.squids.live/farther/graphql`,
        },
      },
    },
  ],
  documents: ["./lib/gql-queries.ts"],
};
