"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

const ownerLinks = [
  {
    title: "My Cars",
    description: "Add, edit, delete, and manage your car listings.",
    href: "/owener/dashboard/cars",
    icon: "🚘",
  },
  {
    title: "My Bookings",
    description: "Review requests and manage rental statuses.",
    href: "/owener/dashboard/bookings",
    icon: "📅",
  },
  {
    title: "Earnings & Reports",
    description: "Review completed revenue and booking activity.",
    href: "/owener/dashboard/earnings",
    icon: "📊",
  },
  {
    title: "My Profile",
    description: "Update your name and phone number.",
    href: "/owener/dashboard/profile",
    icon: "👤",
  },
];

export default function DashboardPage() {
  const router = useRouter();
  const [session, setSession] = useState(null);
  const [cars, setCars] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      try {
        const savedSession = sessionStorage.getItem("sheggar-session");
        const currentSession = savedSession
          ? JSON.parse(savedSession)
          : null;

        if (!currentSession || currentSession.role !== "owner") {
          router.replace("/signin");
          setLoaded(true);
          return;
        }

        const savedCars = JSON.parse(
          localStorage.getItem("sheggar-cars") || "[]"
        );
        const savedBookings = JSON.parse(
          localStorage.getItem("sheggar-bookings") || "[]"
        );

        setSession(currentSession);
        setCars(Array.isArray(savedCars) ? savedCars : []);
        setBookings(Array.isArray(savedBookings) ? savedBookings : []);
      } catch {
        setSession(null);
        setCars([]);
        setBookings([]);
        router.replace("/signin");
      } finally {
        setLoaded(true);
      }
    }, 0);

    return () => window.clearTimeout(timer);
  }, [router]);

  if (!loaded) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-50 p-8">
        <p className="text-slate-600">Loading owner dashboard...</p>
      </main>
    );
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

  const ownerEmail = session.email?.toLowerCase();

  const ownerCars = cars.filter(
    (car) =>
      (session.id != null && car.ownerId === session.id) ||
      (ownerEmail && car.ownerEmail?.toLowerCase() === ownerEmail)
  );

  const ownerCarIds = ownerCars.map((car) => String(car.id));

  const ownerBookings = bookings.filter(
    (booking) =>
      ownerCarIds.includes(String(booking.carId)) ||
      (session.id != null && booking.ownerId === session.id) ||
      (ownerEmail && booking.ownerEmail?.toLowerCase() === ownerEmail)
  );

  const pendingBookings = ownerBookings.filter(
    (booking) => (booking.status || "Pending") === "Pending"
  );

  const totalRevenue = ownerBookings
    .filter((booking) => booking.status === "Completed")
    .reduce(
      (total, booking) => total + Number(booking.totalPrice || 0),
      0
    );

  const stats = [
    { label: "My cars", value: ownerCars.length },
    { label: "My bookings", value: ownerBookings.length },
    { label: "Pending requests", value: pendingBookings.length },
    {
      label: "Completed revenue",
      value: `ETB ${totalRevenue.toLocaleString()}`,
    },
  ];

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-10 sm:px-8">
      <div className="mx-auto max-w-6xl">
        <header className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-semibold tracking-widest text-emerald-700">
              SHEGGAR WHEELS
            </p>
            <h1 className="mt-2 text-3xl font-bold text-slate-900 sm:text-4xl">
              Owner Dashboard
            </h1>
            <p className="mt-2 text-slate-600">
              Welcome, {session.name || "Car owner"}.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link
              href="/cars"
              className="rounded-xl border border-slate-300 px-5 py-3 font-semibold text-slate-700 hover:bg-white"
            >
              Browse cars
            </Link>
            <button
              type="button"
              onClick={() => {
                sessionStorage.removeItem("sheggar-session");
                router.replace("/signin");
              }}
              className="rounded-xl bg-slate-900 px-5 py-3 font-semibold text-white hover:bg-slate-800"
            >
              Sign out
            </button>
          </div>
        </header>

        <section className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => (
            <article
              key={stat.label}
              className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
            >
              <p className="text-sm text-slate-500">{stat.label}</p>
              <p className="mt-3 break-words text-2xl font-bold text-slate-900">
                {stat.value}
              </p>
            </article>
          ))}
        </section>

        <section className="mt-10">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">
              Manage your business
            </h2>
            <p className="mt-2 text-slate-600">
              Choose an owner section to continue.
            </p>
          </div>

          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            {ownerLinks.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:border-emerald-300 hover:shadow-md"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 group-hover:text-emerald-700">
                      {item.title}
                    </h3>
                    <p className="mt-2 text-sm leading-6 text-slate-600">
                      {item.description}
                    </p>
                  </div>
                  <span className="text-3xl" aria-hidden="true">
                    {item.icon}
                  </span>
                </div>
                <p className="mt-5 text-sm font-semibold text-emerald-700">
                  Open section →
                </p>
              </Link>
            ))}
          </div>
        </section>

        <section className="mt-10 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
            <div>
              <h2 className="text-xl font-bold text-slate-900">
                Recent bookings
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                Booking requests linked to your listed cars.
              </p>
            </div>
            <Link
              href="/owener/dashboard/bookings"
              className="text-sm font-semibold text-emerald-700 hover:text-emerald-800"
            >
              View all bookings →
            </Link>
          </div>

          {ownerBookings.length === 0 ? (
            <p className="mt-5 rounded-xl bg-slate-50 p-5 text-sm text-slate-500">
              No bookings are linked to your cars yet.
            </p>
          ) : (
            <div className="mt-4 divide-y divide-slate-200">
              {[...ownerBookings]
                .sort(
                  (a, b) =>
                    new Date(b.createdAt || 0) -
                    new Date(a.createdAt || 0)
                )
                .slice(0, 5)
                .map((booking) => (
                  <article
                    key={booking.id}
                    className="flex flex-col gap-2 py-4 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div>
                      <h3 className="font-semibold text-slate-900">
                        {booking.carName || "Car booking"}
                      </h3>
                      <p className="mt-1 text-sm text-slate-500">
                        {booking.pickupDate || "—"} to{" "}
                        {booking.returnDate || "—"}
                      </p>
                    </div>
                    <div className="sm:text-right">
                      <p className="font-semibold text-slate-900">
                        ETB{" "}
                        {Number(booking.totalPrice || 0).toLocaleString()}
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
          Demo mode: data is stored in this browser. These client-side checks
          are not a substitute for server-side authorization.
        </p>
      </div>
    </main>
  );
}
