"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { LogIn, AlertCircle } from "lucide-react";

export default function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Invalid credentials");
        return;
      }

      // Redirect to dashboard
      router.push("/admin/dashboard");
    } catch (err) {
      setError("Something went wrong. Please try again.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-linear-to-br from-dental-gray-50 to-dental-gray-100 px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md rounded-2xl border border-dental-gray-200 bg-white p-8 shadow-lg sm:p-10">
        {/* Header */}
        <div className="text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-dental-primary/10 text-dental-primary mx-auto mb-4">
            <LogIn className="h-6 w-6" />
          </div>
          <h1 className="text-2xl font-bold text-dental-gray-900">
            SmileCraft Admin
          </h1>
          <p className="mt-2 text-sm text-dental-gray-600">
            Sign in to manage appointments
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="mt-8 space-y-4">
          {error && (
            <div className="flex gap-3 rounded-lg bg-red-50 p-4">
              <AlertCircle className="h-5 w-5 shrink-0 text-red-600 mt-0.5" />
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-dental-gray-900">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@example.com"
              required
              className="mt-2 block w-full rounded-lg border border-dental-gray-300 px-4 py-2.5 text-dental-gray-900 shadow-sm focus:border-dental-primary focus:outline-none focus:ring-2 focus:ring-dental-primary focus:ring-offset-0"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-dental-gray-900">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              className="mt-2 block w-full rounded-lg border border-dental-gray-300 px-4 py-2.5 text-dental-gray-900 shadow-sm focus:border-dental-primary focus:outline-none focus:ring-2 focus:ring-dental-primary focus:ring-offset-0"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="mt-6 w-full rounded-lg bg-dental-primary py-2.5 text-center font-semibold text-white transition-colors hover:bg-dental-primary-dark focus:outline-none focus:ring-2 focus:ring-dental-primary focus:ring-offset-2 disabled:opacity-70"
          >
            {isLoading ? "Signing in..." : "Sign in"}
          </button>
        </form>

        {/* Footer */}
        <p className="mt-6 text-center text-xs text-dental-gray-500">
          SmileCraft Dental Admin Panel
        </p>
      </div>
    </div>
  );
}
