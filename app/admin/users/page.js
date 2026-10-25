"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";

export default function AdminUsersPage() {
  const [users, setUsers] = useState([]);
  const [session, setSession] = useState(null);
  const [loaded, setLoaded] = useState(false);
  const [message, setMessage] = useState("");
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");

  useEffect(() => {
    const timer = window.setTimeout(() => {
      try {
        const savedSession = sessionStorage.getItem("sheggar-session");
        const savedAccounts = localStorage.getItem("sheggar-accounts");

        setSession(savedSession ? JSON.parse(savedSession) : null);

        const accounts = savedAccounts
          ? JSON.parse(savedAccounts)
          : [];

        if (!Array.isArray(accounts)) {
          throw new Error("Invalid accounts data");
        }

        setUsers(accounts);
      } catch {
        setMessage("Unable to load registered users.");
      } finally {
        setLoaded(true);
      }
    }, 0);

    return () => window.clearTimeout(timer);
  }, []);

  const filteredUsers = useMemo(() => {
    const query = search.trim().toLowerCase();

    return users.filter((user) => {
      const role = user.role || "renter";

      const matchesSearch = [
        user.name,
        user.email,
        role,
      ].some((value) =>
        String(value ?? "").toLowerCase().includes(query)
      );

      const matchesRole =
        roleFilter === "all" || role === roleFilter;

      return matchesSearch && matchesRole;
    });
  }, [users, search, roleFilter]);

  const adminCount = users.filter(
    (user) => user.role === "admin"
  ).length;

  const ownerCount = users.filter(
    (user) => user.role === "owner"
  ).length;

  const renterCount = users.filter(
    (user) => (user.role || "renter") === "renter"
  ).length;

  function getRoleStyle(role) {
    switch (role) {
      case "admin":
        return "bg-purple-500/15 text-purple-300 ring-purple-500/20";
      case "owner":
        return "bg-blue-500/15 text-blue-300 ring-blue-500/20";
      default:
        return "bg-slate-500/15 text-slate-300 ring-slate-500/20";
    }
  }

  if (!loaded) {
    return (
      <main className="min-h-screen bg-slate-950 p-8 text-white">
        Loading users...
      </main>
    );
  }

  if (session?.role !== "admin") {
    return (
      <main className="min-h-screen bg-slate-950 p-8 text-white">
        <h1 className="text-2xl font-bold">Access denied</h1>
        <p className="mt-2 text-slate-400">
          Only administrators can view registered users.
        </p>
        <Link
          href="/signin"
          className="mt-4 inline-block rounded-lg bg-orange-500 px-4 py-2 font-semibold text-white hover:bg-orange-400"
        >
          Go to sign in
        </Link>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-950 px-4 py-10 text-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <Link
          href="/admin"
          className="text-sm font-semibold text-slate-400 transition hover:text-orange-400"
        >
          ← Back to dashboard
        </Link>

        <div className="mt-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-orange-400">
              Sheggar Wheels
            </p>
            <h1 className="mt-2 text-3xl font-bold sm:text-4xl">
              Manage Users
            </h1>
            <p className="mt-2 text-slate-400">
              Review registered accounts and filter users by role.
            </p>
          </div>

          <Link
            href="/admin"
            className="w-fit rounded-xl border border-white/10 px-4 py-3 text-sm font-semibold transition hover:bg-white/5"
          >
            Admin Dashboard
          </Link>
        </div>

        {message && (
          <p
            role="alert"
            className="mt-6 rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-red-300"
          >
            {message}
          </p>
        )}

        <section className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-2xl border border-white/10 bg-slate-900 p-5">
            <p className="text-sm text-slate-400">Total Users</p>
            <p className="mt-2 text-3xl font-bold">{users.length}</p>
            <p className="mt-2 text-xs text-slate-500">
              All registered accounts
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-slate-900 p-5">
            <p className="text-sm text-slate-400">Administrators</p>
            <p className="mt-2 text-3xl font-bold text-purple-300">
              {adminCount}
            </p>
            <p className="mt-2 text-xs text-slate-500">
              Admin accounts
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-slate-900 p-5">
            <p className="text-sm text-slate-400">Car Owners</p>
            <p className="mt-2 text-3xl font-bold text-blue-300">
              {ownerCount}
            </p>
            <p className="mt-2 text-xs text-slate-500">
              Owner accounts
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-slate-900 p-5">
            <p className="text-sm text-slate-400">Renters</p>
            <p className="mt-2 text-3xl font-bold text-slate-200">
              {renterCount}
            </p>
            <p className="mt-2 text-xs text-slate-500">
              Renter accounts
            </p>
          </div>
        </section>

        <section className="mt-8 rounded-2xl border border-white/10 bg-slate-900 p-4 sm:p-6">
          <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
            <div>
              <h2 className="text-xl font-bold">Registered Accounts</h2>
              <p className="mt-1 text-sm text-slate-400">
                Showing {filteredUsers.length} of {users.length} accounts.
              </p>
            </div>

            <div className="flex w-full flex-col gap-3 sm:flex-row lg:max-w-2xl">
              <input
                type="search"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search name, email, or role..."
                aria-label="Search users"
                className="min-w-0 flex-1 rounded-xl border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none placeholder:text-slate-500 focus:border-orange-400"
              />

              <select
                value={roleFilter}
                onChange={(event) => setRoleFilter(event.target.value)}
                aria-label="Filter users by role"
                className="rounded-xl border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none focus:border-orange-400"
              >
                <option value="all">All Roles</option>
                <option value="admin">Administrators</option>
                <option value="owner">Owners</option>
                <option value="renter">Renters</option>
              </select>
            </div>
          </div>

          <div className="mt-6 overflow-x-auto">
            <table className="w-full min-w-[650px] text-left text-sm">
              <thead className="bg-slate-950 text-slate-400">
                <tr>
                  <th className="rounded-l-lg p-4">#</th>
                  <th className="p-4">Name</th>
                  <th className="p-4">Email</th>
                  <th className="rounded-r-lg p-4">Role</th>
                </tr>
              </thead>

              <tbody>
                {filteredUsers.length > 0 ? (
                  filteredUsers.map((user, index) => {
                    const role = user.role || "renter";

                    return (
                      <tr
                        key={user.id ?? user.email ?? index}
                        className="border-t border-white/10 transition hover:bg-white/[0.03]"
                      >
                        <td className="p-4 text-slate-500">
                          {index + 1}
                        </td>

                        <td className="p-4 font-medium">
                          {user.name || "Not provided"}
                        </td>

                        <td className="p-4 text-slate-300">
                          {user.email || "Not provided"}
                        </td>

                        <td className="p-4">
                          <span
                            className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold capitalize ring-1 ${getRoleStyle(role)}`}
                          >
                            {role}
                          </span>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td
                      colSpan={4}
                      className="p-10 text-center text-slate-400"
                    >
                      {users.length === 0
                        ? "No registered users found."
                        : "No users match your search or selected role."}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {(search || roleFilter !== "all") && (
            <button
              type="button"
              onClick={() => {
                setSearch("");
                setRoleFilter("all");
              }}
              className="mt-4 rounded-lg border border-white/10 px-4 py-2 text-sm font-semibold text-slate-300 transition hover:bg-white/5"
            >
              Clear filters
            </button>
          )}
        </section>

        <p className="mt-5 text-xs leading-5 text-slate-500">
          This demo reads accounts from this browser&apos;s localStorage.
          Changes are not synchronized across devices. The client-side admin
          check is for demonstration only and is not server-side security.
        </p>
      </div>
    </main>
  );
}
