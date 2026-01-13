"use client";
import { useState } from "react";
import Link from "next/link";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const isValid =
      email.trim() === "founder@example.com" && password === "secure123";
    setTimeout(() => {
      if (!isValid) {
        setError("Invalid email or password. Try again.");
        setLoading(false);
      } else {
        setLoading(false);
      }
    }, 1200);
  }

  function handleSocial(provider: "google" | "apple") {
    setError(null);
    setLoading(true);
    setTimeout(() => {
      setError(`Social sign-in with ${provider} is not configured.`);
      setLoading(false);
    }, 1000);
  }

  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-900 dark:bg-black dark:text-zinc-50">
      <div className="mx-auto flex min-h-screen max-w-7xl flex-col md:flex-row">
        <aside className="flex w-full items-center justify-center px-8 py-16 md:w-1/2 md:px-16">
          <div className="w-full max-w-md">
            <div className="mb-10 flex items-center gap-3">
              <div className="h-8 w-8 rounded-md bg-zinc-900 dark:bg-zinc-50" />
              <span className="text-xl font-semibold">LearnX</span>
            </div>
            <h2 className="text-3xl font-semibold leading-tight tracking-tight">
              Launch premium courses with commerce and community built in
            </h2>
            <p className="mt-4 text-zinc-600 dark:text-zinc-400">
              Sell, engage, and grow with a single platform designed for
              creators, institutes, and teams.
            </p>
            <div className="mt-8 flex items-center gap-4 text-zinc-500 dark:text-zinc-400">
              <span className="text-sm">Trusted by operators worldwide</span>
            </div>
          </div>
        </aside>

        <main className="flex w-full items-center justify-center px-8 py-16 md:w-1/2 md:px-16">
          <div className="w-full max-w-md rounded-xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
            <div className="px-6 pt-6">
              <h3 className="text-xl font-semibold">Welcome back</h3>
              <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
                Sign in to continue
              </p>
            </div>

            {error && (
              <div className="mx-6 mt-4 rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700 dark:border-rose-800 dark:bg-rose-950/50 dark:text-rose-300">
                <div className="flex items-center justify-between">
                  <span>{error}</span>
                  <Link
                    href="/forgot-password"
                    className="font-medium text-rose-700 underline underline-offset-4 dark:text-rose-300"
                  >
                    Reset password
                  </Link>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="px-6 pb-6 pt-4">
              <div className="space-y-4">
                <div>
                  <label
                    htmlFor="email"
                    className="text-sm font-medium text-zinc-800 dark:text-zinc-200"
                  >
                    Email
                  </label>
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    aria-invalid={Boolean(error)}
                    disabled={loading}
                    placeholder="you@company.com"
                    className="mt-1 h-10 w-full rounded-lg border border-zinc-300 bg-white px-3 text-sm outline-none ring-0 transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 disabled:cursor-not-allowed disabled:bg-zinc-100 dark:border-zinc-700 dark:bg-zinc-900 dark:focus:border-indigo-400 dark:disabled:bg-zinc-800"
                  />
                  {error && (
                    <p className="mt-1 text-xs text-rose-600 dark:text-rose-400">
                      Check your email and password.
                    </p>
                  )}
                </div>
                <div>
                  <div className="flex items-center justify-between">
                    <label
                      htmlFor="password"
                      className="text-sm font-medium text-zinc-800 dark:text-zinc-200"
                    >
                      Password
                    </label>
                    <Link
                      href="/forgot-password"
                      className="text-sm font-medium text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300"
                    >
                      Forgot password?
                    </Link>
                  </div>
                  <input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    aria-invalid={Boolean(error)}
                    disabled={loading}
                    className="mt-1 h-10 w-full rounded-lg border border-zinc-300 bg-white px-3 text-sm outline-none ring-0 transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 disabled:cursor-not-allowed disabled:bg-zinc-100 dark:border-zinc-700 dark:bg-zinc-900 dark:focus:border-indigo-400 dark:disabled:bg-zinc-800"
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading || !email || !password}
                  className="inline-flex h-10 w-full items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 text-sm font-medium text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-indigo-500 dark:hover:bg-indigo-600"
                >
                  {loading && (
                    <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-white/60 border-t-transparent" />
                  )}
                  {loading ? "Signing in…" : "Sign in"}
                </button>
              </div>

              <div className="mt-6 flex items-center gap-3 text-sm text-zinc-500 dark:text-zinc-400">
                <span className="h-px w-full bg-zinc-200 dark:bg-zinc-800" />
                <span>or continue with</span>
                <span className="h-px w-full bg-zinc-200 dark:bg-zinc-800" />
              </div>

              <div className="mt-4 grid grid-cols-2 gap-3">
                <button
                  type="button"
                  disabled={loading}
                  onClick={() => handleSocial("google")}
                  className="inline-flex h-10 items-center justify-center gap-2 rounded-lg border border-zinc-300 bg-white px-4 text-sm font-medium text-zinc-900 transition hover:bg-zinc-50 disabled:cursor-not-allowed disabled:opacity-60 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:hover:bg-zinc-800"
                >
                  <GoogleIcon />
                  {loading ? "Loading…" : "Google"}
                </button>
                <button
                  type="button"
                  disabled={loading}
                  onClick={() => handleSocial("apple")}
                  className="inline-flex h-10 items-center justify-center gap-2 rounded-lg border border-zinc-300 bg-white px-4 text-sm font-medium text-zinc-900 transition hover:bg-zinc-50 disabled:cursor-not-allowed disabled:opacity-60 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:hover:bg-zinc-800"
                >
                  <AppleIcon />
                  {loading ? "Loading…" : "Apple"}
                </button>
              </div>
            </form>
            <div className="px-6 pb-6">
              <div className="text-center text-xs text-zinc-500 dark:text-zinc-400">
                Need help?{" "}
                <Link
                  href="/support"
                  className="font-medium text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300"
                >
                  Contact support
                </Link>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

function GoogleIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className="h-4 w-4"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M12 4.5c2.03 0 3.87.78 5.26 2.05l-2.13 2.13A6.3 6.3 0 0 0 12 7.5a6.5 6.5 0 1 0 6.18 4.62h-6.18v-3h10.5c.08.48.12.97.12 1.5 0 5.8-4.7 10.5-10.5 10.5S1.5 16.8 1.5 11S6.2.5 12 .5z"
        className="fill-indigo-600 dark:fill-indigo-400"
      />
    </svg>
  );
}

function AppleIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className="h-4 w-4"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M16.365 12.155c-.02-2.063 1.69-3.048 1.764-3.093-0.96-1.402-2.45-1.594-2.98-1.615-1.264-.128-2.463.743-3.104.743-.64 0-1.632-.725-2.686-.706-1.381.02-2.657.805-3.362 2.05-1.437 2.488-.367 6.155 1.032 8.168.684.987 1.496 2.093 2.56 2.058 1.025-.04 1.41-.664 2.65-.664 1.24 0 1.597.664 2.69.644 1.116-.02 1.823-.987 2.504-1.979.78-1.144 1.113-2.255 1.132-2.315-.024-.013-2.165-.83-2.2-3.291zM14.32 6.85c.52-.632.868-1.513.773-2.39-.75.03-1.656.5-2.2 1.13-.48.556-.9 1.45-.79 2.306.834.064 1.695-.424 2.218-1.046z" />
    </svg>
  );
}
