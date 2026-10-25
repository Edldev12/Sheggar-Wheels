
"use client";

import { useState } from "react";
import Image from "next/image";
import BookingMapLoader from "@/components/BookingMapLoader";

export default function AdminCarDetails({ car, onClose, onEdit, onDelete }) {
  const [imageIndex, setImageIndex] = useState(0);

  if (!car) return null;

  const images =
    Array.isArray(car.images) && car.images.length > 0
      ? car.images
      : car.image
        ? [car.image]
        : [];

  const coordinates = car.coordinates;
  const latitude = Number(coordinates?.latitude);
  const longitude = Number(coordinates?.longitude);

  const hasCoordinates =
    coordinates?.latitude != null &&
    coordinates?.longitude != null &&
    Number.isFinite(latitude) &&
    Number.isFinite(longitude) &&
    latitude >= -90 &&
    latitude <= 90 &&
    longitude >= -180 &&
    longitude <= 180;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
      onClick={onClose}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="admin-car-details-title"
        className="max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-2xl border border-white/10 bg-slate-950 p-5 text-white shadow-2xl sm:p-7"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="mb-6 flex items-center justify-between gap-4">
          <div>
            <p className="text-sm text-cyan-400">{car.source || "Car listing"}</p>
            <h2
              id="admin-car-details-title"
              className="text-2xl font-bold"
            >
              {car.name || "Unnamed car"}
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-white/20 px-3 py-2 hover:bg-white/10"
          >
            Close
          </button>
        </div>

        <h3 className="mb-3 font-semibold">Car images</h3>

        {images.length > 0 ? (
          <>
            <div className="relative mb-3 h-64 overflow-hidden rounded-xl bg-slate-900 sm:h-80">
              <Image
                src={images[imageIndex]}
                alt={`${car.name || "Car"} image ${imageIndex + 1}`}
                fill
                unoptimized
                sizes="(max-width: 768px) 100vw, 800px"
                className="object-contain"
              />

              {images.length > 1 && (
                <>
                  <button
                    type="button"
                    onClick={() =>
                      setImageIndex((current) =>
                        current === 0 ? images.length - 1 : current - 1
                      )
                    }
                    aria-label="Previous image"
                    className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full bg-black/70 px-4 py-2"
                  >
                    ←
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      setImageIndex((current) =>
                        (current + 1) % images.length
                      )
                    }
                    aria-label="Next image"
                    className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-black/70 px-4 py-2"
                  >
                    →
                  </button>
                </>
              )}
            </div>

            <div className="mb-6 flex gap-2 overflow-x-auto pb-2">
              {images.map((image, index) => (
                <button
                  key={`${image}-${index}`}
                  type="button"
                  onClick={() => setImageIndex(index)}
                  aria-label={`Show image ${index + 1}`}
                  className={`relative h-16 w-24 shrink-0 overflow-hidden rounded-lg border-2 ${index === imageIndex
                    ? "border-cyan-400"
                    : "border-white/10"
                    }`}
                >
                  <Image
                    src={image}
                    alt={`${car.name || "Car"} thumbnail ${index + 1}`}
                    fill
                    unoptimized
                    sizes="96px"
                    className="object-cover"
                  />
                </button>
              ))}
            </div>
          </>
        ) : (
          <p className="mb-6 rounded-xl bg-slate-900 p-5 text-slate-400">
            No images available for this car.
          </p>
        )}

        <h3 className="mb-3 font-semibold">Car information</h3>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {[
            ["Year", car.year],
            ["Type", car.type],
            ["Daily price", car.price != null ? `ETB ${car.price}` : null],
            ["Location", car.location],
            ["Transmission", car.transmission],
            ["Seats", car.seats],
            ["Rating", car.rating],
            ["Tag", car.tag],
            ["Owner", car.ownerEmail],
            ["Listing source", car.source],
          ]
            .filter(([, value]) => value != null && value !== "")
            .map(([label, value]) => (
              <div key={label} className="rounded-xl bg-slate-900 p-4">
                <p className="text-sm text-slate-400">{label}</p>
                <p className="mt-1 break-words font-medium">{value}</p>
              </div>
            ))}
        </div>

        {car.description && (
          <div className="mt-4 rounded-xl bg-slate-900 p-4">
            <h3 className="mb-2 font-semibold">Description</h3>
            <p className="whitespace-pre-wrap text-slate-300">
              {car.description}
            </p>
          </div>
        )}

        <div className="mt-6">
          <h3 className="mb-3 font-semibold">Car location and map</h3>

          {car.location && (
            <p className="mb-3 text-slate-300">{car.location}</p>
          )}

          {hasCoordinates ? (
            <>
              <div className="overflow-hidden rounded-xl">
                <BookingMapLoader
                  initialPosition={[latitude, longitude]}
                  selectedPosition={[latitude, longitude]}
                  onLocationSelect={() => { }}
                />
              </div>

              <a
                className="mt-3 inline-block text-cyan-400 underline"
                href={`https://www.openstreetmap.org/?mlat=${latitude}&mlon=${longitude}#map=16/${latitude}/${longitude}`}
                target="_blank"
                rel="noreferrer"
              >
                Open location in OpenStreetMap
              </a>

              <p className="mt-2 text-sm text-slate-400">
                Coordinates: {latitude}, {longitude}
              </p>
            </>
          ) : (
            <p className="rounded-xl bg-slate-900 p-4 text-slate-400">
              No map coordinates have been saved for this car.
            </p>
          )}
        </div>

        <div className="mt-7 flex flex-wrap gap-3 border-t border-white/10 pt-5">
          <button
            type="button"
            onClick={() => onEdit(car)}
            className="rounded-lg bg-cyan-500 px-5 py-2 font-semibold text-slate-950 hover:bg-cyan-400"
          >
            Edit car
          </button>

          {car.source === "Owner listing" && (
            <button
              type="button"
              onClick={() => onDelete(car)}
              className="rounded-lg bg-red-600 px-5 py-2 font-semibold hover:bg-red-500"
            >
              Delete car
            </button>
          )}
        </div>
      </section>
    </div>
  );
}
