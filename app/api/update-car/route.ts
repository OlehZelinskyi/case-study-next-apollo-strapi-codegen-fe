import { getClient } from "../../apollo-client";
import { UpdateCarDocument } from "@/generated/graphql";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const client = getClient();

    const result = await client.mutate({
      mutation: UpdateCarDocument,
      variables: {
        data: { image: body.imageDocId },
        documentId: body.documentId,
      },
    });

    return Response.json({ success: true, data: result.data });
  } catch (error) {
    console.error("Error updating car:", error);
    return Response.json(
      { success: false, error: (error as Error).message },
      { status: 500 },
    );
  }
}
