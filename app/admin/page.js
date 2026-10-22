
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function AdminDashboardPage() {
  const [session, setSession] = useState(null);
  const [stats, setStats] = useState({
    cars: 0,
    bookings: 0,
    users: 0,
    pending: 0,
    revenue: 0,
  });
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      try {
        const savedSession = sessionStorage.getItem("sheggar-session");
        const currentSession = savedSession
          ? JSON.parse(savedSession)
          : null;

        const savedAccounts = JSON.parse(
          localStorage.getItem("sheggar-accounts") || "[]"
        );
        const savedBookings = JSON.parse(
          localStorage.getItem("sheggar-bookings") || "[]"
        );

        const cars = JSON.parse(
          localStorage.getItem("sheggar-cars") || "[]"
        );

        setSession(currentSession);
        setStats({
          cars: Array.isArray(cars) ? cars.length : 0,
          bookings: Array.isArray(savedBookings)
            ? savedBookings.length
            : 0,
          users: Array.isArray(savedAccounts) ? savedAccounts.length : 0,
          pending: Array.isArray(savedBookings)
            ? savedBookings.filter(
              (booking) => booking.status === "Pending"
            ).length
            : 0,
          revenue: Array.isArray(savedBookings)
            ? savedBookings.reduce(
              (total, booking) =>
                total + Number(booking.totalPrice || 0),
              0
            )
            : 0,
        });
      } catch {
        setSession(null);
      }

      setLoaded(true);
    }, 0);

    return () => window.clearTimeout(timer);
  }, []);

  if (!loaded) {
    return <main className="p-8">Loading admin dashboard...</main>;
  }

  if (!session || session.role !== "admin") {
    return (
      <main className="mx-auto max-w-xl px-4 py-20 text-center">
        <h1 className="text-3xl font-bold text-slate-900">
          Admin access required
        </h1>
        <p className="mt-3 text-slate-600">
          You must sign in with an admin demo account to access this page.
        </p>
        <Link
          href="/signin"
          className="mt-6 inline-block rounded-xl bg-slate-900 px-6 py-3 font-semibold text-white"
        >
          Go to sign in
        </Link>
        <Link href="/" className="ml-4 text-emerald-700 hover:underline">
          Home
        </Link>
      </main>
    );
  }

  const cards = [
    { label: "Total cars", value: stats.cars, href: "/admin/cars" },
    {
      label: "Total bookings",
      value: stats.bookings,
      href: "/admin/bookings",
    },
    { label: "Registered users", value: stats.users, href: "/admin/users" },
    { label: "Pending bookings", value: stats.pending, href: "/admin/bookings" },
  ];

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-10 sm:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wider text-emerald-700">
              Sheggar Wheels
            </p>
            <h1 className="mt-2 text-3xl font-bold text-slate-900">
              Admin Dashboard
            </h1>
            <p className="mt-2 text-slate-600">
              Welcome, {session.name}. Manage the rental marketplace here.
            </p>
          </div>

          <Link
            href="/"
            className="inline-flex w-fit rounded-xl border border-slate-300 bg-white px-5 py-3 font-semibold text-slate-700 hover:bg-slate-100"
          >
            View website
          </Link>
        </div>

        <section className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {cards.map((card) => (
            <Link
              key={card.label}
              href={card.href}
              className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
            >
              <p className="text-sm text-slate-500">{card.label}</p>
              <p className="mt-3 text-3xl font-bold text-slate-900">
                {card.value.toLocaleString()}
              </p>
              <p className="mt-4 text-sm font-semibold text-emerald-700">
                Manage →
              </p>
            </Link>
          ))}
        </section>

        <section className="mt-8 rounded-2xl border border-slate-200 bg-white p-6">
          <h2 className="text-xl font-bold text-slate-900">
            Booking revenue summary
          </h2>
          <p className="mt-2 text-sm text-slate-500">
            Sum of recorded demo booking totals, not verified payments.
          </p>
          <p className="mt-4 text-3xl font-bold text-emerald-700">
            {stats.revenue.toLocaleString()} ETB
          </p>
        </section>

        <section className="mt-8">
          <h2 className="text-xl font-bold text-slate-900">Quick actions</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-3">
            <Link
              href="/admin/cars"
              className="rounded-xl bg-slate-900 p-5 font-semibold text-white hover:bg-slate-700"
            >
              Manage cars →
            </Link>
            <Link
              href="/admin/bookings"
              className="rounded-xl bg-slate-900 p-5 font-semibold text-white hover:bg-slate-700"
            >
              Manage bookings →
            </Link>
            <Link
              href="/admin/users"
              className="rounded-xl bg-slate-900 p-5 font-semibold text-white hover:bg-slate-700"
            >
              View users →
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}
