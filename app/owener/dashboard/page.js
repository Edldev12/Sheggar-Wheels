"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function DashboardPage() {
  const [session, setSession] = useState(null);
  const [cars, setCars] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      try {
        const savedSession = sessionStorage.getItem("sheggar-session");
        const savedCars = JSON.parse(
          localStorage.getItem("sheggar-cars") || "[]"
        );
        const savedBookings = JSON.parse(
          localStorage.getItem("sheggar-bookings") || "[]"
        );

        setSession(savedSession ? JSON.parse(savedSession) : null);
        setCars(Array.isArray(savedCars) ? savedCars : []);
        setBookings(Array.isArray(savedBookings) ? savedBookings : []);
      } catch {
        setSession(null);
        setCars([]);
        setBookings([]);
      }

      setLoaded(true);
    }, 0);

    return () => window.clearTimeout(timer);
  }, []);

  if (!loaded) {
    return <main className="p-8">Loading dashboard...</main>;
  }

  if (!session || session.role !== "owner") {
    return (
      <main className="mx-auto max-w-xl px-4 py-20 text-center">
        <h1 className="text-3xl font-bold text-slate-900">
          Owner access required
        </h1>
        <p className="mt-3 text-slate-600">
          Sign in with an owner account to view this dashboard.
        </p>
        <Link
          href="/signin"
          className="mt-6 inline-block rounded-xl bg-emerald-700 px-6 py-3 font-semibold text-white hover:bg-emerald-800"
        >
          Go to sign in
        </Link>
      </main>
    );
  }

  const ownerCars = cars.filter(
    (car) => car.ownerId === session.id || car.ownerEmail === session.email
  );

  const ownerCarIds = ownerCars.map((car) => String(car.id));

  const ownerBookings = bookings.filter(
    (booking) =>
      ownerCarIds.includes(String(booking.carId)) ||
      booking.ownerId === session.id ||
      booking.ownerEmail === session.email
  );

  const pendingBookings = ownerBookings.filter(
    (booking) => (booking.status || "Pending") === "Pending"
  );

  const totalRevenue = ownerBookings
    .filter((booking) => booking.status === "Completed")
    .reduce((total, booking) => total + Number(booking.totalPrice || 0), 0);

  const stats = [
    { label: "My cars", value: ownerCars.length },
    { label: "My bookings", value: ownerBookings.length },
    { label: "Pending requests", value: pendingBookings.length },
    { label: "Completed revenue", value: `ETB ${totalRevenue.toLocaleString()}` },
  ];

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-10 sm:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-semibold text-emerald-700">
              SHEGGAR WHEELS
            </p>
            <h1 className="mt-2 text-3xl font-bold text-slate-900">
              Owner Dashboard
            </h1>
            <p className="mt-2 text-slate-600">
              Welcome, {session.name || "Car owner"}.
            </p>
          </div>

          <Link
            href="/cars"
            className="inline-flex justify-center rounded-xl bg-emerald-700 px-5 py-3 font-semibold text-white hover:bg-emerald-800"
          >
            Browse cars
          </Link>
        </div>

        <section className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => (
            <article
              key={stat.label}
              className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
            >
              <p className="text-sm text-slate-500">{stat.label}</p>
              <p className="mt-3 text-2xl font-bold text-slate-900">
                {stat.value}
              </p>
            </article>
          ))}
        </section>

        <section className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-bold text-slate-900">Quick actions</h2>
          <div className="mt-4 flex flex-wrap gap-3">
            <Link
              href="/cars"
              className="rounded-lg bg-emerald-700 px-4 py-3 text-sm font-semibold text-white hover:bg-emerald-800"
            >
              Browse available cars
            </Link>
            <Link
              href="/admin/bookings"
              className="rounded-lg border border-slate-300 px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50"
            >
              View admin bookings
            </Link>
          </div>
          <p className="mt-4 text-sm leading-6 text-slate-500">
            This dashboard currently summarizes locally stored demo data.
            Owner-specific car management and listing creation can be added next.
          </p>
        </section>

        <section className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-bold text-slate-900">My bookings</h2>

          {ownerBookings.length === 0 ? (
            <p className="mt-4 text-sm text-slate-500">
              No bookings are linked to your cars yet.
            </p>
          ) : (
            <div className="mt-4 divide-y divide-slate-200">
              {ownerBookings.map((booking) => (
                <article
                  key={booking.id}
                  className="flex flex-col gap-2 py-4 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div>
                    <h3 className="font-semibold text-slate-900">
                      {booking.carName || "Car booking"}
                    </h3>
                    <p className="mt-1 text-sm text-slate-500">
                      {booking.pickupDate || "—"} to {booking.returnDate || "—"}
                    </p>
                  </div>
                  <div className="sm:text-right">
                    <p className="font-semibold text-slate-900">
                      ETB {Number(booking.totalPrice || 0).toLocaleString()}
                    </p>
                    <p className="mt-1 text-sm text-slate-500">
                      {booking.status || "Pending"}
                    </p>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>

        <p className="mt-6 text-xs leading-5 text-slate-500">
          Demo only: this page uses browser storage, not server-side authorization.
        </p>
      </div>
    </main>
  );
}