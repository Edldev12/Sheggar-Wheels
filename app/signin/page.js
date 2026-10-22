"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function SigninPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [error, setError] = useState("");

  function handleSubmit(event) {
    event.preventDefault();
    setError("");

    const normalizedEmail = email.trim().toLowerCase();

    if (!normalizedEmail) {
      setError("Please enter your email address.");
      return;
    }

    try {
      const accounts = JSON.parse(
        localStorage.getItem("sheggar-accounts") || "[]"
      );

      const account = accounts.find(
        (item) => item.email === normalizedEmail
      );

      if (!account) {
        setError("No account found. Please create an account first.");
        return;
      }

      sessionStorage.setItem("sheggar-session", JSON.stringify(account));
      router.push("/");
    } catch {
      setError("Unable to sign in. Please try again.");
    }
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
          Welcome back
        </h1>

        <p className="mt-2 text-sm text-slate-600">
          Enter the email you used to create your demo account.
        </p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-5">
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
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              autoComplete="email"
              required
              placeholder="you@example.com"
              className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
            />
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
            Sign in
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-600">
          Don&apos;t have an account?{" "}
          <Link
            href="/signup"
            className="font-semibold text-emerald-700 hover:underline"
          >
            Create an account
          </Link>
        </p>

        <p className="mt-5 rounded-lg bg-amber-50 p-3 text-xs leading-5 text-amber-800">
          Demo only: sign-in checks the email stored in this browser. It does
          not verify identity or provide real account security.
        </p>
      </section>
    </main>
  );
}