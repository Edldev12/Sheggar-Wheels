"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { cars as sampleCars } from "@/data/cars";

export default function CarDetailPage({ params }) {
  const [car, setCar] = useState(null);
  const [loaded, setLoaded] = useState(false);
  const [notFoundCar, setNotFoundCar] = useState(false);

  useEffect(() => {
    let active = true;

    async function loadCar() {
      try {
        const resolvedParams = await params;
        const id = String(resolvedParams.id);

        const sampleCar = sampleCars.find(
          (item) => String(item.id) === id
        );

        let ownerCars = [];

        try {
          const saved = JSON.parse(
            localStorage.getItem("sheggar-cars") || "[]"
          );

          if (Array.isArray(saved)) {
            ownerCars = saved;
          }
        } catch {
          ownerCars = [];
        }

        const ownerCar = ownerCars.find(
          (item) => String(item.id) === id
        );

        const foundCar = sampleCar || ownerCar;

        if (active) {
          setCar(
            foundCar
              ? {
                ...foundCar,
                price: Number(foundCar.price) || 0,
                year: Number(foundCar.year) || "",
                seats: Number(foundCar.seats) || 0,
                rating: Number(foundCar.rating) || 0,
                tag: foundCar.tag || "Owner listing",
                transmission:
                  foundCar.transmission || "Not specified",
                description:
                  foundCar.description || "Owner-provided car listing.",
              }
              : null
          );

          setNotFoundCar(!foundCar);
          setLoaded(true);
        }
      } catch {
        if (active) {
          setNotFoundCar(true);
          setLoaded(true);
        }
      }
    }

    loadCar();

    return () => {
      active = false;
    };
  }, [params]);

  if (!loaded) {
    return (
      <main className="p-8 text-center text-slate-600">
        Loading car details...
      </main>
    );
  }

  if (notFoundCar || !car) {
    return (
      <main className="mx-auto max-w-xl px-5 py-20 text-center">
        <h1 className="text-3xl font-black text-slate-900">
          Car not found
        </h1>
        <p className="mt-3 text-slate-600">
          This car may have been removed or is no longer available.
        </p>
        <Link
          href="/cars"
          className="mt-6 inline-block rounded-xl bg-orange-500 px-5 py-3 font-bold text-white"
        >
          Browse cars
        </Link>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f8f9fc] text-slate-900">
      <header className="border-b border-slate-200 bg-white">
        <nav className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 lg:px-8">
          <Link href="/" className="text-xl font-extrabold">
            🚗 Sheggar<span className="text-orange-500">Wheels</span>
          </Link>
          <Link
            href="/cars"
            className="text-sm font-bold text-slate-600 hover:text-orange-500"
          >
            ← Back to cars
          </Link>
        </nav>
      </header>

      <section className="mx-auto max-w-7xl px-5 py-8 lg:px-8">
        <div className="mb-6 text-sm text-slate-500">
          <Link href="/" className="hover:text-orange-500">Home</Link>
          {" / "}
          <Link href="/cars" className="hover:text-orange-500">Cars</Link>
          {" / "}
          <span className="font-semibold text-slate-800">{car.name}</span>
        </div>

        <div className="grid gap-8 lg:grid-cols-[1.5fr_1fr]">
          <div>
            <div
              role="img"
              aria-label={car.name}
              className="min-h-[300px] rounded-3xl bg-slate-200 bg-cover bg-center sm:min-h-[460px]"
              style={
                car.image
                  ? { backgroundImage: `url("${car.image}")` }
                  : undefined
              }
            />

            <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 sm:p-8">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <p className="text-sm font-bold uppercase tracking-wider text-orange-500">
                    {car.tag}
                  </p>
                  <h1 className="mt-2 text-3xl font-black sm:text-4xl">
                    {car.name}
                  </h1>
                  <p className="mt-2 text-slate-500">
                    {car.year} · {car.type}
                  </p>
                </div>
                <span className="rounded-xl bg-orange-50 px-4 py-2 font-extrabold text-orange-600">
                  ★ {car.rating || "New"}
                </span>
              </div>

              <p className="mt-6 leading-7 text-slate-600">
                {car.description}
              </p>

              <div className="mt-7 grid grid-cols-2 gap-4 sm:grid-cols-3">
                {[
                  ["👥", "Seats", `${car.seats} passengers`],
                  ["⚙️", "Transmission", car.transmission],
                  ["🚘", "Vehicle type", car.type],
                  ["📅", "Model year", String(car.year)],
                  ["📍", "Location", car.location],
                  ["⭐", "Rating", car.rating ? `${car.rating} / 5` : "Not rated"],
                ].map(([icon, label, value]) => (
                  <div key={label} className="rounded-xl bg-slate-50 p-4">
                    <span className="text-xl">{icon}</span>
                    <p className="mt-3 text-xs font-semibold text-slate-500">
                      {label}
                    </p>
                    <p className="mt-1 text-sm font-extrabold">{value}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <aside>
            <div className="sticky top-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
              <p className="text-sm font-semibold text-slate-500">
                Rental price
              </p>
              <div className="mt-2 flex items-baseline gap-2">
                <span className="text-3xl font-black text-orange-600">
                  ETB {car.price.toLocaleString("en-US")}
                </span>
                <span className="text-sm text-slate-500">/ day</span>
              </div>

              <div className="my-6 border-t border-slate-100" />

              <div className="space-y-4 text-sm">
                <div className="flex items-center justify-between gap-3">
                  <span className="text-slate-500">Vehicle</span>
                  <span className="font-bold">{car.name}</span>
                </div>
                <div className="flex items-center justify-between gap-3">
                  <span className="text-slate-500">Pickup area</span>
                  <span className="text-right font-bold">{car.location}</span>
                </div>
                <div className="flex items-center justify-between gap-3">
                  <span className="text-slate-500">Transmission</span>
                  <span className="font-bold">{car.transmission}</span>
                </div>
              </div>

              <Link
                href={`/booking/${car.id}`}
                className="mt-7 block rounded-xl bg-orange-500 px-5 py-4 text-center font-extrabold text-white transition hover:bg-orange-600"
              >
                Continue to booking →
              </Link>

              <p className="mt-4 text-center text-xs leading-5 text-slate-400">
                Capstone demo listing. Availability and rental prices are
                illustrative and must be confirmed in the demo flow.
              </p>

              <Link
                href="/cars"
                className="mt-4 block text-center text-sm font-bold text-slate-600 hover:text-orange-500"
              >
                Browse other cars
              </Link>
            </div>
          </aside>
        </div>
      </section>

      <footer className="border-t border-slate-200 bg-white px-5 py-7 text-center text-sm text-slate-500">
        Sheggar Wheels · Frontend capstone demo
      </footer>
    </main>
  );
}