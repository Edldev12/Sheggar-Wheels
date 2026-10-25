"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { cars as sampleCars } from "@/data/cars";
import Image from "next/image";

export default function AdminCarsPage() {
  const [session, setSession] = useState(null);
  const [cars, setCars] = useState([]);
  const [search, setSearch] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      try {
        const savedSession = sessionStorage.getItem("sheggar-session");
        const savedCars = JSON.parse(
          localStorage.getItem("sheggar-cars") || "[]"
        );

        setSession(savedSession ? JSON.parse(savedSession) : null);

        if (!Array.isArray(savedCars)) {
          throw new Error("Invalid car listings");
        }

        setCars(savedCars);
      } catch {
        setError("Unable to load saved car listings.");
      } finally {
        setLoaded(true);
      }
    }, 0);

    return () => window.clearTimeout(timer);
  }, []);

  const allCars = useMemo(() => {
    const ownerCarIds = new Set(cars.map((car) => String(car.id)));

    const catalogueCars = sampleCars.map((car) => ({
      ...car,
      source: "Catalogue",
    }));

    const ownerCars = cars
      .filter(
        (car) =>
          !sampleCars.some(
            (sample) => String(sample.id) === String(car.id)
          )
      )
      .map((car) => ({
        ...car,
        source: "Owner listing",
      }));

    return [...catalogueCars, ...ownerCars];
  }, [cars]);

  const filteredCars = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) return allCars;

    return allCars.filter((car) =>
      [
        car.name,
        car.year,
        car.type,
        car.ownerEmail,
        car.location,
      ].some((value) =>
        String(value ?? "").toLowerCase().includes(query)
      )
    );
  }, [allCars, search]);

  function deleteCar(car) {
    const confirmed = window.confirm(
      `Delete the listing "${car.name || "Unnamed car"}"? This action cannot be undone.`
    );

    if (!confirmed) return;

    try {
      const savedCars = JSON.parse(
        localStorage.getItem("sheggar-cars") || "[]"
      );

      if (!Array.isArray(savedCars)) {
        throw new Error("Invalid car listings");
      }

      const updatedCars = savedCars.filter(
        (item) => String(item.id) !== String(car.id)
      );

      localStorage.setItem("sheggar-cars", JSON.stringify(updatedCars));
      setCars(updatedCars);
      setMessage("Car listing deleted successfully.");
      setError("");
    } catch {
      setError("Could not delete the car listing. Please try again.");
      setMessage("");
    }
  }

  if (!loaded) {
    return (
      <main className="min-h-screen bg-slate-950 px-6 py-16 text-white">
        Loading car listings...
      </main>
    );
  }

  if (!session || session.role !== "admin") {
    return (
      <main className="min-h-screen bg-slate-950 px-4 py-20 text-center text-white">
        <h1 className="text-3xl font-bold">Admin access required</h1>
        <p className="mt-3 text-slate-400">
          Sign in with your demo admin account to manage car listings.
        </p>
        <Link
          href="/signin"
          className="mt-6 inline-block rounded-xl bg-orange-500 px-6 py-3 font-semibold hover:bg-orange-400"
        >
          Go to sign in
        </Link>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-950 px-4 py-10 text-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <Link
          href="/admin"
          className="text-sm font-semibold text-slate-400 transition hover:text-orange-400"
        >
          ← Back to dashboard
        </Link>

        <div className="mt-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-orange-400">
              Sheggar Wheels
            </p>
            <h1 className="mt-2 text-3xl font-bold sm:text-4xl">
              Manage Car Listings
            </h1>
            <p className="mt-2 text-slate-400">
              Review and manage owner-submitted demo listings.
            </p>
          </div>

          <Link
            href="/admin"
            className="w-fit rounded-xl border border-white/10 px-4 py-3 text-sm font-semibold transition hover:bg-white/5"
          >
            Admin dashboard
          </Link>
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          <div className="rounded-2xl border border-white/10 bg-slate-900 p-5">
            <p className="text-sm text-slate-400">Owner-submitted listings</p>
            <p className="mt-2 text-3xl font-bold">{cars.length}</p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-slate-900 p-5">
            <p className="text-sm text-slate-400">Search results</p>
            <p className="mt-2 text-3xl font-bold">{filteredCars.length}</p>
          </div>
        </div>

        {message && (
          <p
            role="status"
            className="mt-5 rounded-xl border border-green-500/20 bg-green-500/10 p-4 text-green-300"
          >
            {message}
          </p>
        )}

        {error && (
          <p
            role="alert"
            className="mt-5 rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-red-300"
          >
            {error}
          </p>
        )}

        <section className="mt-8 rounded-2xl border border-white/10 bg-slate-900 p-4 sm:p-6">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
            <div>
              <h2 className="text-xl font-bold">Owner listings</h2>
              <p className="mt-1 text-sm text-slate-400">
                Search by car name, year, type, owner email, or location.
              </p>
            </div>

            <input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search car listings..."
              aria-label="Search car listings"
              className="w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none placeholder:text-slate-500 focus:border-orange-400 sm:max-w-sm"
            />
          </div>

          <div className="mt-6 overflow-x-auto">
            <table className="w-full min-w-[720px] text-left text-sm">
              <thead className="bg-slate-950 text-slate-400">
                <tr>
                  <th className="rounded-l-lg p-4">Image</th>
                  <th className="rounded-l-lg p-4">Car</th>
                  <th className="p-4">Source</th>
                  <th className="p-4">Owner</th>
                  <th className="p-4">Daily price</th>
                  <th className="p-4">Location</th>
                  <th className="rounded-r-lg p-4">Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredCars.length > 0 ? (
                  filteredCars.map((car, index) => (
                    <tr
                      key={car.id ?? `car-${index}`}
                      className="border-t border-white/10"
                    >
                      <td className="p-4">
                        <div className="relative h-14 w-20 overflow-hidden rounded-lg border border-white/10">
                          <Image
                            src={car.image || "/cars/car-placeholder.png"}
                            alt={car.name || "Car"}
                            fill
                            sizes="80px"
                            className="object-cover"
                            loading="lazy"
                            unoptimized
                          />
                        </div>
                      </td>
                      <td className="p-4">
                        <p className="font-semibold">
                          {car.name || "Unnamed car"}
                          {car.year ? ` (${car.year})` : ""}
                        </p>
                        {car.type && (
                          <p className="mt-1 text-xs text-slate-500">
                            {car.type}
                          </p>
                        )}
                      </td>
                      <td className="p-4">
                        <p className="mt-1 text-xs text-slate-500">
                          {car.source}
                        </p>
                      </td>
                      <td className="p-4 text-slate-300">
                        {car.ownerEmail || "Unknown"}
                      </td>
                      <td className="p-4 whitespace-nowrap">
                        ETB {Number(car.price || 0).toLocaleString("en-US")}
                      </td>
                      <td className="p-4 text-slate-300">
                        {car.location || "Not specified"}
                      </td>
                      <td className="p-4">
                        <button
                          type="button"
                          onClick={() => deleteCar(car)}
                          className="rounded-lg border border-red-500/30 px-3 py-2 font-semibold text-red-300 transition hover:bg-red-500/10"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={6}
                      className="p-10 text-center text-slate-400"
                    >
                      {cars.length === 0
                        ? "No owner-submitted listings found."
                        : "No listings match your search."}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>

        <p className="mt-5 text-xs leading-5 text-slate-500">
          {cars.length} owner-submitted listing(s). Sample catalogue cars are
          stored separately. This demo uses browser localStorage; changes are
          not synchronized to other devices, and this client-side admin check
          is not server-side security.
        </p>
      </div >
    </main >
  );
}
