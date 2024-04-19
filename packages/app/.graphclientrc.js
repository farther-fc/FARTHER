export default {
  sources: [
    {
      name: "farther",
      handler: {
        graphql: {
          endpoint: `https://api.studio.thegraph.com/query/70489/farther-base/version/latest`,
        },
      },
    },
  ],
  documents: ["./lib/subgraph/queries.ts"],
};
