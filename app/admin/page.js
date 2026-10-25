"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import { cars as sampleCars } from "@/data/cars";

const navigation = [
  { label: "Dashboard", href: "/admin", icon: "▦" },
  { label: "Manage Cars", href: "/admin/cars", icon: "🚘" },
  { label: "Bookings", href: "/admin/bookings", icon: "▤" },
  { label: "Users", href: "/admin/users", icon: "♙" },
];

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
  const [error, setError] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      try {
        const savedSession = sessionStorage.getItem("sheggar-session");
        const currentSession = savedSession
          ? JSON.parse(savedSession)
          : null;

        const parseArray = (key) => {
          const value = JSON.parse(localStorage.getItem(key) || "[]");
          return Array.isArray(value) ? value : [];
        };

        const accounts = parseArray("sheggar-accounts");
        const bookings = parseArray("sheggar-bookings");
        const ownerCars = parseArray("sheggar-cars");

        const allCars = new Map();

        sampleCars.forEach((car) => {
          allCars.set(String(car.id), car);
        });

        ownerCars.forEach((car, index) => {
          const key = String(car.id ?? `owner-car-${index}`);
          allCars.set(key, car);
        });

        setSession(currentSession);
        setStats({
          cars: allCars.size,
          bookings: bookings.length,
          users: accounts.length,
          pending: bookings.filter(
            (booking) =>
              (booking.status || "Pending").toLowerCase() === "pending"
          ).length,
          revenue: bookings.reduce(
            (total, booking) =>
              total + Math.max(0, Number(booking.totalPrice) || 0),
            0
          ),
        });
      } catch {
        setSession(null);
        setError("Unable to read dashboard data from this browser.");
      } finally {
        setLoaded(true);
      }
    }, 0);

    return () => window.clearTimeout(timer);
  }, []);

  if (!loaded) {
    return (
      <main className="min-h-screen bg-slate-950 p-8 text-white">
        Loading admin dashboard...
      </main>
    );
  }

  if (!session || session.role !== "admin") {
    return (
      <main className="mx-auto max-w-xl px-4 py-20 text-center">
        <h1 className="text-3xl font-bold text-slate-900">
          Admin access required
        </h1>
        <p className="mt-3 text-slate-600">
          Sign in with an admin demo account to access this page.
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
    {
      label: "Total cars",
      value: stats.cars,
      href: "/admin/cars",
      icon: "🚘",
      color: "text-blue-600",
    },
    {
      label: "Total bookings",
      value: stats.bookings,
      href: "/admin/bookings",
      icon: "📋",
      color: "text-violet-600",
    },
    {
      label: "Registered users",
      value: stats.users,
      href: "/admin/users",
      icon: "👥",
      color: "text-emerald-600",
    },
    {
      label: "Pending bookings",
      value: stats.pending,
      href: "/admin/bookings",
      icon: "⏳",
      color: "text-orange-600",
    },
  ];

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900">
      {sidebarOpen && (
        <button
          type="button"
          aria-label="Close sidebar"
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-72 flex-col border-r border-white/10 bg-slate-950 text-white transition-transform duration-200 lg:translate-x-0 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"
          }`}
      >
        <div className="flex h-20 items-center gap-3 border-b border-white/10 px-6">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-orange-500 text-xl font-black text-white">
            S
          </div>
          <div>
            <p className="text-lg font-bold">Sheggar Wheels</p>
            <p className="text-xs text-slate-400">Administration</p>
          </div>
          <button
            type="button"
            onClick={() => setSidebarOpen(false)}
            aria-label="Close navigation"
            className="ml-auto rounded-lg px-3 py-2 text-slate-400 hover:bg-white/10 lg:hidden"
          >
            ✕
          </button>
        </div>

        <div className="px-5 py-6">
          <p className="mb-3 px-3 text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
            Main menu
          </p>

          <nav className="space-y-2">
            {navigation.map((item) => {
              const active = item.href === "/admin";

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setSidebarOpen(false)}
                  aria-current={active ? "page" : undefined}
                  className={`flex items-center gap-3 rounded-xl px-4 py-3 font-medium transition ${active
                    ? "bg-orange-500 text-white shadow-lg shadow-orange-950/30"
                    : "text-slate-300 hover:bg-white/10 hover:text-white"
                    }`}
                >
                  <span className="flex w-6 justify-center text-lg">
                    {item.icon}
                  </span>
                  {item.label}
                  {active && (
                    <span className="ml-auto h-2 w-2 rounded-full bg-white" />
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="mt-auto border-t border-white/10 p-5">
          <div className="mb-4 rounded-xl bg-white/5 p-4">
            <p className="text-xs text-slate-400">Signed in as</p>
            <p className="mt-1 truncate font-semibold">
              {session.name || "Administrator"}
            </p>
            <p className="mt-1 text-xs capitalize text-orange-400">
              {session.role}
            </p>
          </div>

          <Link
            href="/"
            className="flex items-center gap-3 rounded-xl px-4 py-3 text-slate-300 transition hover:bg-white/10 hover:text-white"
          >
            <span>↗</span>
            View website
          </Link>
        </div>
      </aside>

      <div className="min-h-screen lg:pl-72">
        <header className="sticky top-0 z-30 flex h-20 items-center justify-between border-b border-slate-200 bg-white/95 px-4 backdrop-blur sm:px-8">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setSidebarOpen(true)}
              aria-label="Open navigation"
              className="rounded-lg border border-slate-200 px-3 py-2 text-xl hover:bg-slate-100 lg:hidden"
            >
              ☰
            </button>
            <div>
              <p className="text-sm text-slate-500">Administration</p>
              <h1 className="text-xl font-bold sm:text-2xl">Dashboard</h1>
            </div>
          </div>

          <Link
            href="/"
            className="rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-700"
          >
            Visit website ↗
          </Link>
        </header>

        <main className="mx-auto max-w-7xl px-4 py-8 sm:px-8">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <p className="text-sm font-semibold uppercase tracking-wider text-orange-600">
                Sheggar Wheels
              </p>
              <h2 className="mt-2 text-3xl font-bold tracking-tight">
                Welcome back!
              </h2>
              <p className="mt-2 text-slate-500">
                Hello, {session.name || "Administrator"}. Here is your rental
                marketplace overview.
              </p>
            </div>

            <p className="text-sm text-slate-500">
              Dashboard overview
            </p>
          </div>

          {error && (
            <p
              role="alert"
              className="mt-6 rounded-xl border border-red-200 bg-red-50 p-4 text-red-700"
            >
              {error}
            </p>
          )}

          <section className="mt-8 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
            {cards.map((card) => (
              <Link
                key={card.label}
                href={card.href}
                className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:border-orange-200 hover:shadow-lg"
              >
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-slate-500">
                    {card.label}
                  </p>
                  <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-100 text-xl">
                    {card.icon}
                  </span>
                </div>
                <p className={`mt-5 text-3xl font-bold ${card.color}`}>
                  {card.value.toLocaleString()}
                </p>
                <p className="mt-4 text-sm font-semibold text-slate-500 transition group-hover:text-orange-600">
                  View details →
                </p>
              </Link>
            ))}
          </section>

          <section className="mt-8 grid gap-5 lg:grid-cols-3">
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm lg:col-span-2">
              <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-center">
                <div>
                  <h3 className="text-lg font-bold">Booking overview</h3>
                  <p className="mt-1 text-sm text-slate-500">
                    Summary of bookings saved in this browser.
                  </p>
                </div>
                <Link
                  href="/admin/bookings"
                  className="text-sm font-semibold text-orange-600 hover:text-orange-700"
                >
                  View bookings →
                </Link>
              </div>

              <div className="mt-6 rounded-xl bg-orange-50 p-5">
                <p className="text-sm font-medium text-orange-800">
                  Recorded booking totals
                </p>
                <p className="mt-2 text-3xl font-bold text-orange-700">
                  {stats.revenue.toLocaleString("en-US")} ETB
                </p>
                <p className="mt-2 text-xs leading-5 text-orange-800/80">
                  This is the sum of saved booking totals, not verified
                  payment revenue.
                </p>
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <h3 className="text-lg font-bold">Quick actions</h3>
              <p className="mt-1 text-sm text-slate-500">
                Jump to a management page.
              </p>

              <div className="mt-5 space-y-3">
                <Link
                  href="/admin/cars"
                  className="flex items-center justify-between rounded-xl border border-slate-200 p-4 font-semibold transition hover:border-orange-300 hover:bg-orange-50"
                >
                  Manage cars <span>→</span>
                </Link>
                <Link
                  href="/admin/bookings"
                  className="flex items-center justify-between rounded-xl border border-slate-200 p-4 font-semibold transition hover:border-orange-300 hover:bg-orange-50"
                >
                  Manage bookings <span>→</span>
                </Link>
                <Link
                  href="/admin/users"
                  className="flex items-center justify-between rounded-xl border border-slate-200 p-4 font-semibold transition hover:border-orange-300 hover:bg-orange-50"
                >
                  Manage users <span>→</span>
                </Link>
              </div>
            </div>
          </section>

          <p className="mt-8 text-xs leading-5 text-slate-500">
            Demo data is stored in this browser&apos;s localStorage and is not
            shared across devices. The client-side admin check is for
            demonstration only and is not server-side security.
          </p>
        </main>
      </div>
    </div>
  );
}
