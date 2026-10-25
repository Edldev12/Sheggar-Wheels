"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function OwnerProfilePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState(null);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const timer = window.setTimeout(() => {
      try {
        const saved = sessionStorage.getItem("sheggar-session");
        const account = saved ? JSON.parse(saved) : null;

        if (!account || account.role !== "owner") {
          router.replace("/signin");
          return;
        }

        setSession(account);
        setName(account.name || "");
        setPhone(account.phone || "");
      } catch {
        router.replace("/signin");
      } finally {
        setLoading(false);
      }
    }, 0);

    return () => window.clearTimeout(timer);
  }, [router]);

  function handleSave(event) {
    event.preventDefault();
    setError("");
    setMessage("");

    const cleanName = name.trim();
    const cleanPhone = phone.trim();

    if (!cleanName) {
      setError("Please enter your name.");
      return;
    }

    try {
      const updatedSession = {
        ...session,
        name: cleanName,
        phone: cleanPhone,
      };

      sessionStorage.setItem(
        "sheggar-session",
        JSON.stringify(updatedSession)
      );

      // Update the matching demo account, if it exists.
      const accounts = JSON.parse(
        localStorage.getItem("sheggar-accounts") || "[]"
      );

      if (Array.isArray(accounts)) {
        const updatedAccounts = accounts.map((account) => {
          const sameAccount =
            (session.id != null && account.id === session.id) ||
            (session.email &&
              account.email?.toLowerCase() === session.email.toLowerCase());

          return sameAccount
            ? { ...account, name: cleanName, phone: cleanPhone }
            : account;
        });

        localStorage.setItem(
          "sheggar-accounts",
          JSON.stringify(updatedAccounts)
        );
      }

      setSession(updatedSession);
      setMessage("Your profile was updated in this browser.");
    } catch {
      setError("Unable to save your profile. Please try again.");
    }
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-slate-950 p-8 text-white">
        Loading profile...
      </main>
    );
  }

  if (!session) return null;

  return (
    <main className="min-h-screen bg-slate-950 px-4 py-10 text-white sm:px-6">
      <div className="mx-auto max-w-3xl">
        <Link
          href="/owener/dashboard"
          className="text-sm text-orange-400 hover:text-orange-300"
        >
          ← Owner dashboard
        </Link>

        <header className="mt-7">
          <p className="text-sm font-semibold uppercase tracking-widest text-orange-400">
            Sheggar Wheels
          </p>
          <h1 className="mt-2 text-3xl font-bold sm:text-4xl">
            Owner profile
          </h1>
          <p className="mt-3 text-slate-400">
            Manage your account information.
          </p>
        </header>

        <section className="mt-8 rounded-3xl border border-white/10 bg-slate-900 p-6 sm:p-8">
          <div className="mb-7 flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-orange-500/15 text-2xl font-bold text-orange-400">
              {(name || "O").charAt(0).toUpperCase()}
            </div>
            <div>
              <h2 className="text-xl font-bold">{session.name || "Car Owner"}</h2>
              <p className="mt-1 text-sm text-slate-400">
                {session.email || "No email available"}
              </p>
              <span className="mt-2 inline-block rounded-full bg-orange-500/10 px-3 py-1 text-xs font-semibold text-orange-400">
                Owner account
              </span>
            </div>
          </div>

          <form onSubmit={handleSave} className="space-y-5">
            <div>
              <label htmlFor="owner-name" className="mb-2 block text-sm font-medium text-slate-300">
                Full name
              </label>
              <input
                id="owner-name"
                value={name}
                onChange={(event) => setName(event.target.value)}
                required
                maxLength={100}
                className="w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-3 outline-none focus:border-orange-400"
                placeholder="Enter your full name"
              />
            </div>

            <div>
              <label htmlFor="owner-email" className="mb-2 block text-sm font-medium text-slate-300">
                Email address
              </label>
              <input
                id="owner-email"
                value={session.email || ""}
                readOnly
                className="w-full cursor-not-allowed rounded-xl border border-white/10 bg-slate-950/60 px-4 py-3 text-slate-400"
              />
              <p className="mt-2 text-xs text-slate-500">
                Email cannot be changed on this demo profile page.
              </p>
            </div>

            <div>
              <label htmlFor="owner-phone" className="mb-2 block text-sm font-medium text-slate-300">
                Phone number
              </label>
              <input
                id="owner-phone"
                type="tel"
                value={phone}
                onChange={(event) => setPhone(event.target.value)}
                maxLength={30}
                className="w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-3 outline-none focus:border-orange-400"
                placeholder="Enter your phone number"
              />
            </div>

            {error && (
              <p role="alert" className="rounded-xl bg-red-500/10 p-3 text-sm text-red-300">
                {error}
              </p>
            )}

            {message && (
              <p role="status" className="rounded-xl bg-green-500/10 p-3 text-sm text-green-300">
                {message}
              </p>
            )}

            <button
              type="submit"
              className="w-full rounded-xl bg-orange-500 px-5 py-3 font-semibold hover:bg-orange-400"
            >
              Save profile
            </button>
          </form>
        </section>

        <p className="mt-5 text-xs leading-5 text-slate-500">
          Demo mode: profile changes are saved to this browser&apos;s session and
          local account storage. This is not a server-backed account system.
        </p>
      </div>
    </main>
  );
}
