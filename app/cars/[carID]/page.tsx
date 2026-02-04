import { getClient } from "../../apollo-client";
import { CarDocument } from "@/generated/graphql";
import Link from "next/link";

interface PageProps {
  params: Promise<{ carID: string }>;
}

export default async function CarPage({ params }: PageProps) {
  const { carID } = await params;

  const carResponse = await getClient().query({
    query: CarDocument,
    variables: { documentId: carID },
  });

  const car = carResponse.data?.car;

  if (!car) {
    return (
      <main className="p-6 bg-gray-50 min-h-screen">
        <div className="max-w-2xl mx-auto text-center">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">
            Car Not Found
          </h1>
          <p className="text-gray-600">The requested car could not be found.</p>
          <Link
            href="/"
            className="text-blue-600 hover:text-blue-800 underline mt-4 inline-block"
          >
            Back to Cars List
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-2xl mx-auto bg-white border border-gray-200 rounded-lg shadow-sm p-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">{car.name}</h1>

        {car.image?.url && (
          <div className="mb-6">
            <img
              src={`http://localhost:1337${car.image.url}`}
              alt={`${car.name} image`}
              className="w-full h-64 object-cover rounded-lg"
            />
          </div>
        )}

        <div className="space-y-4 text-gray-800">
          <div>
            <strong className="text-gray-700">Model:</strong> {car.model}
          </div>
          <div>
            <strong className="text-gray-700">Year:</strong> {car.year}
          </div>
          <div>
            <strong className="text-gray-700">Document ID:</strong>{" "}
            {car.documentId}
          </div>
          <div>
            <strong className="text-gray-700">Owners:</strong>
            {car.owners && car.owners.length > 0 ? (
              <ul className="list-disc list-inside mt-2 space-y-1">
                {car.owners.map((owner) => (
                  <li key={owner?.documentId} className="text-gray-600">
                    {owner?.fullname} (ID: {owner?.documentId})
                  </li>
                ))}
              </ul>
            ) : (
              <span className="text-gray-600 ml-2">None</span>
            )}
          </div>
        </div>

        <div className="mt-6">
          <Link
            href="/"
            className="text-blue-600 hover:text-blue-800 underline"
          >
            Back to Cars List
          </Link>
        </div>
      </div>
    </main>
  );
}
