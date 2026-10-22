"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { cars } from "@/data/cars";

export default function CarsPage() {
  const [search, setSearch] = useState("");
  const [type, setType] = useState("All");
  const [maxPrice, setMaxPrice] = useState("All");
  const [sort, setSort] = useState("recommended");
  const [ownerCars, setOwnerCars] = useState([]);

  useEffect(() => {
    function loadOwnerCars() {
      try {
        const saved = JSON.parse(
          localStorage.getItem("sheggar-cars") || "[]"
        );

        setOwnerCars(Array.isArray(saved) ? saved : []);
      } catch {
        setOwnerCars([]);
      }
    }

    loadOwnerCars();

    window.addEventListener("storage", loadOwnerCars);

    return () => {
      window.removeEventListener("storage", loadOwnerCars);
    };
  }, []);

  const allCars = useMemo(() => {
    return [
      ...cars,
      ...ownerCars.map((car) => ({
        ...car,
        tag: car.tag || "Owner listing",
        rating: Number(car.rating) || 0,
        year: Number(car.year),
        price: Number(car.price),
        seats: Number(car.seats),
        transmission: car.transmission || "Not specified",
        description: car.description || "Owner-provided car listing.",
      })),
    ];
  }, [ownerCars]);
  const filteredCars = useMemo(() => {
    let results = allCars.filter((car) => {
      const query = search.toLowerCase().trim();

      const matchesSearch =
        car.name.toLowerCase().includes(query) ||
        car.location.toLowerCase().includes(query) ||
        car.type.toLowerCase().includes(query);

      const matchesType = type === "All" || car.type === type;

      const matchesPrice =
        maxPrice === "All" || car.price <= Number(maxPrice);

      return matchesSearch && matchesType && matchesPrice;
    });

    if (sort === "price-low") {
      results.sort((a, b) => a.price - b.price);
    } else if (sort === "price-high") {
      results.sort((a, b) => b.price - a.price);
    } else if (sort === "rating") {
      results.sort((a, b) => b.rating - a.rating);
    }

    return results;
  }, [allCars, search, type, maxPrice, sort]);

  function clearFilters() {
    setSearch("");
    setType("All");
    setMaxPrice("All");
    setSort("recommended");
  }

  return (
    <main className="min-h-screen bg-[#f8f9fc] text-slate-900">
      <header className="border-b border-slate-200 bg-white">
        <nav className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 lg:px-8">
          <Link href="/" className="text-xl font-extrabold tracking-tight">
            🚗 Sheggar<span className="text-orange-500">Wheels</span>
          </Link>

          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="text-sm font-semibold text-slate-600 hover:text-orange-500"
            >
              Home
            </Link>
            <Link
              href="/signin"
              className="rounded-xl bg-orange-500 px-4 py-2.5 text-sm font-bold text-white hover:bg-orange-600"
            >
              Sign in
            </Link>
          </div>
        </nav>
      </header>

      <section className="bg-[#101b32] px-5 py-12 text-white sm:py-16">
        <div className="mx-auto max-w-7xl">
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-orange-400">
            Explore Addis Ababa
          </p>
          <h1 className="mt-3 text-3xl font-black sm:text-5xl">
            Find your perfect ride.
          </h1>
          <p className="mt-4 max-w-2xl leading-7 text-slate-300">
            Compare cars from our sample listings and find an option that
            matches your travel needs and budget.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-8 lg:px-8">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <label>
              <span className="mb-2 block text-sm font-bold">Search</span>
              <input
                type="search"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Car, type, or location"
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-orange-400 focus:ring-4 focus:ring-orange-100"
              />
            </label>

            <label>
              <span className="mb-2 block text-sm font-bold">Car type</span>
              <select
                value={type}
                onChange={(event) => setType(event.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-orange-400"
              >
                <option value="All">All types</option>
                <option value="Economy">Economy</option>
                <option value="Sedan">Sedan</option>
                <option value="SUV">SUV</option>
                <option value="Hatchback">Hatchback</option>
                <option value="Luxury">Luxury</option>
                <option value="Van">Van</option>
                <option value="Premium">Premium</option>
                <option value="Pickup">Pickup</option>
              </select>
            </label>

            <label>
              <span className="mb-2 block text-sm font-bold">
                Maximum daily price
              </span>
              <select
                value={maxPrice}
                onChange={(event) => setMaxPrice(event.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-orange-400"
              >
                <option value="All">Any price</option>
                <option value="2500">ETB 2,500</option>
                <option value="3000">ETB 3,000</option>
                <option value="4500">ETB 4,500</option>
                <option value="6000">ETB 6,000</option>
              </select>
            </label>

            <label>
              <span className="mb-2 block text-sm font-bold">Sort by</span>
              <select
                value={sort}
                onChange={(event) => setSort(event.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-orange-400"
              >
                <option value="recommended">Recommended</option>
                <option value="price-low">Price: low to high</option>
                <option value="price-high">Price: high to low</option>
                <option value="rating">Highest rated</option>
              </select>
            </label>
          </div>

          <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-4">
            <p className="text-sm text-slate-500">
              <strong className="text-slate-900">{filteredCars.length}</strong>{" "}
              cars found
            </p>
            <button
              type="button"
              onClick={clearFilters}
              className="text-sm font-bold text-orange-600 hover:text-orange-700"
            >
              Clear all filters
            </button>
          </div>
        </div>

        {filteredCars.length > 0 ? (
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredCars.map((car) => (
              <article
                key={car.id}
                className="group overflow-hidden rounded-2xl border border-slate-200 bg-white transition hover:-translate-y-1 hover:shadow-xl"
              >
                <div className="relative h-56 overflow-hidden bg-slate-200">
                  <div
                    role="img"
                    aria-label={car.name}
                    className="h-full w-full bg-cover bg-center transition duration-500 group-hover:scale-105"
                    style={{ backgroundImage: `url("${car.image}")` }}
                  />
                  <span className="absolute left-4 top-4 rounded-full bg-white px-3 py-1.5 text-xs font-bold shadow">
                    {car.tag}
                  </span>
                  <span className="absolute right-4 top-4 rounded-full bg-slate-900/80 px-3 py-1.5 text-xs font-bold text-white">
                    ★ {car.rating}
                  </span>
                </div>

                <div className="p-5">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h2 className="text-xl font-extrabold">{car.name}</h2>
                      <p className="mt-1 text-sm text-slate-500">
                        {car.year} · {car.type}
                      </p>
                    </div>
                    <div className="shrink-0 text-right">
                      <p className="text-lg font-black text-orange-600">
                        ETB {car.price.toLocaleString("en-US")}
                      </p>
                      <p className="text-xs text-slate-500">per day</p>
                    </div>
                  </div>

                  <p className="mt-4 text-sm text-slate-500">
                    📍 {car.location}
                  </p>

                  <div className="mt-4 flex gap-2 text-xs font-semibold text-slate-600">
                    <span className="rounded-lg bg-slate-100 px-3 py-2">
                      👥 {car.seats} seats
                    </span>
                    <span className="rounded-lg bg-slate-100 px-3 py-2">
                      ⚙ {car.transmission}
                    </span>
                  </div>

                  <p className="mt-4 text-sm leading-6 text-slate-500">
                    {car.description}
                  </p>

                  <Link
                    href={`/cars/${car.id}`}
                    className="mt-5 block rounded-xl border border-slate-200 py-3 text-center text-sm font-extrabold transition hover:border-orange-500 hover:bg-orange-50 hover:text-orange-600"
                  >
                    View car details →
                  </Link>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="mt-8 rounded-2xl border border-dashed border-slate-300 bg-white px-5 py-16 text-center">
            <p className="text-4xl">🚗</p>
            <h2 className="mt-4 text-xl font-extrabold">No cars found</h2>
            <p className="mt-2 text-slate-500">
              Try changing your search or clearing some filters.
            </p>
            <button
              type="button"
              onClick={clearFilters}
              className="mt-5 rounded-xl bg-orange-500 px-5 py-3 font-bold text-white hover:bg-orange-600"
            >
              Clear filters
            </button>
          </div>
        )}

        <p className="mt-8 text-xs leading-5 text-slate-400">
          Demo listings for the frontend capstone. Prices, ratings, and vehicle
          details are illustrative and are not live rental offers.
        </p>
      </section>

      <footer className="mt-8 border-t border-slate-200 bg-white px-5 py-8 text-center text-sm text-slate-500">
        Sheggar Wheels · Frontend capstone demo
      </footer>
    </main>
  );
}
