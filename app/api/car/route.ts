import { getClient } from "../../apollo-client";
import { CreateCarDocument } from "@/generated/graphql";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const client = getClient();

    const result = await client.mutate({
      mutation: CreateCarDocument,
      variables: { data: body },
    });

    return Response.json({ success: true, data: result.data });
  } catch (error) {
    console.error("Error creating car:", error);
    return Response.json(
      { success: false, error: (error as Error).message },
      { status: 500 },
    );
  }
}
