
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import CarLocationPicker from "@/components/CarLocationPicker";

const STORAGE_KEY = "sheggar-cars";
const MAX_PHOTOS = 5;
const MAX_PHOTO_SIZE = 350 * 1024;

const EMPTY_FORM = {
  name: "",
  year: String(new Date().getFullYear()),
  type: "Sedan",
  transmission: "Automatic",
  seats: "5",
  price: "",
  location: "Addis Ababa",
  coordinates: null,
  description: "",
};
function getCarImages(car) {
  const images = Array.isArray(car.images)
    ? car.images.filter((image) => typeof image === "string" && image.trim())
    : [];

  if (images.length > 0) return [...new Set(images)];

  return car.image ? [car.image] : [];
}

function getPhotoUrls(value) {
  return value
    .split(/\r?\n/)
    .map((url) => url.trim())
    .filter(Boolean);
}

function isValidImageUrl(value) {
  try {
    const url = new URL(value);
    return url.protocol === "https:" || url.protocol === "http:";
  } catch {
    return false;
  }
}

export default function OwnerCarsPage() {
  const [session, setSession] = useState(null);
  const [cars, setCars] = useState([]);
  const [form, setForm] = useState(EMPTY_FORM);
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [photoUrls, setPhotoUrls] = useState("");
  const [uploadedImages, setUploadedImages] = useState([]);
  const [existingImages, setExistingImages] = useState([]);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      try {
        const savedSession = sessionStorage.getItem("sheggar-session");
        const savedCars = JSON.parse(
          localStorage.getItem(STORAGE_KEY) || "[]"
        );

        setSession(savedSession ? JSON.parse(savedSession) : null);
        setCars(Array.isArray(savedCars) ? savedCars : []);

        if (!Array.isArray(savedCars)) {
          setError("Saved car data is invalid.");
        }
      } catch {
        setSession(null);
        setCars([]);
        setError(
          "Unable to read saved data. Please check your browser storage."
        );
      } finally {
        setLoaded(true);
      }
    }, 0);

    return () => window.clearTimeout(timer);
  }, []);

  const ownerCars = cars.filter(
    (car) =>
      car.ownerId === session?.id ||
      (session?.email &&
        car.ownerEmail?.toLowerCase() === session.email.toLowerCase())
  );

  function persistCars(updatedCars) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedCars));
    setCars(updatedCars);
  }

  function handleChange(event) {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
    setError("");
    setSuccess("");
  }

  function handlePhotoUrlsChange(event) {
    setPhotoUrls(event.target.value);
    setError("");
    setSuccess("");
  }

  function handlePhotoUpload(event) {
    const files = Array.from(event.target.files || []);
    if (!files.length) return;

    const urlCount = getPhotoUrls(photoUrls).length;
    const totalSelected =
      existingImages.length + urlCount + uploadedImages.length;

    if (totalSelected + files.length > MAX_PHOTOS) {
      setError(`You can add up to ${MAX_PHOTOS} photos per car.`);
      event.target.value = "";
      return;
    }

    const invalidFile = files.find(
      (file) =>
        !file.type.startsWith("image/") ||
        file.size > MAX_PHOTO_SIZE
    );

    if (invalidFile) {
      setError("Choose image files no larger than 350 KB each.");
      event.target.value = "";
      return;
    }

    Promise.all(
      files.map(
        (file) =>
          new Promise((resolve, reject) => {
            const reader = new FileReader();

            reader.onload = () => resolve(String(reader.result));
            reader.onerror = () =>
              reject(new Error("Could not read image."));

            reader.readAsDataURL(file);
          })
      )
    )
      .then((images) => {
        setUploadedImages((current) => [...current, ...images]);
        setError("");
        setSuccess("");
      })
      .catch(() => {
        setError("Unable to read the selected photos. Please try again.");
      });

    event.target.value = "";
  }

  function removeUploadedImage(index) {
    setUploadedImages((current) =>
      current.filter((_, i) => i !== index)
    );
    setError("");
    setSuccess("");
  }

  function removeExistingImage(index) {
    setExistingImages((current) =>
      current.filter((_, i) => i !== index)
    );
    setError("");
    setSuccess("");
  }

  function resetForm() {
    setForm(EMPTY_FORM);
    setEditingId(null);
    setPhotoUrls("");
    setUploadedImages([]);
    setExistingImages([]);
    setError("");
    setShowForm(false);
  }

  function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setSuccess("");

    const name = form.name.trim();
    const location = form.location.trim();
    const price = Number(form.price);
    const year = Number(form.year);
    const seats = Number(form.seats);

    if (
      !name ||
      !location ||
      !form.description.trim() ||
      !form.coordinates
    ) {
      setError(
        "Please complete the car name, address, description, and map location."
      );
      return;
    }

    if (
      !Number.isFinite(price) ||
      price <= 0 ||
      !Number.isInteger(year) ||
      year < 1980 ||
      year > new Date().getFullYear() + 1 ||
      !Number.isInteger(seats) ||
      seats < 1 ||
      seats > 20
    ) {
      setError("Enter a valid price, model year, and seat count.");
      return;
    }

    const urlImages = getPhotoUrls(photoUrls);

    if (urlImages.some((url) => !isValidImageUrl(url))) {
      setError("Every photo URL must be a valid HTTP or HTTPS link.");
      return;
    }

    const images = [
      ...new Set([
        ...existingImages,
        ...urlImages,
        ...uploadedImages,
      ]),
    ];

    if (images.length > MAX_PHOTOS) {
      setError(`You can add up to ${MAX_PHOTOS} photos per car.`);
      return;
    }

    try {
      const savedCars = JSON.parse(
        localStorage.getItem(STORAGE_KEY) || "[]"
      );

      if (!Array.isArray(savedCars)) {
        setError("Saved car data is invalid. Please refresh and try again.");
        return;
      }

      if (editingId !== null) {
        const existingCar = savedCars.find(
          (car) =>
            String(car.id) === String(editingId) &&
            (car.ownerId === session.id ||
              car.ownerEmail?.toLowerCase() ===
              session.email?.toLowerCase())
        );

        if (!existingCar) {
          setError("You can only edit your own listings.");
          return;
        }
      }

      const carData = {
        name,
        year,
        type: form.type,
        transmission: form.transmission,
        seats,
        price,
        location,
        coordinates: form.coordinates,
        images,
        // Keep the original field for compatibility with existing pages.
        image: images[0] || "",
        description: form.description.trim(),
        ownerId: session.id,
        ownerEmail: session.email || "",
        updatedAt: new Date().toISOString(),
      };

      let updatedCars;
      const wasEditing = editingId !== null;

      if (wasEditing) {
        updatedCars = savedCars.map((car) =>
          String(car.id) === String(editingId)
            ? { ...car, ...carData }
            : car
        );
      } else {
        updatedCars = [
          ...savedCars,
          {
            id: crypto.randomUUID(),
            ...carData,
            createdAt: new Date().toISOString(),
          },
        ];
      }

      persistCars(updatedCars);
      resetForm();

      setSuccess(
        wasEditing
          ? "Your car listing has been updated."
          : "Your car listing has been added."
      );
    } catch (saveError) {
      console.error("Could not save car listing:", saveError);

      setError(
        "Could not save your listing. Your browser storage may be full. " +
        "Try using smaller photos or fewer photos."
      );
    }
  }

  function handleEdit(car) {
    setEditingId(car.id);
    setShowForm(true);
    setForm({
      name: car.name || "",
      year: String(car.year || new Date().getFullYear()),
      type: car.type || "Sedan",
      transmission: car.transmission || "Automatic",
      seats: String(car.seats || 5),
      price: String(car.price || ""),
      location: car.location || "Addis Ababa",
      coordinates: car.coordinates || null,
      description: car.description || "",
    });

    setExistingImages(getCarImages(car));
    setPhotoUrls("");
    setUploadedImages([]);
    setError("");
    setSuccess("");

    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function handleDelete(car) {
    const confirmed = window.confirm(
      `Delete your listing for "${car.name}"? This cannot be undone.`
    );

    if (!confirmed) return;

    try {
      const savedCars = JSON.parse(
        localStorage.getItem(STORAGE_KEY) || "[]"
      );

      if (!Array.isArray(savedCars)) {
        setError("Saved car data is invalid.");
        return;
      }

      const updatedCars = savedCars.filter(
        (item) =>
          !(
            String(item.id) === String(car.id) &&
            (item.ownerId === session.id ||
              item.ownerEmail?.toLowerCase() ===
              session.email?.toLowerCase())
          )
      );

      persistCars(updatedCars);

      if (String(editingId) === String(car.id)) {
        resetForm();
      }

      setSuccess("Your car listing has been deleted.");
      setError("");
    } catch {
      setError("Could not delete this listing. Please try again.");
    }
  }

  if (!loaded) {
    return <main className="p-8">Loading your listings...</main>;
  }

  if (!session || session.role !== "owner") {
    return (
      <main className="mx-auto max-w-xl px-4 py-20 text-center">
        <h1 className="text-3xl font-bold text-slate-900">
          Owner access required
        </h1>

        <p className="mt-3 text-slate-600">
          Sign in with an owner demo account to manage car listings.
        </p>

        <Link
          href="/signin"
          className="mt-6 inline-block rounded-xl bg-emerald-700 px-6 py-3 font-semibold text-white"
        >
          Go to sign in
        </Link>
      </main>
    );
  }

  const pendingUrlCount = getPhotoUrls(photoUrls).length;
  const totalPhotoCount =
    existingImages.length + pendingUrlCount + uploadedImages.length;

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-10 sm:px-8">
      <div className="mx-auto max-w-6xl">
        <Link
          href="/owener/dashboard"
          className="text-sm font-semibold text-emerald-700 hover:underline"
        >
          ← Back to dashboard
        </Link>

        <header className="mt-5">
          <p className="text-sm font-semibold text-emerald-700">
            SHEGGAR WHEELS
          </p>

          <h1 className="mt-2 text-3xl font-bold text-slate-900">
            Manage my cars
          </h1>

          <p className="mt-2 text-slate-600">
            Add, update, and remove your rental listings.
          </p>
        </header>
        <div className="mt-6 flex justify-end">
          <button
            type="button"
            onClick={() => {
              if (showForm) {
                resetForm();
              } else {
                setError("");
                setSuccess("");
                setShowForm(true);
              }
            }}
            className="rounded-xl bg-emerald-700 px-5 py-3 font-semibold text-white shadow-sm transition hover:bg-emerald-800"
          >
            {showForm ? "Close Form" : "+ Add New Car"}
          </button>
        </div>
        {(error || success) && (
          <p
            role={error ? "alert" : "status"}
            className={`mt-5 rounded-xl p-4 text-sm ${error
              ? "bg-red-50 text-red-700"
              : "bg-emerald-50 text-emerald-800"
              }`}
          >
            {error || success}
          </p>
        )}

        {showForm && (
          <section className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

            <form
              onSubmit={handleSubmit}
              className="mt-6 grid gap-5 sm:grid-cols-2"
            >
              <div>
                <label
                  htmlFor="name"
                  className="mb-2 block text-sm font-medium text-slate-700"
                >
                  Car name
                </label>

                <input
                  id="name"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  required
                  placeholder="e.g. Toyota Corolla"
                  className="w-full rounded-lg border border-slate-300 px-4 py-3"
                />
              </div>

              <div>
                <label
                  htmlFor="year"
                  className="mb-2 block text-sm font-medium text-slate-700"
                >
                  Model year
                </label>

                <input
                  id="year"
                  name="year"
                  type="number"
                  min="1980"
                  max={new Date().getFullYear() + 1}
                  value={form.year}
                  onChange={handleChange}
                  required
                  className="w-full rounded-lg border border-slate-300 px-4 py-3"
                />
              </div>

              <div>
                <label
                  htmlFor="type"
                  className="mb-2 block text-sm font-medium text-slate-700"
                >
                  Car type
                </label>

                <select
                  id="type"
                  name="type"
                  value={form.type}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-slate-300 px-4 py-3"
                >
                  {["Sedan", "SUV", "Hatchback", "Luxury", "Pickup", "Van"].map(
                    (type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    )
                  )}
                </select>
              </div>

              <div>
                <label
                  htmlFor="transmission"
                  className="mb-2 block text-sm font-medium text-slate-700"
                >
                  Transmission
                </label>

                <select
                  id="transmission"
                  name="transmission"
                  value={form.transmission}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-slate-300 px-4 py-3"
                >
                  {["Automatic", "Manual"].map((transmission) => (
                    <option key={transmission} value={transmission}>
                      {transmission}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label
                  htmlFor="seats"
                  className="mb-2 block text-sm font-medium text-slate-700"
                >
                  Seats
                </label>

                <input
                  id="seats"
                  name="seats"
                  type="number"
                  min="1"
                  max="20"
                  value={form.seats}
                  onChange={handleChange}
                  required
                  className="w-full rounded-lg border border-slate-300 px-4 py-3"
                />
              </div>

              <div>
                <label
                  htmlFor="price"
                  className="mb-2 block text-sm font-medium text-slate-700"
                >
                  Price per day (ETB)
                </label>

                <input
                  id="price"
                  name="price"
                  type="number"
                  min="1"
                  step="0.01"
                  value={form.price}
                  onChange={handleChange}
                  required
                  placeholder="e.g. 2500"
                  className="w-full rounded-lg border border-slate-300 px-4 py-3"
                />
              </div>


              <div className="space-y-3 sm:col-span-2">
                <label
                  htmlFor="photoUrls"
                  className="block text-sm font-medium text-slate-700"
                >
                  Car Photo URLs (optional)
                </label>

                <textarea
                  id="photoUrls"
                  value={photoUrls}
                  onChange={handlePhotoUrlsChange}
                  rows={3}
                  placeholder={
                    "Enter one image URL per line:\nhttps://example.com/car1.jpg\nhttps://example.com/car2.jpg"
                  }
                  className="w-full rounded-xl border border-slate-300 px-4 py-3"
                />

                <div>
                  <label
                    htmlFor="photoUploads"
                    className="block text-sm font-medium text-slate-700"
                  >
                    Upload Photos From Your Computer
                  </label>

                  <input
                    id="photoUploads"
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handlePhotoUpload}
                    className="mt-2 block w-full rounded-xl border border-slate-300 p-3"
                  />

                  <p className="mt-1 text-xs text-slate-500">
                    Maximum {MAX_PHOTOS} photos per car. Each uploaded photo
                    must be 350 KB or smaller.
                  </p>

                  <p className="mt-1 text-xs font-medium text-slate-600">
                    {totalPhotoCount} of {MAX_PHOTOS} photos selected
                  </p>
                </div>
              </div>

              {existingImages.length > 0 && (
                <div className="sm:col-span-2">
                  <h3 className="mb-3 text-sm font-semibold text-slate-700">
                    Current photos
                  </h3>

                  <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-5">
                    {existingImages.map((src, index) => (
                      <div key={`${src}-${index}`} className="relative">

                        <Image
                          src={src}
                          alt={`Current car photo ${index + 1}`}
                          width={400}
                          height={280}
                          unoptimized
                          className="h-28 w-full rounded-lg border border-slate-200 object-cover"
                        />


                        <button
                          type="button"
                          onClick={() => removeExistingImage(index)}
                          className="mt-2 w-full rounded-lg border border-red-200 px-2 py-1 text-xs font-semibold text-red-700 hover:bg-red-50"
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {uploadedImages.length > 0 && (
                <div className="sm:col-span-2">
                  <h3 className="mb-3 text-sm font-semibold text-slate-700">
                    Uploaded photos
                  </h3>

                  <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-5">
                    {uploadedImages.map((src, index) => (
                      <div key={`${src.slice(-30)}-${index}`} className="relative">

                        <Image
                          src={src}
                          alt={`Uploaded car photo ${index + 1}`}
                          width={400}
                          height={280}
                          unoptimized
                          className="h-28 w-full rounded-lg border border-slate-200 object-cover"
                        />


                        <button
                          type="button"
                          onClick={() => removeUploadedImage(index)}
                          className="mt-2 w-full rounded-lg border border-red-200 px-2 py-1 text-xs font-semibold text-red-700 hover:bg-red-50"
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {pendingUrlCount > 0 && (
                <div className="sm:col-span-2">
                  <p className="text-sm text-slate-600">
                    {pendingUrlCount} photo URL
                    {pendingUrlCount === 1 ? "" : "s"} will be saved when you
                    submit the form.
                  </p>
                </div>
              )}

              <div className="sm:col-span-2">
                <label
                  htmlFor="description"
                  className="mb-2 block text-sm font-medium text-slate-700"
                >
                  Description
                </label>

                <textarea
                  id="description"
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  required
                  rows={4}
                  placeholder="Describe your car and rental terms."
                  className="w-full rounded-lg border border-slate-300 px-4 py-3"
                />
              </div>
              <CarLocationPicker
                address={form.location}
                onAddressChange={(location) =>
                  setForm((current) => ({ ...current, location }))
                }
                coordinates={form.coordinates}
                onCoordinatesChange={(coordinates) =>
                  setForm((current) => ({ ...current, coordinates }))
                }
              />
              <div className="flex flex-wrap gap-3 sm:col-span-2">
                <button
                  type="submit"
                  className="rounded-lg bg-emerald-700 px-5 py-3 font-semibold text-white hover:bg-emerald-800"
                >
                  {editingId !== null ? "Save changes" : "Add car"}
                </button>

                {editingId !== null && (
                  <button
                    type="button"
                    onClick={() => {
                      resetForm();
                      setSuccess("");
                    }}
                    className="rounded-lg border border-slate-300 px-5 py-3 font-semibold text-slate-700 hover:bg-slate-50"
                  >
                    Cancel edit
                  </button>
                )}
              </div>
            </form>
          </section>
        )}

        <section className="mt-8">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-bold text-slate-900">My listings</h2>

            <span className="text-sm text-slate-500">
              {ownerCars.length} {ownerCars.length === 1 ? "car" : "cars"}
            </span>
          </div>

          {ownerCars.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center">
              <h3 className="font-semibold text-slate-900">No listings yet</h3>

              <p className="mt-2 text-sm text-slate-500">
                Use the form above to publish your first demo car listing.
              </p>
            </div>
          ) : (
            <div className="grid gap-5 md:grid-cols-2">
              {ownerCars.map((car) => {
                const carImages = getCarImages(car);

                return (
                  <article
                    key={car.id}
                    className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
                  >
                    {carImages.length > 0 && (
                      <div className="grid grid-cols-2 gap-2">
                        {carImages.slice(0, 4).map((src, index) => (

                          <Image
                            key={`${src.slice(-30)}-${index}`}
                            src={src}
                            alt={`Uploaded car photo ${index + 1}`}
                            width={400}
                            height={280}
                            unoptimized
                            className="h-28 w-full rounded-lg border border-slate-200 object-cover"
                          />
                        ))}
                      </div>
                    )}

                    <h3 className="mt-3 text-lg font-bold text-slate-900">
                      {car.name}
                    </h3>

                    <p className="mt-1 text-sm text-slate-500">
                      {car.year} · {car.type} · {car.transmission} ·{" "}
                      {car.seats} seats
                    </p>

                    <p className="mt-2 text-sm text-slate-600">
                      {car.location}
                    </p>

                    <p className="mt-3 font-semibold text-slate-900">
                      ETB {Number(car.price).toLocaleString()} / day
                    </p>

                    <p className="mt-2 line-clamp-3 text-sm text-slate-600">
                      {car.description}
                    </p>

                    <div className="mt-5 flex gap-3">
                      <button
                        type="button"
                        onClick={() => handleEdit(car)}
                        className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800"
                      >
                        Edit
                      </button>

                      <button
                        type="button"
                        onClick={() => handleDelete(car)}
                        className="rounded-lg border border-red-200 px-4 py-2 text-sm font-semibold text-red-700 hover:bg-red-50"
                      >
                        Delete
                      </button>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </section>

        <p className="mt-6 text-xs leading-5 text-slate-500">
          Demo only: listings and uploaded photos are saved in this browser&apos;s
          local storage. Large uploads can exceed browser storage limits.
          Client-side ownership checks are not secure server-side authorization.
        </p>
      </div>
    </main>
  );
}
