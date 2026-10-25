
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function AdminCarsPage() {
  const [session, setSession] = useState(null);
  const [cars, setCars] = useState([]);
  const [message, setMessage] = useState("");
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const loadData = () => {
      try {
        const savedSession = sessionStorage.getItem("sheggar-session");
        const savedCars = localStorage.getItem("sheggar-cars");

        setSession(savedSession ? JSON.parse(savedSession) : null);
        setCars(savedCars ? JSON.parse(savedCars) : []);
      } catch {
        setMessage("Unable to load saved car listings.");
      } finally {
        setLoaded(true);
      }
    };

    loadData();
  }, []);

  if (!loaded) {
    return <p>Loading car listings...</p>;
    return <main className="p-8">Loading car listings...</
    main >;
  }

  if (!session || session.role !== "admin") {
    return (
      <main className="mx-auto max-w-xl px-4 py-20 text-center">
        <h1 className="text-3xl font-bold text-slate-900">
          Admin access required
        </h1>
        <Link
          href="/signin"
          className="mt-6 inline-block rounded-xl bg-slate-900 px-6 py-3 text-white"
        >
          Go to sign in
        </Link>
      </main>
    );
  }
  return (
    <main className="min-h-screen bg-slate-50 px-4 py-10 sm:px-8">
      <div className="mx-auto max-w-6xl">
        <Link
          href="/admin"
          className="text-sm font-semibold text-emerald-700 hover:underline"
        >
          &larr; Back to dashboard
        </Link>

        <h1 className="mt-5 text-3xl font-bold text-slate-900">
          Manage Car Listings
        </h1>
        <p className="mt-2 text-slate-600">
          View and remove owner-submitted demo listings.
        </p>

        {message && (
          <p role="status" className="mt-5 rounded-lg bg-emerald-50 p-3 text-emerald-800">
            {message}
          </p>
        )}

        <div className="mt-6 overflow-x-auto rounded-2xl border border-slate-200 bg-white">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-100 text-slate-700">
              <tr>
                <th className="p-4">Car</th>
                <th className="p-4">Owner</th>
                <th className="p-4">Daily price</th>
                <th className="p-4">Location</th>
                <th className="p-4">Action</th>
              </tr>
            </thead>
            <tbody>
              {cars.length > 0 ? (
                cars.map((car) => (
                  <tr key={car.id} className="border-t border-slate-100">
                    <td className="p-4 font-semibold text-slate-900">
                      {car.name} ({car.year})
                    </td>
                    <td className="p-4 text-slate-600">
                      {car.ownerEmail || "Unknown"}
                    </td>
                    <td className="p-4">
                      ETB {Number(car.price || 0).toLocaleString("en-US")}
                    </td>
                    <td className="p-4">{car.location || "Not specified"}</td>
                    <td className="p-4">
                      <button
                        type="button"
                        onClick={() => deleteCar(car)}
                        className="rounded-lg bg-red-50 px-3 py-2 font-semibold text-red-700 hover:bg-red-100"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-slate-500">
                    No owner-submitted listings found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <p className="mt-4 text-sm text-slate-500">
          {cars.length} owner-submitted listing(s). Sample catalogue cars are
          stored separately and are not listed here.
        </p>
      </div>
    </main>
  );
}
