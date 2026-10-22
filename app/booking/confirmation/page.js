"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

function BookingDetails({ booking }) {
  function formatDate(dateString) {
    return new Date(`${dateString}T00:00:00`).toLocaleDateString("en-ET", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  }

  return (
    <div className="mt-8 overflow-hidden rounded-2xl border border-white/10">
      <div
        role="img"
        aria-label={booking.carName}
        className="h-56 bg-cover bg-center"
        style={{ backgroundImage: `url("${booking.carImage}")` }}
      />
      <div className="p-5 sm:p-6">
        <h2 className="text-2xl font-bold">{booking.carName}</h2>

        <div className="mt-6 grid gap-5 sm:grid-cols-2">
          <div>
            <p className="text-sm text-slate-500">Pickup date</p>
            <p className="mt-1 font-semibold">{formatDate(booking.pickupDate)}</p>
          </div>
          <div>
            <p className="text-sm text-slate-500">Return date</p>
            <p className="mt-1 font-semibold">{formatDate(booking.returnDate)}</p>
          </div>
          <div>
            <p className="text-sm text-slate-500">Rental duration</p>
            <p className="mt-1 font-semibold">
              {booking.rentalDays} {booking.rentalDays === 1 ? "day" : "days"}
            </p>
          </div>
          <div>
            <p className="text-sm text-slate-500">Price per day</p>
            <p className="mt-1 font-semibold">
              {Number(booking.dailyPrice).toLocaleString()} ETB
            </p>
          </div>
        </div>

        <div className="mt-6 flex items-center justify-between gap-4 border-t border-white/10 pt-5">
          <span className="font-semibold">Total rental cost</span>
          <span className="text-2xl font-bold text-orange-400">
            {Number(booking.totalPrice).toLocaleString()} ETB
          </span>
        </div>
      </div>
    </div>
  );
}

function BookingResult({ bookingId }) {
  const [booking, setBooking] = useState(undefined);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      try {
        const saved = JSON.parse(
          localStorage.getItem("sheggar-bookings") || "[]"
        );
        const found = Array.isArray(saved)
          ? saved.find((item) => item.id === bookingId) || null
          : null;

        setBooking(found);
      } catch {
        setBooking(null);
      }
    }, 0);

    return () => window.clearTimeout(timer);
  }, [bookingId]);

  if (booking === undefined) {
    return (
      <p className="py-12 text-center text-slate-400">
        Loading booking details...
      </p>
    );
  }

  if (!booking) {
    return (
      <div className="py-10 text-center">
        <h1 className="text-3xl font-bold">Booking not found</h1>
        <p className="mt-3 text-slate-400">
          We could not find this booking in your browser.
        </p>
        <Link
          href="/cars"
          className="mt-6 inline-block rounded-xl bg-orange-500 px-6 py-3 font-semibold hover:bg-orange-400"
        >
          Browse cars
        </Link>
      </div>
    );
  }

  return (
    <>
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-500/15 text-3xl text-green-400">
        ✓
      </div>

      <div className="mt-5 text-center">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-orange-400">
          Sheggar Wheels
        </p>
        <h1 className="mt-3 text-3xl font-bold sm:text-4xl">
          Booking request saved!
        </h1>
        <p className="mt-3 text-slate-400">
          Your demo booking has been saved in this browser.
        </p>
      </div>

      <div className="mt-8 rounded-2xl border border-white/10 bg-slate-950 p-5">
        <p className="text-sm text-slate-500">Booking reference</p>
        <p className="mt-1 break-all font-semibold">{booking.id}</p>
        <span className="mt-3 inline-block rounded-full bg-yellow-500/10 px-3 py-1 text-sm font-semibold text-yellow-400">
          {booking.status}
        </span>
      </div>

      <BookingDetails booking={booking} />

      <p className="mt-6 rounded-xl border border-orange-500/20 bg-orange-500/5 p-4 text-sm leading-6 text-slate-300">
        Demo only: no real payment was processed, and no real owner has
        confirmed this booking.
      </p>

      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <Link
          href="/cars"
          className="flex-1 rounded-xl bg-orange-500 px-5 py-3 text-center font-semibold hover:bg-orange-400"
        >
          Browse more cars
        </Link>
        <Link
          href="/"
          className="flex-1 rounded-xl border border-white/15 px-5 py-3 text-center font-semibold hover:bg-white/5"
        >
          Back to home
        </Link>
      </div>
    </>
  );
}

export default function BookingConfirmationPage() {
  const [bookingId, setBookingId] = useState("");

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setBookingId(
        new URLSearchParams(window.location.search).get("id") || ""
      );
    }, 0);

    return () => window.clearTimeout(timer);
  }, []);

  return (
    <main className="min-h-screen bg-slate-950 px-4 py-12 text-white sm:px-6">
      <div className="mx-auto max-w-3xl rounded-3xl border border-white/10 bg-slate-900 p-6 sm:p-10">
        {bookingId ? (
          <BookingResult bookingId={bookingId} />
        ) : (
          <p className="py-12 text-center text-slate-400">
            Loading booking confirmation...
          </p>
        )}
      </div>
    </main>
  );
}
