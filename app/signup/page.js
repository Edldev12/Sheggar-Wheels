"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function SignupPage() {
  const router = useRouter();

  const [form, setForm] = useState({
    name: "",
    email: "",
    role: "renter",
  });

  const [error, setError] = useState("");

  function handleChange(event) {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  }

  function handleSubmit(event) {
    event.preventDefault();
    setError("");

    const name = form.name.trim();
    const email = form.email.trim().toLowerCase();

    if (!name || !email) {
      setError("Please complete all required fields.");
      return;
    }

    const accounts = JSON.parse(
      localStorage.getItem("sheggar-accounts") || "[]"
    );

    if (accounts.some((account) => account.email === email)) {
      setError("An account with this email already exists. Please sign in.");
      return;
    }

    const account = {
      id: crypto.randomUUID(),
      name,
      email,
      role: form.role,
      createdAt: new Date().toISOString(),
    };

    accounts.push(account);
    localStorage.setItem("sheggar-accounts", JSON.stringify(accounts));

    sessionStorage.setItem("sheggar-session", JSON.stringify(account));

    router.push("/");
  }

  return (
    <main className="flex flex-1 items-center justify-center bg-slate-50 px-4 py-12">
      <section className="w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <Link
          href="/"
          className="text-sm font-semibold text-emerald-700 hover:text-emerald-800"
        >
          ← Sheggar Wheels
        </Link>

        <h1 className="mt-6 text-3xl font-bold tracking-tight text-slate-900">
          Create your account
        </h1>
        <p className="mt-2 text-sm text-slate-600">
          Join Sheggar Wheels to rent or list a car in Addis Ababa.
        </p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-5">
          <div>
            <label
              htmlFor="name"
              className="mb-2 block text-sm font-medium text-slate-700"
            >
              Full name
            </label>
            <input
              id="name"
              name="name"
              value={form.name}
              onChange={handleChange}
              autoComplete="name"
              required
              className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
              placeholder="Enter your full name"
            />
          </div>

          <div>
            <label
              htmlFor="email"
              className="mb-2 block text-sm font-medium text-slate-700"
            >
              Email address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              autoComplete="email"
              required
              className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label
              htmlFor="role"
              className="mb-2 block text-sm font-medium text-slate-700"
            >
              I want to
            </label>
            <select
              id="role"
              name="role"
              value={form.role}
              onChange={handleChange}
              className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
            >
              <option value="renter">Rent a car</option>
              <option value="owner">List my car for rent</option>
            </select>
          </div>

          {error && (
            <p
              role="alert"
              className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700"
            >
              {error}
            </p>
          )}

          <button
            type="submit"
            className="w-full rounded-lg bg-emerald-700 px-4 py-3 font-semibold text-white transition hover:bg-emerald-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
          >
            Create account
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-600">
          Already have an account?{" "}
          <Link
            href="/signin"
            className="font-semibold text-emerald-700 hover:underline"
          >
            Sign in
          </Link>
        </p>

        <p className="mt-5 rounded-lg bg-amber-50 p-3 text-xs leading-5 text-amber-800">
          Demo account only: this capstone stores profile information in your
          browser. It does not provide real authentication or account security.
        </p>
      </section>
    </main>
  );
}