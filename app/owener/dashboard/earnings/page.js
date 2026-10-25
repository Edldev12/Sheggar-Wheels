
"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function OwnerEarningsPage() {
  const router = useRouter();

  const [session, setSession] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      try {
        const savedSession = sessionStorage.getItem("sheggar-session");
        const account = savedSession ? JSON.parse(savedSession) : null;

        if (!account || account.role !== "owner") {
          router.replace("/signin");
          return;
        }

        setSession(account);

        const savedCars = JSON.parse(
          localStorage.getItem("sheggar-cars") || "[]"
        );

        const ownerCars = Array.isArray(savedCars)
          ? savedCars.filter(
            (car) =>
              car.ownerId === account.id ||
              (car.ownerEmail &&
                car.ownerEmail.toLowerCase() ===
                account.email?.toLowerCase())
          )
          : [];

        const ownerCarIds = ownerCars.map((car) => String(car.id));

        const savedBookings = JSON.parse(
          localStorage.getItem("sheggar-bookings") || "[]"
        );

        // Only count bookings connected to this owner's cars.
        const ownerBookings = Array.isArray(savedBookings)
          ? savedBookings.filter(
            (booking) =>
              booking.carId != null &&
              ownerCarIds.includes(String(booking.carId))
          )
          : [];

        setBookings(ownerBookings);
      } catch {
        setBookings([]);
      } finally {
        setLoading(false);
      }
    }, 0);

    return () => window.clearTimeout(timer);
  }, [router]);

  const report = useMemo(() => {
    const completed = bookings.filter(
      (booking) => booking.status === "Completed"
    );

    const pending = bookings.filter(
      (booking) => (booking.status || "Pending") === "Pending"
    );

    const confirmed = bookings.filter(
      (booking) => booking.status === "Confirmed"
    );

    const cancelled = bookings.filter(
      (booking) => booking.status === "Cancelled"
    );

    const revenue = completed.reduce((sum, booking) => {
      const amount = Number(booking.totalPrice);

      return sum + (Number.isFinite(amount) && amount > 0 ? amount : 0);
    }, 0);

    const monthlyMap = {};

    completed.forEach((booking) => {
      // Use the booking creation date, falling back to pickup date.
      const dateValue = booking.createdAt || booking.pickupDate;
      if (!dateValue) return;

      const date = new Date(dateValue);

      if (Number.isNaN(date.getTime())) return;

      const key = `${date.getFullYear()}-${String(
        date.getMonth() + 1
      ).padStart(2, "0")}`;

      const amount = Number(booking.totalPrice);
      const safeAmount =
        Number.isFinite(amount) && amount > 0 ? amount : 0;

      monthlyMap[key] = (monthlyMap[key] || 0) + safeAmount;
    });

    const monthly = Object.entries(monthlyMap)
      .sort(([a], [b]) => a.localeCompare(b))
      .slice(-6);

    return {
      completed,
      pending,
      confirmed,
      cancelled,
      revenue,
      monthly,
    };
  }, [bookings]);

  const money = (value) =>
    `${Number(value || 0).toLocaleString("en-ET", {
      maximumFractionDigits: 2,
    })} ETB`;

  if (loading) {
    return (
      <main className="min-h-screen bg-slate-950 p-8 text-white">
        Loading earnings...
      </main>
    );
  }

  if (!session) return null;

  const maxMonthlyRevenue = Math.max(
    1,
    ...report.monthly.map(([, amount]) => amount)
  );

  return (
    <main className="min-h-screen bg-slate-950 px-4 py-8 text-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <Link
          href="/owener/dashboard"
          className="text-sm text-orange-400 hover:text-orange-300"
        >
          ← Owner dashboard
        </Link>

        <header className="mt-6">
          <p className="text-sm font-semibold uppercase tracking-widest text-orange-400">
            Sheggar Wheels
          </p>

          <h1 className="mt-2 text-3xl font-bold sm:text-4xl">
            Earnings &amp; reports
          </h1>

          <p className="mt-3 text-slate-400">
            Review completed rental revenue and booking activity for your cars.
          </p>
        </header>

        <section className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-2xl border border-white/10 bg-slate-900 p-5">
            <p className="text-sm text-slate-400">Completed revenue</p>
            <p className="mt-3 text-2xl font-bold text-green-400">
              {money(report.revenue)}
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-slate-900 p-5">
            <p className="text-sm text-slate-400">Completed bookings</p>
            <p className="mt-3 text-3xl font-bold">
              {report.completed.length}
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-slate-900 p-5">
            <p className="text-sm text-slate-400">Pending requests</p>
            <p className="mt-3 text-3xl font-bold text-yellow-400">
              {report.pending.length}
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-slate-900 p-5">
            <p className="text-sm text-slate-400">Confirmed bookings</p>
            <p className="mt-3 text-3xl font-bold text-blue-400">
              {report.confirmed.length}
            </p>
          </div>
        </section>

        <section className="mt-8 rounded-2xl border border-white/10 bg-slate-900 p-5 sm:p-7">
          <h2 className="text-xl font-bold">Monthly completed revenue</h2>

          <p className="mt-2 text-sm text-slate-400">
            Based on the creation date of each completed booking.
          </p>

          {report.monthly.length === 0 ? (
            <p className="mt-6 rounded-xl border border-dashed border-white/15 p-8 text-center text-slate-400">
              No completed booking revenue to report yet.
            </p>
          ) : (
            <div className="mt-7 space-y-5">
              {report.monthly.map(([month, amount]) => (
                <div key={month}>
                  <div className="mb-2 flex items-center justify-between gap-4 text-sm">
                    <span className="text-slate-300">{month}</span>
                    <span className="font-semibold">{money(amount)}</span>
                  </div>

                  <div
                    className="h-3 overflow-hidden rounded-full bg-slate-800"
                    role="progressbar"
                    aria-label={`Revenue for ${month}`}
                    aria-valuemin={0}
                    aria-valuemax={maxMonthlyRevenue}
                    aria-valuenow={amount}
                  >
                    <div
                      className="h-full rounded-full bg-orange-500"
                      style={{
                        width: `${(amount / maxMonthlyRevenue) * 100}%`,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        <section className="mt-8 rounded-2xl border border-white/10 bg-slate-900 p-5 sm:p-7">
          <h2 className="text-xl font-bold">Booking status summary</h2>

          <div className="mt-5 divide-y divide-white/10">
            {[
              ["Pending", report.pending.length],
              ["Confirmed", report.confirmed.length],
              ["Completed", report.completed.length],
              ["Cancelled", report.cancelled.length],
            ].map(([label, count]) => (
              <div
                key={label}
                className="flex items-center justify-between py-4"
              >
                <span className="text-slate-300">{label}</span>
                <span className="font-bold">{count}</span>
              </div>
            ))}
          </div>

          <Link
            href="/owener/dashboard/bookings"
            className="mt-5 inline-flex rounded-xl bg-orange-500 px-5 py-3 font-semibold hover:bg-orange-400"
          >
            Manage bookings
          </Link>
        </section>

        <p className="mt-6 text-xs leading-5 text-slate-500">
          Demo report: revenue includes bookings marked Completed. It does not
          represent verified payments or accounting records. Data is stored
          in this browser.
        </p>
      </div>
    </main>
  );
}
