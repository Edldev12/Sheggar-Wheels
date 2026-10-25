
"use client";

import { useState } from "react";
import BookingMapLoader from "@/components/BookingMapLoader";

export default function CarLocationPicker({
  address,
  onAddressChange,
  coordinates,
  onCoordinatesChange,
}) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function findLocation() {
    const query = address.trim();

    if (!query) {
      setError("Please enter a car address.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=jsonv2&limit=1&countrycodes=et&q=${encodeURIComponent(query)}`
      );

      if (!response.ok) {
        throw new Error("Search failed");
      }

      const results = await response.json();

      if (!results.length) {
        setError("Address not found. Try a more specific address.");
        return;
      }

      const result = results[0];

      onAddressChange(result.display_name);
      onCoordinatesChange({
        latitude: Number(result.lat),
        longitude: Number(result.lon),
      });
    } catch {
      setError("Could not find the address. Check your internet connection.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-4 sm:col-span-2">
      <label className="block text-sm font-medium text-slate-700">
        Car address *
        <input
          value={address}
          onChange={(event) => {
            onAddressChange(event.target.value);
            onCoordinatesChange(null);
            setError("");
          }}
          placeholder="e.g. Bole, Addis Ababa"
          required
          className="mt-2 w-full rounded-lg border border-slate-300 px-4 py-3"
        />
      </label>

      <button
        type="button"
        onClick={findLocation}
        disabled={loading}
        className="rounded-lg bg-emerald-700 px-5 py-3 font-semibold text-white hover:bg-emerald-800 disabled:opacity-60"
      >
        {loading ? "Searching..." : "Find address on map"}
      </button>

      <BookingMapLoader
        selectedPosition={
          coordinates
            ? [coordinates.latitude, coordinates.longitude]
            : undefined
        }
        onLocationSelect={({ latitude, longitude }) => {
          onCoordinatesChange({ latitude, longitude });
          setError("");
        }}
      />

      <p className="text-sm text-slate-500">
        Search for an address or click the map to select the car&apos;s exact
        location.
      </p>

      {coordinates && (
        <p className="text-sm text-emerald-700">
          Location selected: {coordinates.latitude.toFixed(6)},{" "}
          {coordinates.longitude.toFixed(6)}
        </p>
      )}

      {error && (
        <p role="alert" className="text-sm text-red-600">
          {error}
        </p>
      )}
    </div>
  );
}
