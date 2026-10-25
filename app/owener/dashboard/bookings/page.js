"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function OwnerBookingsPage() {
  const [session, setSession] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [filter, setFilter] = useState("All");
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const timer = window.setTimeout(() => {
      try {
        const savedSession = sessionStorage.getItem("sheggar-session");
        const currentSession = savedSession
          ? JSON.parse(savedSession)
          : null;

        if (!currentSession || currentSession.role !== "owner") {
          setMessage("Owner access required. Please sign in as an owner.");
          setLoading(false);
          return;
        }

        setSession(currentSession);

        const savedCars = JSON.parse(
          localStorage.getItem("sheggar-cars") || "[]"
        );

        const ownerCars = Array.isArray(savedCars)
          ? savedCars.filter(
            (car) =>
              car.ownerId === currentSession.id ||
              (car.ownerEmail &&
                car.ownerEmail.toLowerCase() ===
                currentSession.email?.toLowerCase())
          )
          : [];

        const ownerCarIds = ownerCars.map((car) => String(car.id));

        const savedBookings = JSON.parse(
          localStorage.getItem("sheggar-bookings") || "[]"
        );

        const ownerBookings = Array.isArray(savedBookings)
          ? savedBookings.filter(
            (booking) =>
              ownerCarIds.includes(String(booking.carId)) ||
              (booking.ownerId &&
                booking.ownerId === currentSession.id) ||
              (booking.ownerEmail &&
                booking.ownerEmail.toLowerCase() ===
                currentSession.email?.toLowerCase())
          )
          : [];

        setBookings(
          ownerBookings.sort(
            (a, b) =>
              new Date(b.createdAt || 0) - new Date(a.createdAt || 0)
          )
        );
      } catch {
        setMessage("Unable to load bookings. Please check your saved data.");
      } finally {
        setLoading(false);
      }
    }, 0);

    return () => window.clearTimeout(timer);
  }, []);

  function updateStatus(bookingId, newStatus) {
    try {
      const allBookings = JSON.parse(
        localStorage.getItem("sheggar-bookings") || "[]"
      );

      if (!Array.isArray(allBookings)) {
        setMessage("Booking data is invalid.");
        return;
      }

      const target = bookings.find(
        (booking) => booking.id === bookingId
      );

      if (!target) {
        setMessage("Booking not found.");
        return;
      }

      const updatedAllBookings = allBookings.map((booking) =>
        booking.id === bookingId
          ? { ...booking, status: newStatus }
          : booking
      );

      localStorage.setItem(
        "sheggar-bookings",
        JSON.stringify(updatedAllBookings)
      );

      setBookings((current) =>
        current.map((booking) =>
          booking.id === bookingId
            ? { ...booking, status: newStatus }
            : booking
        )
      );

      setMessage(`Booking status updated to ${newStatus}.`);
    } catch {
      setMessage("Unable to update booking status.");
    }
  }

  const filteredBookings =
    filter === "All"
      ? bookings
      : bookings.filter((booking) => booking.status === filter);

  const money = (value) =>
    `${Number(value || 0).toLocaleString()} ETB`;

  if (loading) {
    return (
      <main className="min-h-screen bg-slate-950 p-8 text-white">
        Loading your bookings...
      </main>
    );
  }

  if (!session) {
    return (
      <main className="min-h-screen bg-slate-950 p-8 text-white">
        <h1 className="text-2xl font-bold">Owner access required</h1>
        <p className="mt-3 text-slate-400">{message}</p>
        <Link
          href="/signin"
          className="mt-5 inline-block rounded-xl bg-orange-500 px-5 py-3 font-semibold"
        >
          Sign in
        </Link>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-950 px-4 py-8 text-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <Link
          href="/owener/dashboard"
          className="text-sm text-orange-400 hover:text-orange-300"
        >
          ← Owner dashboard
        </Link>

        <div className="mt-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="text-sm font-semibold uppercase tracking-widest text-orange-400">
              Sheggar Wheels
            </p>
            <h1 className="mt-2 text-3xl font-bold sm:text-4xl">
              My bookings
            </h1>
            <p className="mt-2 text-slate-400">
              Review rental requests for your listed cars.
            </p>
          </div>

          <select
            value={filter}
            onChange={(event) => setFilter(event.target.value)}
            className="rounded-xl border border-white/10 bg-slate-900 px-4 py-3 text-white"
            aria-label="Filter bookings by status"
          >
            <option>All</option>
            <option>Pending</option>
            <option>Confirmed</option>
            <option>Completed</option>
            <option>Cancelled</option>
          </select>
        </div>

        {message && (
          <p
            role="status"
            className="mt-5 rounded-xl border border-white/10 bg-slate-900 p-4 text-sm text-slate-300"
          >
            {message}
          </p>
        )}

        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          <div className="rounded-2xl border border-white/10 bg-slate-900 p-5">
            <p className="text-sm text-slate-400">Total bookings</p>
            <p className="mt-2 text-3xl font-bold">{bookings.length}</p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-slate-900 p-5">
            <p className="text-sm text-slate-400">Pending requests</p>
            <p className="mt-2 text-3xl font-bold text-yellow-400">
              {bookings.filter((booking) => booking.status === "Pending").length}
            </p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-slate-900 p-5">
            <p className="text-sm text-slate-400">Completed revenue</p>
            <p className="mt-2 text-2xl font-bold text-green-400">
              {money(
                bookings
                  .filter((booking) => booking.status === "Completed")
                  .reduce(
                    (total, booking) =>
                      total + Number(booking.totalPrice || 0),
                    0
                  )
              )}
            </p>
          </div>
        </div>

        <div className="mt-8 space-y-4">
          {filteredBookings.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-white/15 bg-slate-900/50 px-6 py-16 text-center">
              <h2 className="text-xl font-semibold">No bookings found</h2>
              <p className="mt-2 text-slate-400">
                Booking requests for your cars will appear here.
              </p>
            </div>
          ) : (
            filteredBookings.map((booking) => (
              <article
                key={booking.id}
                className="rounded-2xl border border-white/10 bg-slate-900 p-5 sm:p-6"
              >
                <div className="flex flex-col justify-between gap-4 sm:flex-row">
                  <div>
                    <h2 className="text-xl font-bold">
                      {booking.carName || "Car rental"}
                    </h2>
                    <p className="mt-1 break-all text-xs text-slate-500">
                      Reference: {booking.id}
                    </p>
                    <p className="mt-3 text-sm text-slate-300">
                      Customer: {booking.customer?.name || booking.customer?.email || "Not provided"}
                    </p>
                    <p className="mt-1 text-sm text-slate-400">
                      Phone: {booking.phone || "Not provided"}
                    </p>
                  </div>

                  <div className="sm:text-right">
                    <p className="text-2xl font-bold text-orange-400">
                      {money(booking.totalPrice)}
                    </p>
                    <span className="mt-2 inline-block rounded-full bg-white/5 px-3 py-1 text-sm">
                      {booking.status || "Pending"}
                    </span>
                  </div>
                </div>

                <div className="mt-5 grid gap-4 border-t border-white/10 pt-5 sm:grid-cols-2 lg:grid-cols-4">
                  <div>
                    <p className="text-xs text-slate-500">Pickup date</p>
                    <p className="mt-1 text-sm">
                      {booking.pickupDate || "Not provided"}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500">Return date</p>
                    <p className="mt-1 text-sm">
                      {booking.returnDate || "Not provided"}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500">Pickup location</p>
                    <p className="mt-1 text-sm">
                      {booking.pickupLocation || "Not provided"}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500">Return location</p>
                    <p className="mt-1 text-sm">
                      {booking.returnLocation || "Not provided"}
                    </p>
                  </div>
                </div>

                <div className="mt-5 flex flex-wrap gap-3 border-t border-white/10 pt-5">
                  {booking.status === "Pending" && (
                    <>
                      <button
                        type="button"
                        onClick={() => updateStatus(booking.id, "Confirmed")}
                        className="rounded-xl bg-green-600 px-4 py-2 text-sm font-semibold hover:bg-green-500"
                      >
                        Confirm booking
                      </button>
                      <button
                        type="button"
                        onClick={() => updateStatus(booking.id, "Cancelled")}
                        className="rounded-xl border border-red-500/40 px-4 py-2 text-sm font-semibold text-red-300 hover:bg-red-500/10"
                      >
                        Cancel booking
                      </button>
                    </>
                  )}

                  {booking.status === "Confirmed" && (
                    <button
                      type="button"
                      onClick={() => updateStatus(booking.id, "Completed")}
                      className="rounded-xl bg-orange-500 px-4 py-2 text-sm font-semibold hover:bg-orange-400"
                    >
                      Mark completed
                    </button>
                  )}
                </div>
              </article>
            ))
          )}
        </div>

        <p className="mt-8 text-xs leading-5 text-slate-500">
          Demo mode: bookings are stored in this browser&apos;s local storage.
          This is not server-side authorization or a real payment system.
        </p>
      </div>
    </main>
  );
}
