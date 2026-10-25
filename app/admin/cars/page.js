"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { cars as sampleCars } from "@/data/cars";

const emptyForm = {
  name: "",
  year: "",
  type: "",
  price: "",
  location: "",
  imagesText: "",
};

export default function AdminCarsPage() {
  const [session, setSession] = useState(null);
  const [cars, setCars] = useState([]);
  const [catalogueOverrides, setCatalogueOverrides] = useState({});
  const [search, setSearch] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loaded, setLoaded] = useState(false);
  const [editingCar, setEditingCar] = useState(null);
  const [form, setForm] = useState(emptyForm);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      try {
        const savedSession = sessionStorage.getItem("sheggar-session");
        const savedCars = JSON.parse(
          localStorage.getItem("sheggar-cars") || "[]"
        );
        const savedOverrides = JSON.parse(
          localStorage.getItem("sheggar-catalogue-overrides") || "{}"
        );

        if (!Array.isArray(savedCars)) {
          throw new Error("Invalid car listings");
        }

        if (
          !savedOverrides ||
          typeof savedOverrides !== "object" ||
          Array.isArray(savedOverrides)
        ) {
          throw new Error("Invalid catalogue overrides");
        }

        setSession(savedSession ? JSON.parse(savedSession) : null);
        setCars(savedCars);
        setCatalogueOverrides(savedOverrides);
      } catch {
        setError("Unable to load saved car listings.");
      } finally {
        setLoaded(true);
      }
    }, 0);

    return () => window.clearTimeout(timer);
  }, []);

  const allCars = useMemo(() => {
    const catalogueCars = sampleCars.map((car) => ({
      ...car,
      ...(catalogueOverrides[String(car.id)] || {}),
      id: car.id,
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
  }, [cars, catalogueOverrides]);

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

  function startEditing(car) {
    const images =
      Array.isArray(car.images) && car.images.length > 0
        ? car.images
        : car.image
          ? [car.image]
          : [];

    setEditingCar(car);
    setForm({
      name: car.name || "",
      year: String(car.year || ""),
      type: car.type || "",
      price: String(car.price ?? ""),
      location: car.location || "",
      imagesText: images.join("\n"),
    });
    setMessage("");
    setError("");
  }

  function cancelEditing() {
    setEditingCar(null);
    setForm(emptyForm);
    setError("");
  }

  function updateForm(event) {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  }

  function saveCar(event) {
    event.preventDefault();

    if (!editingCar) return;

    const name = form.name.trim();
    const year = Number(form.year);
    const price = Number(form.price);

    const images = form.imagesText
      .split("\n")
      .map((url) => url.trim())
      .filter(Boolean);

    if (!name) {
      setError("Please enter the car name.");
      return;
    }

    if (!Number.isInteger(year) || year < 1900 || year > 2100) {
      setError("Enter a valid car year.");
      return;
    }

    if (!Number.isFinite(price) || price < 0) {
      setError("Enter a valid daily price.");
      return;
    }

    const invalidUrl = images.some((url) => {
      try {
        const parsed = new URL(url);
        return !["http:", "https:"].includes(parsed.protocol);
      } catch {
        return true;
      }
    });

    if (invalidUrl) {
      setError("Each photo must be a valid HTTP or HTTPS URL.");
      return;
    }

    try {
      const updatedFields = {
        name,
        year,
        type: form.type.trim(),
        price,
        location: form.location.trim(),
        images,
        image: images[0] || "",
      };

      if (editingCar.source === "Catalogue") {
        const savedOverrides = JSON.parse(
          localStorage.getItem("sheggar-catalogue-overrides") || "{}"
        );

        if (
          !savedOverrides ||
          typeof savedOverrides !== "object" ||
          Array.isArray(savedOverrides)
        ) {
          throw new Error("Invalid catalogue overrides");
        }

        const updatedOverrides = {
          ...savedOverrides,
          [String(editingCar.id)]: {
            ...(savedOverrides[String(editingCar.id)] || {}),
            ...updatedFields,
          },
        };

        localStorage.setItem(
          "sheggar-catalogue-overrides",
          JSON.stringify(updatedOverrides)
        );

        setCatalogueOverrides(updatedOverrides);
      } else {
        const savedCars = JSON.parse(
          localStorage.getItem("sheggar-cars") || "[]"
        );

        if (!Array.isArray(savedCars)) {
          throw new Error("Invalid car listings");
        }

        const exists = savedCars.some(
          (car) => String(car.id) === String(editingCar.id)
        );

        if (!exists) {
          setError("This owner listing could not be found.");
          return;
        }

        const updatedCars = savedCars.map((car) =>
          String(car.id) === String(editingCar.id)
            ? { ...car, ...updatedFields }
            : car
        );

        localStorage.setItem(
          "sheggar-cars",
          JSON.stringify(updatedCars)
        );

        setCars(updatedCars);
      }

      setEditingCar(null);
      setForm(emptyForm);
      setMessage("Car listing updated successfully.");
      setError("");
    } catch {
      setError("Could not save the car listing. Please try again.");
    }
  }

  function deleteCar(car) {
    if (car.source !== "Owner listing") {
      setError("Sample catalogue cars cannot be deleted here.");
      return;
    }

    const confirmed = window.confirm(
      `Delete "${car.name || "Unnamed car"}" ? This action cannot be undone.`
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

      if (
        editingCar &&
        String(editingCar.id) === String(car.id)
      ) {
        cancelEditing();
      }

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
              Search, edit, and manage catalogue and owner listings.
            </p>
          </div>

          <Link
            href="/admin"
            className="w-fit rounded-xl border border-white/10 px-4 py-3 text-sm font-semibold transition hover:bg-white/5"
          >
            Admin dashboard
          </Link>
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          <div className="rounded-2xl border border-white/10 bg-slate-900 p-5">
            <p className="text-sm text-slate-400">Catalogue cars</p>
            <p className="mt-2 text-3xl font-bold">{sampleCars.length}</p>
          </div>

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

        {editingCar && (
          <section className="mt-8 rounded-2xl border border-orange-400/30 bg-slate-900 p-5 sm:p-7">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold">Edit car listing</h2>
                <p className="mt-1 text-sm text-slate-400">
                  Editing: {editingCar.name} · {editingCar.source}
                </p>
              </div>

              <button
                type="button"
                onClick={cancelEditing}
                className="rounded-lg border border-white/10 px-3 py-2 text-sm hover:bg-white/5"
              >
                Cancel
              </button>
            </div>

            <form
              onSubmit={saveCar}
              className="mt-6 grid gap-5 sm:grid-cols-2"
            >
              <label className="block text-sm text-slate-300">
                Car name
                <input
                  name="name"
                  value={form.name}
                  onChange={updateForm}
                  required
                  className="mt-2 w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none focus:border-orange-400"
                />
              </label>

              <label className="block text-sm text-slate-300">
                Year
                <input
                  name="year"
                  type="number"
                  min="1900"
                  max="2100"
                  value={form.year}
                  onChange={updateForm}
                  required
                  className="mt-2 w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none focus:border-orange-400"
                />
              </label>

              <label className="block text-sm text-slate-300">
                Car type
                <input
                  name="type"
                  value={form.type}
                  onChange={updateForm}
                  placeholder="SUV, Sedan, Economy..."
                  className="mt-2 w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none focus:border-orange-400"
                />
              </label>

              <label className="block text-sm text-slate-300">
                Daily price (ETB)
                <input
                  name="price"
                  type="number"
                  min="0"
                  step="0.01"
                  value={form.price}
                  onChange={updateForm}
                  required
                  className="mt-2 w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none focus:border-orange-400"
                />
              </label>

              <label className="block text-sm text-slate-300 sm:col-span-2">
                Location
                <input
                  name="location"
                  value={form.location}
                  onChange={updateForm}
                  placeholder="Bole, Addis Ababa"
                  className="mt-2 w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none focus:border-orange-400"
                />
              </label>

              <label className="block text-sm text-slate-300 sm:col-span-2">
                Photo URLs (one URL per line)
                <textarea
                  name="imagesText"
                  value={form.imagesText}
                  onChange={updateForm}
                  rows={5}
                  placeholder={`https://example.com/car-front.jpg\nhttps://example.com/car-side.jpg`}
                  className="mt-2 w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none placeholder:text-slate-600 focus:border-orange-400"
                />
                <span className="mt-2 block text-xs text-slate-500">
                  The first URL becomes the main photo. Leave blank to remove
                  all photos.
                </span>
              </label >

              {
                form.imagesText
                  .split("\n")
                  .map((url) => url.trim())
                  .filter(Boolean).length > 0 && (
                  <div className="grid grid-cols-2 gap-3 sm:col-span-2 sm:grid-cols-4">
                    {form.imagesText
                      .split("\n")
                      .map((url) => url.trim())
                      .filter(Boolean)
                      .map((url, index) => (
                        <div key={`${url}-${index}`} className="min-w-0">
                          <div className="relative h-28 overflow-hidden rounded-xl border border-white/10 bg-slate-950">
                            {url.startsWith("https://") ||
                              url.startsWith("http://") ? (
                              <Image
                                src={url}
                                alt={`Car photo ${index + 1}`}
                                fill
                                sizes="180px"
                                unoptimized
                                className="object-cover"
                              />
                            ) : (
                              <span className="p-2 text-xs text-red-300">
                                Invalid photo URL
                              </span>
                            )}
                          </div>
                          <p className="mt-1 text-xs text-slate-400">
                            Photo {index + 1}
                            {index === 0 ? " · Main" : ""}
                          </p>
                        </div>
                      ))}
                  </div>
                )
              }

              < div className="flex flex-wrap gap-3 sm:col-span-2" >
                <button
                  type="submit"
                  className="rounded-xl bg-orange-500 px-6 py-3 font-semibold text-white transition hover:bg-orange-400"
                >
                  Save changes
                </button>

                <button
                  type="button"
                  onClick={cancelEditing}
                  className="rounded-xl border border-white/10 px-6 py-3 font-semibold transition hover:bg-white/5"
                >
                  Cancel
                </button>
              </div >
            </form >
          </section >
        )}

        <section className="mt-8 rounded-2xl border border-white/10 bg-slate-900 p-4 sm:p-6">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
            <div>
              <h2 className="text-xl font-bold">Car listings</h2>
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
            <table className="w-full min-w-[850px] text-left text-sm">
              <thead className="bg-slate-950 text-slate-400">
                <tr>
                  <th className="rounded-l-lg p-4">Image</th>
                  <th className="p-4">Car</th>
                  <th className="p-4">Source</th>
                  <th className="p-4">Owner</th>
                  <th className="p-4">Daily price</th>
                  <th className="p-4">Location</th>
                  <th className="rounded-r-lg p-4">Actions</th>
                </tr>
              </thead>

              <tbody>
                {filteredCars.length > 0 ? (
                  filteredCars.map((car, index) => (
                    <tr
                      key={`${car.source}-${car.id ?? index}`}
                      className="border-t border-white/10"
                    >
                      <td className="p-4">
                        <div className="relative h-14 w-20 overflow-hidden rounded-lg border border-white/10 bg-slate-950">
                          <Image
                            src={
                              car.images?.[0] ||
                              car.image ||
                              "/cars/car-placeholder.png"
                            }
                            alt={car.name || "Car"}
                            fill
                            sizes="80px"
                            className="object-cover"
                            loading="lazy"
                            unoptimized
                          />
                        </div>

                        {(car.images?.length || (car.image ? 1 : 0)) > 1 && (
                          <p className="mt-1 text-xs text-slate-500">
                            {car.images?.length || 1} photos
                          </p>
                        )}
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

                      <td className="p-4 text-xs text-slate-400">
                        {car.source}
                      </td>

                      <td className="p-4 text-slate-300">
                        {car.ownerEmail || "—"}
                      </td>

                      <td className="whitespace-nowrap p-4">
                        ETB {Number(car.price || 0).toLocaleString("en-US")}
                      </td>

                      <td className="p-4 text-slate-300">
                        {car.location || "Not specified"}
                      </td>

                      <td className="p-4">
                        <div className="flex gap-2">
                          <button
                            type="button"
                            onClick={() => startEditing(car)}
                            className="rounded-lg border border-orange-400/30 px-3 py-2 font-semibold text-orange-300 transition hover:bg-orange-500/10"
                          >
                            Edit
                          </button>

                          <button
                            type="button"
                            onClick={() => deleteCar(car)}
                            className="rounded-lg border border-red-500/30 px-3 py-2 font-semibold text-red-300 transition hover:bg-red-500/10"
                          >
                            Delete
                          </button>

                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={7}
                      className="p-10 text-center text-slate-400"
                    >
                      No listings match your search.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>

        <p className="mt-5 text-xs leading-5 text-slate-500">
          Catalogue and owner listings can be edited here. Owner listings can
          be deleted. This demo uses browser localStorage, so changes are not
          synchronized across devices. The client-side admin check is not
          server-side security.
        </p>
      </div >
    </main >
  );
}
