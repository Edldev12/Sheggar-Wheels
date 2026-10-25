"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function AdminUsersPage() {
  const [users, setUsers] = useState([]);
  const [session, setSession] = useState(null);
  const [loaded, setLoaded] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    function loadUsers() {
      try {
        const savedSession = sessionStorage.getItem("sheggar-session");
        const savedAccounts = localStorage.getItem("sheggar-accounts");

        setSession(savedSession ? JSON.parse(savedSession) : null);

        const accounts = savedAccounts ? JSON.parse(savedAccounts) : [];
        setUsers(Array.isArray(accounts) ? accounts : []);
      } catch {
        setMessage("Unable to load registered users.");
      } finally {
        setLoaded(true);
      }
    }

    loadUsers();
  }, []);

  if (!loaded) {
    return <main className="p-8">Loading users...</main>;
  }

  if (session?.role !== "admin") {
    return (
      <main className="p-8">
        <h1 className="text-2xl font-bold">Access denied</h1>
        <p className="mt-2">Only administrators can view registered users.</p>
        <Link href="/signin" className="mt-4 inline-block underline">
          Go to sign in
        </Link>
      </main>
    );
  }

  const getRoleStyle = (role) => {
    switch (role) {
      case "admin":
        return "bg-purple-100 text-purple-800";
      case "owner":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <main className="min-h-screen bg-gray-50 p-6 text-gray-900 md:p-10">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">Registered Users</h1>
            <p className="mt-2 text-gray-600">
              Manage and review Sheggar Wheels accounts.
            </p>
          </div>

          <Link
            href="/admin"
            className="rounded-lg bg-gray-900 px-4 py-2 text-white hover:bg-gray-700"
          >
            Back to Dashboard
          </Link>
        </div>

        <div className="mb-6 grid gap-4 sm:grid-cols-3">
          <div className="rounded-xl border bg-white p-5">
            <p className="text-sm text-gray-500">Total Users</p>
            <p className="mt-2 text-3xl font-bold">{users.length}</p>
          </div>

          <div className="rounded-xl border bg-white p-5">
            <p className="text-sm text-gray-500">Owners</p>
            <p className="mt-2 text-3xl font-bold">
              {users.filter((user) => user.role === "owner").length}
            </p>
          </div>

          <div className="rounded-xl border bg-white p-5">
            <p className="text-sm text-gray-500">Renters</p>
            <p className="mt-2 text-3xl font-bold">
              {users.filter((user) => user.role === "renter").length}
            </p>
          </div>
        </div>

        {message && (
          <p className="mb-4 rounded-lg bg-red-100 p-3 text-red-800">
            {message}
          </p>
        )}

        <div className="overflow-x-auto rounded-xl border bg-white">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-100 text-gray-600">
              <tr>
                <th className="px-5 py-4">#</th>
                <th className="px-5 py-4">Name</th>
                <th className="px-5 py-4">Email</th>
                <th className="px-5 py-4">Role</th>
              </tr>
            </thead>

            <tbody className="divide-y">
              {users.length > 0 ? (
                users.map((user, index) => (
                  <tr key={user.id ?? user.email ?? index}>
                    <td className="px-5 py-4">{index + 1}</td>
                    <td className="px-5 py-4 font-medium">
                      {user.name || "Not provided"}
                    </td>
                    <td className="px-5 py-4">
                      {user.email || "Not provided"}
                    </td>
                    <td className="px-5 py-4">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold ${getRoleStyle(
                          user.role
                        )}`}
                      >
                        {user.role || "renter"}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={4}
                    className="px-5 py-10 text-center text-gray-500"
                  >
                    No registered users found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <p className="mt-4 text-sm text-gray-500">
          This demo reads accounts stored in this browser only.
        </p>
      </div>
    </main>
  );
}