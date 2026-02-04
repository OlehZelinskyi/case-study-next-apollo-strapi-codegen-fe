import { getClient } from "./apollo-client";
import { CarsDocument } from "@/generated/graphql";
import Link from "next/link";

export default async function Home() {
  const carsResponse = await getClient().query({
    query: CarsDocument,
  });

  const cars = carsResponse.data?.cars || [];

  return (
    <main className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold text-center mb-6 text-gray-800">
        List of Cars
      </h1>
      <ul className="list-none space-y-4 max-w-2xl mx-auto">
        {cars.map((car) => (
          <li
            key={car?.documentId}
            className="p-4 bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow"
          >
            <Link
              href={`/cars/${car?.documentId}`}
              className="text-blue-600 hover:text-blue-800 font-medium underline"
            >
              {car?.name} - {car?.model} ({car?.year}) - Owners:{" "}
              {car?.owners?.map((owner) => owner?.fullname).join(", ") ||
                "None"}
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
}
