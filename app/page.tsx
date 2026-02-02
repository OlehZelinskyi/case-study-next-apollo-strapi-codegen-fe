import { gql } from "@apollo/client";
import { getClient } from "./apollo-client";

export default async function Home() {
  const carsResponse = await getClient().query({
    query: gql`
      query Cars {
        cars {
          Model
          Name
        }
      }
    `,
  });

  return <main>{JSON.stringify(carsResponse.data, null, 2)}</main>;
}
