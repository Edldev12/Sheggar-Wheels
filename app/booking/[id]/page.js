
"use client";

import BookingMapLoader from "@/components/BookingMapLoader";
import { use, useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { cars } from "@/data/cars";

export default function BookingPage({ params }) {
  const { id } = use(params);
  const router = useRouter();

  const [session, setSession] = useState(null);
  const [sessionLoaded, setSessionLoaded] = useState(false);

  const [ownerCars, setOwnerCars] = useState([]);
  const [ownerCarsLoaded, setOwnerCarsLoaded] = useState(false);

  const [locationSearchLoading, setLocationSearchLoading] = useState(false);
  const [pickupDate, setPickupDate] = useState("");
  const [returnDate, setReturnDate] = useState("");
  const [phone, setPhone] = useState("");
  const [pickupLocation, setPickupLocation] = useState("");
  const [pickupCoordinates, setPickupCoordinates] = useState(null);
  const [returnLocation, setReturnLocation] = useState("");
  const [error, setError] = useState("");

  // Load the current session after the component mounts.
  useEffect(() => {
    const timer = window.setTimeout(() => {
      try {
        const savedSession = sessionStorage.getItem("sheggar-session");
        setSession(savedSession ? JSON.parse(savedSession) : null);
      } catch {
        setSession(null);
      }

      setSessionLoaded(true);
    }, 0);

    return () => window.clearTimeout(timer);
  }, []);

  // Load owner-created cars from localStorage after mounting.
  useEffect(() => {
    const timer = window.setTimeout(() => {
      try {
        const savedCars = JSON.parse(
          localStorage.getItem("sheggar-cars") || "[]"
        );

        setOwnerCars(Array.isArray(savedCars) ? savedCars : []);
      } catch {
        setOwnerCars([]);
      }

      setOwnerCarsLoaded(true);
    }, 0);

    return () => window.clearTimeout(timer);
  }, []);

  // Prefer an owner-created car, then fall back to the sample cars.
  const car = useMemo(() => {
    if (!ownerCarsLoaded) return null;

    const ownerCar = ownerCars.find(
      (item) => String(item.id) === String(id)
    );

    if (ownerCar) {
      return {
        ...ownerCar,
        type: ownerCar.type || ownerCar.category || "",
        category: ownerCar.category || ownerCar.type || "",
        image: ownerCar.image || ownerCar.images?.[0] || "",
      };
    }

    return cars.find((item) => String(item.id) === String(id)) || null;
  }, [id, ownerCars, ownerCarsLoaded]);

  const todayString = useMemo(() => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
  }, []);

  const rentalDays = useMemo(() => {
    if (!pickupDate || !returnDate) return 0;

    const start = new Date(`${pickupDate}T00:00:00`);
    const end = new Date(`${returnDate}T00:00:00`);
    const difference = end.getTime() - start.getTime();

    if (difference <= 0) return 0;

    return Math.ceil(difference / (1000 * 60 * 60 * 24));
  }, [pickupDate, returnDate]);

  const totalPrice = rentalDays * Number(car?.price || 0);

  async function findPickupLocation() {
    const query = pickupLocation.trim();

    if (!query) {
      setError("Enter a pickup address first.");
      return;
    }

    setError("");
    setLocationSearchLoading(true);

    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=jsonv2&limit=1&countrycodes=et&q=${encodeURIComponent(query)}`
      );

      if (!response.ok) {
        throw new Error("Location search failed.");
      }

      const results = await response.json();

      if (!results.length) {
        setError("Location not found. Try a more specific address.");
        return;
      }

      const result = results[0];
      const latitude = Number(result.lat);
      const longitude = Number(result.lon);

      setPickupLocation(result.display_name);
      setPickupCoordinates({ latitude, longitude });
    } catch {
      setError(
        "Could not find the location. Check your internet and try again."
      );
    } finally {
      setLocationSearchLoading(false);
    }
  }

  function handleBooking(event) {
    event.preventDefault();
    setError("");

    let currentSession = session;

    try {
      const savedSession = sessionStorage.getItem("sheggar-session");
      currentSession = savedSession ? JSON.parse(savedSession) : null;
    } catch {
      currentSession = null;
    }

    if (!currentSession) {
      router.push(`/signin?next=${encodeURIComponent(`/booking/${id}`)}`);
      return;
    }

    if (!car) {
      setError("This car is no longer available.");
      return;
    }

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

    if (!phone.trim() || !pickupLocation.trim() || !returnLocation.trim()) {
      setError("Please complete your phone number and both locations.");
      return;
    }

    if (!pickupCoordinates) {
      setError("Please select your pickup point on the map.");
      return;
    }

    if (rentalDays < 1) {
      setError("Please select valid rental dates.");
      return;
    }

    const dailyPrice = Number(car.price);

    if (!Number.isFinite(dailyPrice) || dailyPrice <= 0) {
      setError("This car has an invalid rental price.");
      return;
    }

    const booking = {
      id: `booking-${Date.now()}`,
      carId: String(car.id),
      carName: car.name,
      carImage: car.image || car.images?.[0] || "",
      dailyPrice,
      pricePerDay: dailyPrice,
      pickupDate,
      returnDate,
      rentalDays,
      totalPrice: rentalDays * dailyPrice,
      phone: phone.trim(),
      pickupLocation: pickupLocation.trim(),
      pickupCoordinates,
      returnLocation: returnLocation.trim(),
      status: "Pending",
      createdAt: new Date().toISOString(),
      customer: currentSession,
      ownerId: car.ownerId || null,
      ownerEmail: car.ownerEmail || null,
    };

    try {
      const savedBookings = JSON.parse(
        localStorage.getItem("sheggar-bookings") || "[]"
      );

      const bookings = Array.isArray(savedBookings) ? savedBookings : [];

      bookings.push(booking);

      localStorage.setItem("sheggar-bookings", JSON.stringify(bookings));

      router.push(
        `/booking/confirmation?id=${encodeURIComponent(booking.id)}`
      );
    } catch {
      setError("Unable to save your booking. Please try again.");
    }
  }

  if (!ownerCarsLoaded) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-950 text-white">
        <p className="text-slate-400">Loading car details...</p>
      </main>
    );
  }

  if (!car) {
    return (
      <main className="min-h-screen bg-slate-950 px-6 py-20 text-white">
        <div className="mx-auto max-w-2xl text-center">
          <h1 className="text-3xl font-bold">Car not found</h1>
          <p className="mt-3 text-slate-400">
            The car you selected may no longer be available.
          </p>
          <Link
            href="/cars"
            className="mt-6 inline-block rounded-xl bg-orange-500 px-6 py-3 font-semibold text-white hover:bg-orange-600"
          >
            Browse cars
          </Link>
        </div>
      </main>
    );
  }

  if (!sessionLoaded) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-950 text-white">
        <p className="text-slate-400">Loading booking form...</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-950 px-4 py-10 text-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <Link
          href="/cars"
          className="mb-6 inline-flex items-center gap-2 text-sm text-slate-400 transition hover:text-orange-400"
        >
          ← Back to cars
        </Link>

        <div className="mb-8">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-orange-400">
            Sheggar Wheels
          </p>
          <h1 className="mt-2 text-3xl font-bold sm:text-4xl">
            Book your car
          </h1>
          <p className="mt-3 text-slate-400">
            Complete your rental details and choose your pickup point on the map.
          </p>
        </div>

        <div className="grid items-start gap-8 lg:grid-cols-[1fr_380px]">
          <form
            onSubmit={handleBooking}
            className="space-y-7 rounded-3xl border border-white/10 bg-slate-900/70 p-5 sm:p-8"
          >
            <section>
              <h2 className="text-xl font-bold">Rental dates</h2>

              <div className="mt-5 grid gap-5 sm:grid-cols-2">
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
            </section>

            <section className="border-t border-white/10 pt-7">
              <h2 className="text-xl font-bold">Contact information</h2>

              <div className="mt-5">
                <label
                  htmlFor="phone"
                  className="mb-2 block text-sm font-medium text-slate-300"
                >
                  Phone number
                </label>
                <input
                  id="phone"
                  type="tel"
                  value={phone}
                  onChange={(event) => setPhone(event.target.value)}
                  placeholder="Enter your phone number"
                  required
                  className="w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none placeholder:text-slate-500 focus:border-orange-400"
                />
              </div>
            </section>

            <section className="border-t border-white/10 pt-7">
              <h2 className="text-xl font-bold">Pickup and return</h2>
              <p className="mt-2 text-sm text-slate-400">
                Enter your locations, then click the map to select the exact
                pickup point.
              </p>

              <div className="mt-5 grid gap-5 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor="pickupLocation"
                    className="mb-2 block text-sm font-medium text-slate-300"
                  >
                    Pickup address
                  </label>
                  <input
                    id="pickupLocation"
                    type="text"
                    value={pickupLocation}
                    onChange={(event) => {
                      setPickupLocation(event.target.value);
                      setPickupCoordinates(null);
                      setError("");
                    }}
                    placeholder="e.g. Bole, Addis Ababa"
                    required
                    className="w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none placeholder:text-slate-500 focus:border-orange-400"
                  />

                  <button
                    type="button"
                    onClick={findPickupLocation}
                    disabled={locationSearchLoading}
                    className="mt-3 rounded-xl bg-orange-500 px-4 py-2 text-sm font-semibold text-white hover:bg-orange-600 disabled:opacity-60"
                  >
                    {locationSearchLoading
                      ? "Finding location..."
                      : "Find location"}
                  </button>
                </div>

                <div>
                  <label
                    htmlFor="returnLocation"
                    className="mb-2 block text-sm font-medium text-slate-300"
                  >
                    Return address
                  </label>
                  <input
                    id="returnLocation"
                    type="text"
                    value={returnLocation}
                    onChange={(event) => setReturnLocation(event.target.value)}
                    placeholder="Enter return address"
                    required
                    className="w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none placeholder:text-slate-500 focus:border-orange-400"
                  />
                </div>

                <div className="sm:col-span-2">
                  <BookingMapLoader
                    selectedPosition={
                      pickupCoordinates
                        ? [
                          pickupCoordinates.latitude,
                          pickupCoordinates.longitude,
                        ]
                        : undefined
                    }
                    onLocationSelect={({ latitude, longitude }) => {
                      setPickupCoordinates({ latitude, longitude });
                      setError("");
                    }}
                  />

                  {pickupCoordinates && (
                    <p className="mt-3 text-sm text-slate-400">
                      Selected coordinates:{" "}
                      {pickupCoordinates.latitude.toFixed(6)},{" "}
                      {pickupCoordinates.longitude.toFixed(6)}
                    </p>
                  )}
                </div>
              </div>
            </section>

            {error && (
              <div
                role="alert"
                className="rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-300"
              >
                {error}
              </div>
            )}

            <button
              type="submit"
              className="w-full rounded-xl bg-orange-500 px-6 py-4 font-bold text-white transition hover:bg-orange-600"
            >
              Confirm booking
            </button>

            <p className="text-center text-xs text-slate-500">
              Please verify your rental dates and locations before confirming.
            </p>
          </form>

          <aside className="overflow-hidden rounded-3xl border border-white/10 bg-slate-900/70">
            <div className="relative h-56">
              {car.image ? (
                <Image
                  src={car.image}
                  alt={car.name}
                  fill
                  sizes="(max-width: 1024px) 100vw, 380px"
                  className="object-cover"
                  unoptimized
                />
              ) : (
                <div className="flex h-full items-center justify-center bg-slate-800 text-slate-400">
                  No car image available
                </div>
              )}
            </div>

            <div className="p-6">
              <p className="text-sm font-semibold uppercase tracking-wider text-orange-400">
                Your selected car
              </p>

              <h2 className="mt-2 text-2xl font-bold">{car.name}</h2>

              <div className="mt-4 flex flex-wrap gap-2 text-xs text-slate-300">
                {(car.category || car.type) && (
                  <span className="rounded-full bg-white/5 px-3 py-2">
                    {car.category || car.type}
                  </span>
                )}
                {car.transmission && (
                  <span className="rounded-full bg-white/5 px-3 py-2">
                    {car.transmission}
                  </span>
                )}
                {car.seats && (
                  <span className="rounded-full bg-white/5 px-3 py-2">
                    {car.seats} seats
                  </span>
                )}
              </div>

              <div className="mt-6 border-t border-white/10 pt-5">
                <div className="flex items-center justify-between text-sm text-slate-400">
                  <span>Price per day</span>
                  <span>ETB {Number(car.price).toLocaleString()}</span>
                </div>

                <div className="mt-3 flex items-center justify-between text-sm text-slate-400">
                  <span>Rental duration</span>
                  <span>
                    {rentalDays} {rentalDays === 1 ? "day" : "days"}
                  </span>
                </div>

                <div className="mt-5 flex items-center justify-between border-t border-white/10 pt-5">
                  <span className="font-semibold">Total price</span>
                  <span className="text-2xl font-bold text-orange-400">
                    ETB {totalPrice.toLocaleString()}
                  </span>
                </div>

                {!rentalDays && (
                  <p className="mt-3 text-xs text-slate-500">
                    Select your pickup and return dates to calculate the total.
                  </p>
                )}
              </div>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}
