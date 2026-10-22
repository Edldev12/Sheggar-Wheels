"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function SiteNavigation() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      try {
        const savedSession = sessionStorage.getItem("sheggar-session");
        setUser(savedSession ? JSON.parse(savedSession) : null);
      } catch {
        sessionStorage.removeItem("sheggar-session");
        setUser(null);
      }
    }, 0);

    return () => window.clearTimeout(timer);
  }, []);

  function handleSignOut() {
    sessionStorage.removeItem("sheggar-session");
    setUser(null);
  }

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/95 backdrop-blur">
      <nav className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-4 lg:px-8">
        <Link href="/" className="flex shrink-0 items-center gap-2">
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
          <Link
            href="/#how-it-works"
            className="transition hover:text-orange-500"
          >
            How it works
          </Link>
          <Link
            href="/#why-us"
            className="transition hover:text-orange-500"
          >
            Why Sheggar
          </Link>
        </div>

        <div className="flex shrink-0 items-center gap-2 sm:gap-3">
          {user ? (
            <>
              <div className="hidden text-right sm:block">
                <p className="max-w-36 truncate text-sm font-bold text-slate-900">
                  {user.name}
                </p>
                <p className="text-xs capitalize text-slate-500">
                  {user.role} demo account
                </p>
              </div>


              <button
                type="button"
                onClick={handleSignOut}
                className="rounded-xl border border-slate-200 px-3 py-2.5 text-sm font-bold text-slate-700 transition hover:border-orange-300 hover:bg-orange-50 hover:text-orange-700"
              >
                Sign out
              </button>
            </>
          ) : (
            <>
              <Link
                href="/signin"
                className="rounded-xl px-3 py-2.5 text-sm font-bold text-slate-700 transition hover:bg-slate-100 sm:px-4"
              >
                Sign in
              </Link>

              <Link
                href="/signup"
                className="rounded-xl bg-orange-500 px-3 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-orange-600 sm:px-4"
              >
                Get started
              </Link>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}