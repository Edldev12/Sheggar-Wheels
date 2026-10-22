import Link from "next/link";

const featuredCars = [
  {
    id: 1,
    name: "Toyota Corolla",
    year: 2022,
    type: "Economy",
    transmission: "Automatic",
    seats: 5,
    price: 2500,
    rating: "4.9",
    location: "Bole, Addis Ababa",
    image:
      "https://images.unsplash.com/photo-1623869675781-80aa31012a5a?auto=format&fit=crop&w=1000&q=85",
    tag: "Popular",
  },
  {
    id: 2,
    name: "Hyundai Tucson",
    year: 2023,
    type: "SUV",
    transmission: "Automatic",
    seats: 5,
    price: 4200,
    rating: "4.8",
    location: "Kazanchis, Addis Ababa",
    image:
      "https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?auto=format&fit=crop&w=1000&q=85",
    tag: "Great for trips",
  },
  {
    id: 3,
    name: "Toyota Land Cruiser",
    year: 2021,
    type: "Premium SUV",
    transmission: "Automatic",
    seats: 7,
    price: 7500,
    rating: "5.0",
    location: "Old Airport, Addis Ababa",
    image:
      "https://images.unsplash.com/photo-151 SUV?auto=format&fit=crop&w=1000&q=85",
    tag: "Premium",
  },
];

const benefits = [
  {
    icon: "🚘",
    title: "Cars for every journey",
    description:
      "From daily city drives to comfortable family road trips.",
  },
  {
    icon: "📍",
    title: "Find cars near you",
    description:
      "Discover available rental cars across Addis Ababa.",
  },
  {
    icon: "🤝",
    title: "Rent directly from owners",
    description:
      "Explore car listings and connect with local car owners.",
  },
];

export default function Home() {
  return (
    <main className="min-h-screen bg-[#f8f9fc] text-slate-900">
      {/* Navigation */}
      <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/95 backdrop-blur">
        <nav className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 lg:px-8">
          <Link href="/" className="flex items-center gap-2">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-500 text-xl text-white">
              🚗
            </span>
            <span className="text-xl font-extrabold tracking-tight">
              Sheggar<span className="text-orange-500">Wheels</span>
            </span>
          </Link>

          <div className="hidden items-center gap-8 text-sm font-semibold text-slate-600 md:flex">
            <Link href="/cars" className="transition hover:text-orange-500">
              Browse cars
            </Link>
            <a href="#how-it-works" className="transition hover:text-orange-500">
              How it works
            </a>
            <a href="#why-us" className="transition hover:text-orange-500">
              Why Sheggar
            </a>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/signin"
              className="hidden rounded-xl px-4 py-2.5 text-sm font-bold text-slate-700 transition hover:bg-slate-100 sm:inline-flex"
            >
              Sign in
            </Link>
            <Link
              href="/signup"
              className="rounded-xl bg-orange-500 px-4 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-orange-600"
            >
              Get started
            </Link>
          </div>
        </nav>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden bg-[#101b32]">
        <div className="absolute -right-24 -top-24 h-80 w-80 rounded-full bg-orange-500/20 blur-3xl" />
        <div className="absolute -bottom-32 left-0 h-80 w-80 rounded-full bg-blue-500/20 blur-3xl" />

        <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-5 py-16 md:py-24 lg:grid-cols-2 lg:px-8">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm font-medium text-orange-200">
              <span className="h-2 w-2 rounded-full bg-orange-400" />
              Your journey starts here
            </span>

            <h1 className="mt-6 max-w-2xl text-4xl font-black leading-tight tracking-tight text-white sm:text-5xl lg:text-6xl">
              The right car.
              <br />
              <span className="text-orange-400">Your next adventure.</span>
            </h1>

            <p className="mt-6 max-w-xl text-base leading-8 text-slate-300 sm:text-lg">
              Discover cars from local owners in Addis Ababa. Find the right
              ride for your plans, your comfort, and your budget.
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                href="/cars"
                className="rounded-xl bg-orange-500 px-6 py-3.5 font-bold text-white shadow-lg shadow-orange-500/20 transition hover:-translate-y-0.5 hover:bg-orange-600"
              >
                Explore available cars →
              </Link>
              <Link
                href="/signup"
                className="rounded-xl border border-white/25 px-6 py-3.5 font-bold text-white transition hover:bg-white/10"
              >
                Become a car owner
              </Link>
            </div>

            <div className="mt-10 flex flex-wrap gap-8 border-t border-white/15 pt-7">
              <div>
                <p className="text-2xl font-extrabold text-white">Local</p>
                <p className="mt-1 text-sm text-slate-400">Car owners</p>
              </div>
              <div>
                <p className="text-2xl font-extrabold text-white">Flexible</p>
                <p className="mt-1 text-sm text-slate-400">Rental choices</p>
              </div>
              <div>
                <p className="text-2xl font-extrabold text-white">Simple</p>
                <p className="mt-1 text-sm text-slate-400">Booking journey</p>
              </div>
            </div>
          </div>

          {/* Hero image */}
          <div className="relative">
            <div className="absolute -inset-4 rounded-[2rem] bg-orange-500/10 blur-2xl" />
            <div
              role="img"
              aria-label="Car ready for a journey"
              className="relative min-h-[300px] overflow-hidden rounded-[2rem] border border-white/15 bg-slate-800 bg-cover bg-center shadow-2xl sm:min-h-[430px]"
              style={{
                backgroundImage:
                  "url('https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1400&q=90')",
              }}
            >
              <div className="absolute inset-0 bg-gradient-to-t from-[#101b32]/90 via-transparent to-transparent" />
              <div className="absolute bottom-5 left-5 right-5 rounded-2xl border border-white/20 bg-white/95 p-4 shadow-xl backdrop-blur sm:bottom-7 sm:left-7 sm:right-7 sm:p-5">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-orange-600">
                      Find your next ride
                    </p>
                    <p className="mt-1 text-lg font-extrabold text-slate-900">
                      Your city, your journey.
                    </p>
                  </div>
                  <Link
                    href="/cars"
                    aria-label="Browse cars"
                    className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-orange-500 text-xl text-white transition hover:bg-orange-600"
                  >
                    →
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Search panel */}
      <section className="relative z-10 mx-auto -mt-1 max-w-7xl px-5 py-8 lg:px-8">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-lg shadow-slate-200/50 sm:p-7">
          <div className="mb-5">
            <h2 className="text-xl font-extrabold">Find your perfect car</h2>
            <p className="mt-1 text-sm text-slate-500">
              Start exploring rental options in Addis Ababa.
            </p>
          </div>

          <form action="/cars" method="GET" className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <label className="block">
              <span className="mb-2 block text-sm font-bold text-slate-700">
                Location
              </span>
              <input
                type="text"
                name="location"
                placeholder="e.g. Bole, Addis Ababa"
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-sm outline-none transition placeholder:text-slate-400 focus:border-orange-400 focus:ring-4 focus:ring-orange-100"
              />
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-bold text-slate-700">
                Car type
              </span>
              <select
                name="type"
                defaultValue=""
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-sm outline-none transition focus:border-orange-400 focus:ring-4 focus:ring-orange-100"
              >
                <option value="">All car types</option>
                <option value="Economy">Economy</option>
                <option value="SUV">SUV</option>
                <option value="Sedan">Sedan</option>
                <option value="Premium">Premium</option>
              </select>
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-bold text-slate-700">
                Maximum daily price
              </span>
              <select
                name="maxPrice"
                defaultValue=""
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-sm outline-none transition focus:border-orange-400 focus:ring-4 focus:ring-orange-100"
              >
                <option value="">Any price</option>
                <option value="3000">Up to ETB 3,000</option>
                <option value="5000">Up to ETB 5,000</option>
                <option value="8000">Up to ETB 8,000</option>
              </select>
            </label>

            <div className="flex items-end">
              <button
                type="submit"
                className="w-full rounded-xl bg-orange-500 px-5 py-3.5 font-bold text-white transition hover:bg-orange-600"
              >
                Search cars →
              </button>
            </div>
          </form>
        </div>
      </section>

      {/* Featured cars */}
      <section className="mx-auto max-w-7xl px-5 py-14 lg:px-8 lg:py-20">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="text-sm font-extrabold uppercase tracking-[0.2em] text-orange-500">
              Handpicked for you
            </p>
            <h2 className="mt-3 text-3xl font-black tracking-tight sm:text-4xl">
              Featured cars
            </h2>
            <p className="mt-3 max-w-xl leading-7 text-slate-500">
              Explore a few example listings to see what your next journey
              could look like.
            </p>
          </div>

          <Link
            href="/cars"
            className="inline-flex w-fit items-center gap-2 font-bold text-orange-600 transition hover:text-orange-700"
          >
            View all cars <span aria-hidden="true">→</span>
          </Link>
        </div>

        <div className="mt-9 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {featuredCars.map((car) => (
            <article
              key={car.id}
              className="group overflow-hidden rounded-2xl border border-slate-200 bg-white transition duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-slate-200/70"
            >
              <div className="relative h-56 overflow-hidden bg-slate-200">
                <div
                  role="img"
                  aria-label={car.name}
                  className="h-full w-full bg-cover bg-center transition duration-500 group-hover:scale-105"
                  style={{ backgroundImage: `url("${car.image}")` }}
                />
                <span className="absolute left-4 top-4 rounded-full bg-white px-3 py-1.5 text-xs font-extrabold text-slate-800 shadow">
                  {car.tag}
                </span>
                <span className="absolute right-4 top-4 rounded-full bg-slate-900/80 px-3 py-1.5 text-xs font-bold text-white">
                  ★ {car.rating}
                </span>
              </div>

              <div className="p-5">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="text-xl font-extrabold">{car.name}</h3>
                    <p className="mt-1 text-sm text-slate-500">
                      {car.year} · {car.type}
                    </p>
                  </div>
                  <div className="shrink-0 text-right">
                    <p className="text-lg font-black text-orange-600">
                      {car.price.toLocaleString("en-US")}
                    </p>
                    <p className="text-xs text-slate-500">ETB / day</p>
                  </div>
                </div>

                <p className="mt-4 flex items-center gap-2 text-sm text-slate-500">
                  <span aria-hidden="true">📍</span>
                  {car.location}
                </p>

                <div className="mt-4 flex flex-wrap gap-2 border-t border-slate-100 pt-4 text-xs font-semibold text-slate-600">
                  <span className="rounded-lg bg-slate-100 px-3 py-2">
                    👥 {car.seats} seats
                  </span>
                  <span className="rounded-lg bg-slate-100 px-3 py-2">
                    ⚙ {car.transmission}
                  </span>
                </div>

                <Link
                  href={`/cars/${car.id}`}
                  className="mt-5 block rounded-xl border border-slate-200 py-3 text-center text-sm font-extrabold transition hover:border-orange-500 hover:bg-orange-50 hover:text-orange-600"
                >
                  View car details →
                </Link>
              </div>
            </article>
          ))}
        </div>

        <p className="mt-5 text-xs text-slate-400">
          Demo listings for the frontend capstone. Prices, ratings, availability,
          and vehicle details are illustrative, not live offers.
        </p>
      </section>

      {/* Benefits */}
      <section id="why-us" className="border-y border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-5 py-16 lg:px-8 lg:py-20">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-sm font-extrabold uppercase tracking-[0.2em] text-orange-500">
              Why Sheggar Wheels
            </p>
            <h2 className="mt-3 text-3xl font-black tracking-tight sm:text-4xl">
              A simpler way to find a car
            </h2>
            <p className="mt-4 leading-7 text-slate-500">
              Discover convenient rental options while supporting local car
              owners.
            </p>
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {benefits.map((benefit) => (
              <div
                key={benefit.title}
                className="rounded-2xl border border-slate-200 bg-[#f8f9fc] p-7 transition hover:border-orange-200 hover:bg-orange-50/50"
              >
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-orange-100 text-2xl">
                  {benefit.icon}
                </div>
                <h3 className="mt-5 text-lg font-extrabold">
                  {benefit.title}
                </h3>
                <p className="mt-3 leading-7 text-slate-500">
                  {benefit.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="mx-auto max-w-7xl px-5 py-16 lg:px-8 lg:py-20">
        <div className="rounded-3xl bg-[#101b32] px-6 py-10 sm:px-12 sm:py-14">
          <div className="grid items-center gap-10 lg:grid-cols-2">
            <div>
              <p className="text-sm font-extrabold uppercase tracking-[0.2em] text-orange-400">
                Get started in three steps
              </p>
              <h2 className="mt-4 text-3xl font-black leading-tight text-white sm:text-4xl">
                Your next ride is closer than you think.
              </h2>
              <p className="mt-4 max-w-lg leading-7 text-slate-300">
                Browse available cars, choose the dates that suit you, and
                follow the booking steps in one simple experience.
              </p>
            </div>

            <div className="space-y-5">
              {[
                ["01", "Find a car", "Search listings by location, type, and price."],
                ["02", "Choose your dates", "Review the car and your rental details."],
                ["03", "Complete your booking", "Review your booking summary and status."],
              ].map(([number, title, description]) => (
                <div key={number} className="flex gap-4">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-orange-500 font-black text-white">
                    {number}
                  </div>
                  <div>
                    <h3 className="font-extrabold text-white">{title}</h3>
                    <p className="mt-1 text-sm leading-6 text-slate-300">
                      {description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-10 border-t border-white/15 pt-8">
            <Link
              href="/cars"
              className="inline-flex rounded-xl bg-orange-500 px-6 py-3.5 font-bold text-white transition hover:bg-orange-600"
            >
              Start browsing cars →
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-5 px-5 py-8 sm:flex-row sm:items-center sm:justify-between lg:px-8">
          <Link href="/" className="text-lg font-extrabold">
            Sheggar<span className="text-orange-500">Wheels</span>
          </Link>
          <p className="text-sm text-slate-500">
            A car-rental marketplace frontend capstone project.
          </p>
          <p className="text-sm text-slate-400">
            © {new Date().getFullYear()} Sheggar Wheels
          </p>
        </div>
      </footer>
    </main>
  );
}
