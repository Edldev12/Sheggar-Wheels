"use client";

import { use, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { cars } from "@/data/cars";

export default function BookingPage({ params }) {
  const { id } = use(params);
  const router = useRouter();
  const car = cars.find((item) => item.id === String(id));

  const [pickupDate, setPickupDate] = useState("");
  const [returnDate, setReturnDate] = useState("");
  const [error, setError] = useState("");

  const today = new Date();
  const todayString = `${today.getFullYear()}-${String(
    today.getMonth() + 1
  ).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;

  const rentalDays = useMemo(() => {
    if (!pickupDate || !returnDate) return 0;

    const start = new Date(`${pickupDate}T00:00:00`);
    const end = new Date(`${returnDate}T00:00:00`);
    const difference = Math.round((end - start) / (1000 * 60 * 60 * 24));

    return difference > 0 ? difference : 0;
  }, [pickupDate, returnDate]);

  if (!car) {
    return (
      <main className="min-h-screen bg-slate-950 px-6 py-20 text-center text-white">
        <h1 className="text-3xl font-bold">Car not found</h1>
        <Link href="/cars" className="mt-6 inline-block text-orange-400">
          Browse available cars
        </Link>
      </main>
    );
  }

  function handleBooking(event) {
    event.preventDefault();
    setError("");

    if (!pickupDate || !returnDate) {
      setError("Please select both pickup and return dates.");
      return;
    }

    if (pickupDate < todayString) {
      setError("Pickup date cannot be in the past.");
      return;
    }

    if (returnDate <= pickupDate) {
      setError("Return date must be after the pickup date.");
      return;
    }

    const booking = {
      id: `booking-${crypto.randomUUID()}`,
      carId: car.id,
      carName: car.name,
      carImage: car.image,
      pickupDate,
      returnDate,
      rentalDays,
      dailyPrice: car.price,
      totalPrice: rentalDays * car.price,
      status: "Pending",
      createdAt: new Date().toISOString(),
    };

    try {
      const existingBookings = JSON.parse(
        localStorage.getItem("sheggar-bookings") || "[]"
      );

      if (!Array.isArray(existingBookings)) {
        throw new Error("Invalid booking data");
      }

      existingBookings.push(booking);
      localStorage.setItem(
        "sheggar-bookings",
        JSON.stringify(existingBookings)
      );

      router.push(`/booking/confirmation?id=${booking.id}`);
    } catch {
      setError("Could not save your booking. Please try again.");
    }
  }

  return (
    <main className="min-h-screen bg-slate-950 px-4 py-10 text-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <Link
          href={`/cars/${car.id}`}
          className="mb-8 inline-flex text-sm text-slate-400 transition hover:text-orange-400"
        >
          ← Back to car details
        </Link>

        <div className="mb-8">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-orange-400">
            Sheggar Wheels
          </p>
          <h1 className="mt-3 text-3xl font-bold sm:text-4xl">
            Book your car
          </h1>
          <p className="mt-2 text-slate-400">
            Choose your dates and review your rental cost.
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          <form
            onSubmit={handleBooking}
            className="rounded-3xl border border-white/10 bg-slate-900 p-6 sm:p-8"
          >
            <h2 className="text-xl font-bold">Rental dates</h2>
            <p className="mt-2 text-sm text-slate-400">
              Your booking is a demonstration and does not process a real payment.
            </p>

            <div className="mt-7 grid gap-5 sm:grid-cols-2">
              <div>
                <label
                  htmlFor="pickupDate"
                  className="mb-2 block text-sm font-medium text-slate-300"
                >
                  Pickup date
                </label>
                <input
                  id="pickupDate"
                  type="date"
                  min={todayString}
                  value={pickupDate}
                  onChange={(event) => {
                    setPickupDate(event.target.value);
                    if (
                      returnDate &&
                      event.target.value >= returnDate
                    ) {
                      setReturnDate("");
                    }
                    setError("");
                  }}
                  required
                  className="w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none focus:border-orange-400"
                />
              </div>

              <div>
                <label
                  htmlFor="returnDate"
                  className="mb-2 block text-sm font-medium text-slate-300"
                >
                  Return date
                </label>
                <input
                  id="returnDate"
                  type="date"
                  min={pickupDate || todayString}
                  value={returnDate}
                  onChange={(event) => {
                    setReturnDate(event.target.value);
                    setError("");
                  }}
                  required
                  className="w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none focus:border-orange-400"
                />
              </div>
            </div>

            {error && (
              <p
                role="alert"
                className="mt-5 rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-300"
              >
                {error}
              </p>
            )}

            <div className="mt-8 rounded-2xl bg-slate-950 p-5">
              <div className="flex items-center justify-between gap-4 text-sm">
                <span className="text-slate-400">Rental duration</span>
                <span className="font-semibold">
                  {rentalDays} {rentalDays === 1 ? "day" : "days"}
                </span>
              </div>
              <div className="mt-4 flex items-center justify-between gap-4 text-sm">
                <span className="text-slate-400">Daily rate</span>
                <span>{car.price.toLocaleString()} ETB</span>
              </div>
              <div className="mt-4 border-t border-white/10 pt-4">
                <div className="flex items-center justify-between gap-4">
                  <span className="font-semibold">Estimated total</span>
                  <span className="text-2xl font-bold text-orange-400">
                    {(rentalDays * car.price).toLocaleString()} ETB
                  </span>
                </div>
              </div>
            </div>

            <button
              type="submit"
              className="mt-7 w-full rounded-xl bg-orange-500 px-5 py-4 font-bold text-white transition hover:bg-orange-400"
            >
              Confirm booking
            </button>

            <p className="mt-4 text-center text-xs text-slate-500">
              Demo only · No real payment is collected
            </p>
          </form>

          <aside className="h-fit overflow-hidden rounded-3xl border border-white/10 bg-slate-900">
            <div
              role="img"
              aria-label={car.name}
              className="h-64 bg-cover bg-center"
              style={{ backgroundImage: `url("${car.image}")` }}
            />
            <div className="p-6 sm:p-8">
              <span className="rounded-full bg-orange-500/10 px-3 py-1 text-xs font-semibold text-orange-400">
                {car.type}
              </span>
              <h2 className="mt-4 text-2xl font-bold">{car.name}</h2>
              <p className="mt-2 text-sm text-slate-400">{car.location}</p>

              <div className="mt-6 grid grid-cols-2 gap-4">
                <div className="rounded-xl bg-slate-950 p-4">
                  <p className="text-xs text-slate-500">Transmission</p>
                  <p className="mt-1 font-semibold">{car.transmission}</p>
                </div>
                <div className="rounded-xl bg-slate-950 p-4">
                  <p className="text-xs text-slate-500">Passengers</p>
                  <p className="mt-1 font-semibold">{car.seats} seats</p>
                </div>
              </div>

              <div className="mt-6 flex items-center justify-between border-t border-white/10 pt-5">
                <span className="text-sm text-slate-400">Price per day</span>
                <span className="text-lg font-bold">
                  {car.price.toLocaleString()} ETB
                </span>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}
