"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { OwnersQuery } from "@/generated/graphql";

interface CreateCarFormProps {
  ownersData: OwnersQuery["usersPermissionsUsers"];
}

export default function CreateCarForm({ ownersData }: CreateCarFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [form, setForm] = useState({
    name: "",
    model: "",
    year: "",
    owners: [] as string[],
    image: null as File | null,
  });

  const handleSubmit = (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    startTransition(async () => {
      try {
        const response = await fetch("/api/car", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: form.name,
            model: form.model,
            year: form.year,
            owners: form.owners,
          }),
        });

        const data = await response.json();

        if (data?.data?.createCar?.documentId) {
          const formData = new FormData();

          if (form.image) {
            formData.append("files", form.image);
          }

          const fileUploadResponse = await fetch(
            "http://localhost:1337/api/upload",
            {
              method: "POST",
              body: formData,
            },
          );
          const fileUpload = await fileUploadResponse.json();
          const fileDocId = fileUpload[0]?.id;

          if (fileDocId) {
            const updateCarResponse = await fetch("/api/update-car", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                documentId: data.data.createCar.documentId,
                imageDocId: fileDocId,
              }),
            });

            const updateCarData = await updateCarResponse.json();

            if (updateCarData?.success) {
              router.push(`/cars/${data.data.createCar.documentId}`);
            } else {
              router.push("/");
            }
          }
        } else {
          router.push("/");
        }
      } catch (error) {
        console.error("Error creating car:", error);
        // Handle error, maybe show a message
      }
    });
  };

  const handleOwnerChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedOptions = Array.from(
      e.target.selectedOptions,
      (option) => option.value,
    );
    setForm({ ...form, owners: selectedOptions });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setForm({ ...form, image: file });
  };

  return (
    <div className="max-w-2xl mx-auto bg-white border border-gray-200 rounded-lg shadow-sm p-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Create New Car</h1>

      <form onSubmit={handleSubmit} className="space-y-4 text-gray-800">
        <div>
          <label
            htmlFor="name"
            className="block text-sm font-medium text-gray-700"
          >
            Name
          </label>
          <input
            type="text"
            id="name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div>
          <label
            htmlFor="model"
            className="block text-sm font-medium text-gray-700"
          >
            Model
          </label>
          <input
            type="text"
            id="model"
            value={form.model}
            onChange={(e) => setForm({ ...form, model: e.target.value })}
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div>
          <label
            htmlFor="year"
            className="block text-sm font-medium text-gray-700"
          >
            Year
          </label>
          <input
            type="text"
            id="year"
            value={form.year}
            onChange={(e) => setForm({ ...form, year: e.target.value })}
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div>
          <label
            htmlFor="owners"
            className="block text-sm font-medium text-gray-700"
          >
            Owners
          </label>
          <select
            id="owners"
            multiple
            value={form.owners}
            onChange={handleOwnerChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          >
            {ownersData.map((owner) => (
              <option key={owner?.documentId} value={owner?.documentId}>
                {owner?.fullname}
              </option>
            ))}
          </select>
          <p className="text-sm text-gray-500 mt-1">
            Hold Ctrl (or Cmd) to select multiple owners.
          </p>
        </div>

        <div>
          <label
            htmlFor="image"
            className="block text-sm font-medium text-gray-700"
          >
            Car Image
          </label>
          <input
            type="file"
            id="image"
            accept="image/*"
            onChange={handleFileChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
          {form.image && (
            <p className="text-sm text-gray-500 mt-1">
              Selected: {form.image.name}
            </p>
          )}
        </div>

        <div className="flex justify-end space-x-4">
          <Link
            href="/"
            className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={isPending}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50"
          >
            {isPending ? "Creating..." : "Create Car"}
          </button>
        </div>
      </form>
    </div>
  );
}
