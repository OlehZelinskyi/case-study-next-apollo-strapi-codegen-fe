import { getClient } from "@/app/apollo-client";
import CreateCarForm from "./CreateCarForm";
import { OwnersDocument } from "@/generated/graphql";

export default async function CreateCarPage() {
  const owners = await getClient().query({
    query: OwnersDocument,
  });

  return (
    <main className="p-6 bg-gray-50 min-h-screen">
      <CreateCarForm ownersData={owners.data?.usersPermissionsUsers ?? []} />
    </main>
  );
}
