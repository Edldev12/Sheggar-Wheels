
"use client";

import { use, useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { cars } from "@/data/cars";

export default function BookingPage({ params }) {
  const { id } = use(params);
  const router = useRouter();

  const car = cars.find((item) => String(item.id) === String(id));

  const [session, setSession] = useState(null);
  const [sessionLoaded, setSessionLoaded] = useState(false);
  const [pickupDate, setPickupDate] = useState("");
  const [returnDate, setReturnDate] = useState("");
  const [phone, setPhone] = useState("");
  const [pickupLocation, setPickupLocation] = useState("");
  const [returnLocation, setReturnLocation] = useState("");
  const [error, setError] = useState("");

  const todayString = useMemo(() => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
  }, []);

  const rentalDays = useMemo(() => {
    if (!pickupDate || !returnDate) return 0;

    const start = new Date(`${pickupDate}T00:00:00`);
    const end = new Date(`${returnDate}T00:00:00`);
    const difference = end.getTime() - start.getTime();

    return difference > 0
      ? Math.ceil(difference / (1000 * 60 * 60 * 24))
      : 0;
  }, [pickupDate, returnDate]);

  // Load the session after the component mounts.
  useEffect(() => {
    const timer = window.setTimeout(() => {
      try {
        const savedSession = JSON.parse(
          sessionStorage.getItem("sheggar-session") || "null"
        );

        if (savedSession?.id && savedSession?.email) {
          setSession(savedSession);
        } else {
          setSession(null);
        }
      } catch {
        setSession(null);
      } finally {
        setSessionLoaded(true);
      }
    }, 0);

    return () => window.clearTimeout(timer);
  }, []);

  function handleBooking(event) {
    event.preventDefault();
    setError("");

    if (!car) {
      setError("This car could not be found.");
      return;
    }

    let currentSession = null;

    try {
      currentSession = JSON.parse(
        sessionStorage.getItem("sheggar-session") || "null"
      );
    } catch {
      currentSession = null;
    }

    if (!currentSession?.id || !currentSession?.email) {
      router.push(
        `/signin?next=${encodeURIComponent(`/booking/${car.id}`)}`
      );
      return;
    }

    if (!pickupDate || !returnDate) {
      setError("Please select your pickup and return dates.");
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

    if (
      !phone.trim() ||
      !pickupLocation.trim() ||
      !returnLocation.trim()
    ) {
      setError("Please complete your phone number and both locations.");
      return;
    }

    if (!rentalDays || !Number.isFinite(Number(car.price))) {
      setError("Please check the rental dates and car price.");
      return;
    }

    const booking = {
      id: crypto.randomUUID(),
      userId: currentSession.id,
      userName: currentSession.name || "",
      userEmail: currentSession.email,
      phone: phone.trim(),
      carId: car.id,
      carName: car.name,
      carImage: car.image || "",
      pickupDate,
      returnDate,
      pickupLocation: pickupLocation.trim(),
      returnLocation: returnLocation.trim(),
      rentalDays,
      dailyPrice: Number(car.price),
      totalPrice: rentalDays * Number(car.price),
      status: "Pending",
      createdAt: new Date().toISOString(),
    };

    try {
      const savedBookings = JSON.parse(
        localStorage.getItem("sheggar-bookings") || "[]"
      );

      if (!Array.isArray(savedBookings)) {
        throw new Error("Invalid bookings data.");
      }

      savedBookings.push(booking);

      localStorage.setItem(
        "sheggar-bookings",
        JSON.stringify(savedBookings)
      );

      router.push(
        `/booking/confirmation?id=${encodeURIComponent(booking.id)}`
      );
    } catch {
      setError("Could not save your booking. Please try again.");
    }
  }

  if (!car) {
    return (
      <main className="min-h-screen bg-slate-950 px-6 py-20 text-white">
        <div className="mx-auto max-w-2xl text-center">
          <h1 className="text-3xl font-bold">Car not found</h1>
          <p className="mt-3 text-slate-400">
            This car may have been removed from the catalogue.
          </p>
          <Link
            href="/cars"
            className="mt-6 inline-block rounded-xl bg-orange-500 px-6 py-3 font-semibold text-white hover:bg-orange-400"
          >
            Browse cars
          </Link>
        </div>
      </main>
    );
  }

  if (!sessionLoaded) {
    return (
      <main className="min-h-screen bg-slate-950 p-10 text-white">
        <p className="text-center text-slate-300">
          Loading booking details...
        </p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-950 px-4 py-10 text-white sm:px-6 lg:py-16">
      <div className="mx-auto max-w-6xl">
        <Link
          href={`/cars/${car.id}`}
          className="text-sm text-orange-400 hover:text-orange-300"
        >
          ← Back to car details
        </Link>

        <div className="mb-8 mt-6">
          <h1 className="text-3xl font-bold sm:text-4xl">
            Book your car
          </h1>
          <p className="mt-2 text-slate-400">
            Complete the details below to request your rental.
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-[1fr_380px]">
          <form
            onSubmit={handleBooking}
            className="rounded-2xl border border-white/10 bg-slate-900 p-5 sm:p-8"
          >
            <section>
              <h2 className="text-xl font-bold">Renter information</h2>
              <p className="mt-1 text-sm text-slate-400">
                Your account details are used for this booking.
              </p>

              <div className="mt-5 grid gap-5 sm:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm text-slate-300">
                    Full name
                  </label>
                  <input
                    type="text"
                    value={session?.name || ""}
                    readOnly
                    placeholder="Sign in to load your name"
                    className="w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm text-slate-300">
                    Email address
                  </label>
                  <input
                    type="email"
                    value={session?.email || ""}
                    readOnly
                    placeholder="Sign in to load your email"
                    className="w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label
                    htmlFor="phone"
                    className="mb-2 block text-sm text-slate-300"
                  >
                    Phone number
                  </label>
                  <input
                    id="phone"
                    type="tel"
                    autoComplete="tel"
                    value={phone}
                    onChange={(event) => setPhone(event.target.value)}
                    placeholder="Enter your phone number"
                    required
                    className="w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none focus:border-orange-500"
                  />
                </div>
              </div>
            </section>

            <div className="my-8 border-t border-white/10" />

            <section>
              <h2 className="text-xl font-bold">Pickup and return</h2>

              <div className="mt-5 grid gap-5 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor="pickupLocation"
                    className="mb-2 block text-sm text-slate-300"
                  >
                    Pickup location
                  </label>
                  <input
                    id="pickupLocation"
                    type="text"
                    value={pickupLocation}
                    onChange={(event) =>
                      setPickupLocation(event.target.value)
                    }
                    placeholder="e.g. Sar Bet, Addis Ababa"
                    required
                    className="w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none focus:border-orange-500"
                  />
                </div>

                <div>
                  <label
                    htmlFor="returnLocation"
                    className="mb-2 block text-sm text-slate-300"
                  >
                    Return location
                  </label>
                  <input
                    id="returnLocation"
                    type="text"
                    value={returnLocation}
                    onChange={(event) =>
                      setReturnLocation(event.target.value)
                    }
                    placeholder="Enter return location"
                    required
                    className="w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none focus:border-orange-500"
                  />
                </div>
              </div>
            </section>

            <div className="my-8 border-t border-white/10" />

            <section>
              <h2 className="text-xl font-bold">Rental dates</h2>

              <div className="mt-5 grid gap-5 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor="pickupDate"
                    className="mb-2 block text-sm text-slate-300"
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
                      setError("");
                    }}
                    required
                    className="w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none [color-scheme:dark] focus:border-orange-500"
                  />
                </div>

                <div>
                  <label
                    htmlFor="returnDate"
                    className="mb-2 block text-sm text-slate-300"
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
                    className="w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none [color-scheme:dark] focus:border-orange-500"
                  />
                </div>
              </div>
            </section>

            {error && (
              <div
                role="alert"
                className="mt-6 rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-300"
              >
                {error}
              </div>
            )}

            <section className="mt-8 rounded-2xl bg-slate-950 p-5">
              <div className="flex items-center justify-between gap-4 text-sm">
                <span className="text-slate-400">Rental duration</span>
                <span className="font-semibold">
                  {rentalDays} {rentalDays === 1 ? "day" : "days"}
                </span>
              </div>

              <div className="mt-4 flex items-center justify-between gap-4 text-sm">
                <span className="text-slate-400">Daily rate</span>
                <span>
                  {Number(car.price).toLocaleString()} ETB
                </span>
              </div>

              <div className="mt-4 flex items-center justify-between gap-4 border-t border-white/10 pt-4">
                <span className="font-semibold">Estimated total</span>
                <span className="text-2xl font-bold text-orange-400">
                  {(rentalDays * Number(car.price)).toLocaleString()} ETB
                </span>
              </div>
            </section>

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

          <aside className="h-fit overflow-hidden rounded-2xl border border-white/10 bg-slate-900">
            <div className="relative h-56 bg-slate-800">
              {car.image && (
                <Image
                  src={car.image}
                  alt={car.name}
                  fill
                  sizes="(max-width: 1024px) 100vw, 380px"
                  className="object-cover"
                  unoptimized
                />
              )}
            </div>

            <div className="p-6">
              <p className="text-sm text-orange-400">
                {car.category || "Rental car"}
              </p>

              <h2 className="mt-2 text-2xl font-bold">{car.name}</h2>

              <div className="mt-4 flex flex-wrap gap-2 text-xs text-slate-300">
                {car.transmission && (
                  <span className="rounded-full bg-slate-800 px-3 py-2">
                    {car.transmission}
                  </span>
                )}

                {car.seats && (
                  <span className="rounded-full bg-slate-800 px-3 py-2">
                    {car.seats} seats
                  </span>
                )}

                {car.fuelType && (
                  <span className="rounded-full bg-slate-800 px-3 py-2">
                    {car.fuelType}
                  </span>
                )}
              </div>

              <div className="mt-6 border-t border-white/10 pt-5">
                <p className="text-sm text-slate-400">Price per day</p>
                <p className="mt-1 text-3xl font-bold">
                  {Number(car.price).toLocaleString()}{" "}
                  <span className="text-base font-medium text-slate-400">
                    ETB/day
                  </span>
                </p>
              </div>

              <div className="mt-5 rounded-xl bg-slate-950 p-4">
                <p className="text-sm text-slate-400">Booking estimate</p>
                <p className="mt-1 text-xl font-bold text-orange-400">
                  {(rentalDays * Number(car.price)).toLocaleString()} ETB
                </p>
                <p className="mt-1 text-xs text-slate-500">
                  {rentalDays > 0
                    ? `For ${rentalDays} ${rentalDays === 1 ? "day" : "days"
                    }`
                    : "Choose your dates to calculate the total"}
                </p>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}
