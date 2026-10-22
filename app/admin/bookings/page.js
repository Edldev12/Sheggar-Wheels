"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function AdminBookingsPage() {
  const [session, setSession] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [filter, setFilter] = useState("All");
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      try {
        const savedSession = sessionStorage.getItem("sheggar-session");
        const currentSession = savedSession ? JSON.parse(savedSession) : null;
        const savedBookings = JSON.parse(
          localStorage.getItem("sheggar-bookings") || "[]"
        );

        setSession(currentSession);
        setBookings(Array.isArray(savedBookings) ? savedBookings : []);
      } catch {
        setSession(null);
        setBookings([]);
      }

      setLoaded(true);
    }, 0);

    return () => window.clearTimeout(timer);
  }, []);

  function updateBookingStatus(bookingId, status) {
    try {
      const savedBookings = JSON.parse(
        localStorage.getItem("sheggar-bookings") || "[]"
      );

      if (!Array.isArray(savedBookings)) {
        return;
      }

      const updatedBookings = savedBookings.map((booking) =>
        booking.id === bookingId ? { ...booking, status } : booking
      );

      localStorage.setItem("sheggar-bookings", JSON.stringify(updatedBookings));
      setBookings(updatedBookings);
    } catch {
      window.alert("Could not update the booking. Please try again.");
    }
  }

  if (!loaded) {
    return <main className="p-8">Loading bookings...</main>;
  }

  if (!session || session.role !== "admin") {
    return (
      <main className="mx-auto max-w-xl px-4 py-20 text-center">
        <h1 className="text-3xl font-bold">Admin access required</h1>
        <p className="mt-3 text-slate-600">
          Sign in with an admin demo account to manage bookings.
        </p>
        <Link
          href="/signin"
          className="mt-6 inline-block rounded-xl bg-slate-900 px-6 py-3 text-white"
        >
          Go to sign in
        </Link>
      </main>
    );
  }

  const filteredBookings =
    filter === "All"
      ? bookings
      : bookings.filter(
        (booking) =>
          (booking.status || "Pending").toLowerCase() === filter.toLowerCase()
      );

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-10 sm:px-8">
      <div className="mx-auto max-w-6xl">
        <Link
          href="/admin"
          className="text-sm font-semibold text-emerald-700 hover:underline"
        >
          ← Back to dashboard
        </Link>

        <div className="mt-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Bookings</h1>
            <p className="mt-2 text-slate-600">
              Review and manage customer booking requests.
            </p>
          </div>

          <select
            value={filter}
            onChange={(event) => setFilter(event.target.value)}
            className="rounded-lg border border-slate-300 bg-white px-4 py-3 text-slate-800"
            aria-label="Filter bookings by status"
          >
            {["All", "Pending", "Confirmed", "Cancelled", "Completed"].map(
              (status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              )
            )}
          </select>
        </div>

        <div className="mt-8 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          {filteredBookings.length === 0 ? (
            <p className="p-8 text-center text-slate-500">
              No bookings found for this filter.
            </p>
          ) : (
            <div className="divide-y divide-slate-200">
              {filteredBookings.map((booking) => {
                const status = booking.status || "Pending";

                return (
                  <article
                    key={booking.id}
                    className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div>
                      <h2 className="font-semibold text-slate-900">
                        {booking.carName || "Car booking"}
                      </h2>
                      <p className="mt-1 text-sm text-slate-600">
                        Renter: {booking.userName || booking.renterName || "Demo renter"}
                      </p>
                      <p className="mt-1 text-sm text-slate-600">
                        {booking.pickupDate || "—"} to {booking.returnDate || "—"}
                      </p>
                      <p className="mt-1 font-semibold text-slate-900">
                        ETB {Number(booking.totalPrice || 0).toLocaleString()}
                      </p>
                      <p className="mt-2 text-sm">
                        Status: <span className="font-semibold">{status}</span>
                      </p>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {status === "Pending" && (
                        <button
                          type="button"
                          onClick={() => updateBookingStatus(booking.id, "Confirmed")}
                          className="rounded-lg bg-emerald-700 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-800"
                        >
                          Confirm
                        </button>
                      )}

                      {(status === "Pending" || status === "Confirmed") && (
                        <button
                          type="button"
                          onClick={() => updateBookingStatus(booking.id, "Cancelled")}
                          className="rounded-lg border border-red-200 px-4 py-2 text-sm font-semibold text-red-700 hover:bg-red-50"
                        >
                          Cancel
                        </button>
                      )}
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </div>

        <p className="mt-4 text-xs leading-5 text-slate-500">
          Demo only: booking statuses are saved in this browser&apos;s local storage.
          This page does not provide server-side authorization.
        </p>
      </div>
    </main>
  );
}