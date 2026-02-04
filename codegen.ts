import type { CodegenConfig } from "@graphql-codegen/cli";

const config: CodegenConfig = {
  overwrite: true,
  schema: "http://localhost:1337/graphql/",
  documents: "app/graphql/**/*.gql",
  generates: {
    "generated/": {
      preset: "client",
      plugins: [],
    },
  },
};

export default config;
