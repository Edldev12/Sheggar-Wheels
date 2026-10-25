"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

const STATUSES = ["All", "Pending", "Confirmed", "Completed", "Cancelled"];

function getStatus(booking) {
  return STATUSES.includes(booking.status) && booking.status !== "All"
    ? booking.status
    : booking.status || "Pending";
}

function getStatusStyle(status) {
  switch (status) {
    case "Confirmed":
      return "border-blue-500/30 bg-blue-500/10 text-blue-300";
    case "Completed":
      return "border-green-500/30 bg-green-500/10 text-green-300";
    case "Cancelled":
      return "border-red-500/30 bg-red-500/10 text-red-300";
    default:
      return "border-yellow-500/30 bg-yellow-500/10 text-yellow-300";
  }
}

function formatDate(dateString) {
  if (!dateString) return "—";

  const date = new Date(`${dateString}T00:00:00`);

  if (Number.isNaN(date.getTime())) return "—";

  return date.toLocaleDateString("en-ET", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export default function AdminBookingsPage() {
  const [session, setSession] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [filter, setFilter] = useState("All");
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const timer = window.setTimeout(() => {
      try {
        const savedSession = sessionStorage.getItem("sheggar-session");
        const currentSession = savedSession
          ? JSON.parse(savedSession)
          : null;

        const savedBookings = JSON.parse(
          localStorage.getItem("sheggar-bookings") || "[]"
        );

        setSession(currentSession);
        setBookings(Array.isArray(savedBookings) ? savedBookings : []);
      } catch {
        setError("Unable to load booking data from this browser.");
      } finally {
        setLoaded(true);
      }
    }, 0);

    return () => window.clearTimeout(timer);
  }, []);

  function updateBookingStatus(bookingId, newStatus) {
    try {
      const savedBookings = JSON.parse(
        localStorage.getItem("sheggar-bookings") || "[]"
      );

      if (!Array.isArray(savedBookings)) {
        throw new Error("Invalid booking data");
      }

      const updatedBookings = savedBookings.map((booking) =>
        booking.id === bookingId
          ? { ...booking, status: newStatus }
          : booking
      );

      localStorage.setItem(
        "sheggar-bookings",
        JSON.stringify(updatedBookings)
      );

      setBookings(updatedBookings);
      setError("");
    } catch {
      setError("Could not update the booking. Please try again.");
    }
  }

  if (!loaded) {
    return (
      <main className="min-h-screen bg-slate-950 px-6 py-16 text-white">
        Loading bookings...
      </main>
    );
  }

  if (!session || session.role !== "admin") {
    return (
      <main className="min-h-screen bg-slate-950 px-6 py-16 text-center text-white">
        <h1 className="text-3xl font-bold">Admin access required</h1>
        <p className="mt-3 text-slate-400">
          Sign in with your demo admin account to manage bookings.
        </p>
        <Link
          href="/signin"
          className="mt-6 inline-block rounded-xl bg-orange-500 px-6 py-3 font-semibold hover:bg-orange-400"
        >
          Go to sign in
        </Link>
      </main>
    );
  }

  const countByStatus = (status) =>
    bookings.filter((booking) => getStatus(booking) === status).length;

  const filteredBookings =
    filter === "All"
      ? bookings
      : bookings.filter((booking) => getStatus(booking) === filter);

  return (
    <main className="min-h-screen bg-slate-950 px-4 py-10 text-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <Link
          href="/admin"
          className="inline-flex text-sm text-slate-400 transition hover:text-orange-400"
        >
          ← Back to dashboard
        </Link>

        <div className="mt-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-orange-400">
              Sheggar Wheels
            </p>
            <h1 className="mt-2 text-3xl font-bold sm:text-4xl">
              Booking Management
            </h1>
            <p className="mt-2 text-slate-400">
              Review and manage customer booking requests.
            </p>
          </div>

          <div className="rounded-xl border border-white/10 bg-slate-900 px-4 py-3">
            <p className="text-sm text-slate-400">Total bookings</p>
            <p className="mt-1 text-2xl font-bold">{bookings.length}</p>
          </div>
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            {
              label: "Pending",
              value: countByStatus("Pending"),
              color: "text-yellow-300",
            },
            {
              label: "Confirmed",
              value: countByStatus("Confirmed"),
              color: "text-blue-300",
            },
            {
              label: "Completed",
              value: countByStatus("Completed"),
              color: "text-green-300",
            },
            {
              label: "Cancelled",
              value: countByStatus("Cancelled"),
              color: "text-red-300",
            },
          ].map((item) => (
            <div
              key={item.label}
              className="rounded-2xl border border-white/10 bg-slate-900 p-5"
            >
              <p className="text-sm text-slate-400">{item.label} bookings</p>
              <p className={`mt-2 text-3xl font-bold ${item.color}`}>
                {item.value}
              </p>
            </div>
          ))}
        </div>

        <section className="mt-8 rounded-2xl border border-white/10 bg-slate-900 p-5 sm:p-6">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
            <div>
              <h2 className="text-xl font-bold">All bookings</h2>
              <p className="mt-1 text-sm text-slate-400">
                {filteredBookings.length}{" "}
                {filteredBookings.length === 1 ? "booking" : "bookings"} shown
              </p>
            </div>

            <label className="flex items-center gap-3 text-sm text-slate-300">
              Filter
              <select
                value={filter}
                onChange={(event) => setFilter(event.target.value)}
                className="rounded-xl border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none focus:border-orange-400"
              >
                {STATUSES.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </label>
          </div>

          {error && (
            <p
              role="alert"
              className="mt-5 rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-300"
            >
              {error}
            </p>
          )}

          {filteredBookings.length === 0 ? (
            <div className="mt-6 rounded-xl border border-dashed border-white/15 px-4 py-12 text-center">
              <h3 className="text-lg font-semibold">No bookings found</h3>
              <p className="mt-2 text-sm text-slate-400">
                {filter === "All"
                  ? "New booking requests will appear here."
                  : `There are no ${filter.toLowerCase()} bookings.`}
              </p>
            </div>
          ) : (
            <div className="mt-6 space-y-4">
              {filteredBookings.map((booking) => {
                const status = getStatus(booking);

                return (
                  <article
                    key={booking.id}
                    className="rounded-2xl border border-white/10 bg-slate-950 p-4 sm:p-5"
                  >
                    <div className="flex flex-col gap-5 lg:flex-row">
                      <div
                        role="img"
                        aria-label={booking.carName || "Rental car"}
                        className="h-44 shrink-0 rounded-xl bg-cover bg-center lg:w-56"
                        style={{
                          backgroundImage: booking.carImage
                            ? `url("${booking.carImage}")`
                            : "none",
                        }}
                      />

                      <div className="min-w-0 flex-1">
                        <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-start">
                          <div className="min-w-0">
                            <h3 className="text-lg font-bold">
                              {booking.carName || "Car booking"}
                            </h3>
                            <p className="mt-1 break-all text-xs text-slate-500">
                              Reference: {booking.id || "Unavailable"}
                            </p>
                          </div>

                          <span
                            className={`w-fit rounded-full border px-3 py-1 text-xs font-semibold ${getStatusStyle(status)}`}
                          >
                            {status}
                          </span>
                        </div>

                        <div className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                          <div>
                            <p className="text-xs text-slate-500">Pickup</p>
                            <p className="mt-1 text-sm font-medium">
                              {formatDate(booking.pickupDate)}
                            </p>
                          </div>

                          <div>
                            <p className="text-xs text-slate-500">Return</p>
                            <p className="mt-1 text-sm font-medium">
                              {formatDate(booking.returnDate)}
                            </p>
                          </div>

                          <div>
                            <p className="text-xs text-slate-500">Duration</p>
                            <p className="mt-1 text-sm font-medium">
                              {Number(booking.rentalDays || 0)}{" "}
                              {Number(booking.rentalDays || 0) === 1
                                ? "day"
                                : "days"}
                            </p>
                          </div>

                          <div>
                            <p className="text-xs text-slate-500">
                              Total rental cost
                            </p>
                            <p className="mt-1 font-bold text-orange-400">
                              {Number(booking.totalPrice || 0).toLocaleString(
                                "en-US"
                              )}{" "}
                              ETB
                            </p>
                          </div>
                        </div>

                        <div className="mt-5 flex flex-wrap gap-2 border-t border-white/10 pt-4">
                          {status === "Pending" && (
                            <button
                              type="button"
                              onClick={() =>
                                updateBookingStatus(booking.id, "Confirmed")
                              }
                              className="rounded-lg bg-blue-500/15 px-4 py-2 text-sm font-semibold text-blue-300 transition hover:bg-blue-500/25"
                            >
                              Confirm booking
                            </button>
                          )}

                          {status === "Confirmed" && (
                            <button
                              type="button"
                              onClick={() =>
                                updateBookingStatus(booking.id, "Completed")
                              }
                              className="rounded-lg bg-green-500/15 px-4 py-2 text-sm font-semibold text-green-300 transition hover:bg-green-500/25"
                            >
                              Mark completed
                            </button>
                          )}

                          {(status === "Pending" || status === "Confirmed") && (
                            <button
                              type="button"
                              onClick={() => {
                                if (
                                  window.confirm(
                                    "Are you sure you want to cancel this booking?"
                                  )
                                ) {
                                  updateBookingStatus(booking.id, "Cancelled");
                                }
                              }}
                              className="rounded-lg border border-red-500/30 px-4 py-2 text-sm font-semibold text-red-300 transition hover:bg-red-500/10"
                            >
                              Cancel booking
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </section>

        <p className="mt-6 text-center text-xs leading-5 text-slate-500">
          Demo mode: booking data is stored in this browser only. Status changes
          are not synchronized to other devices, and no real payments are
          processed. Admin access checks here are client-side demonstrations,
          not server-side security.
        </p>
      </div>
    </main>
  );
}
