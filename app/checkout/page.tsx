"use client";
import { useMemo, useState } from "react";
import Link from "next/link";

type Method = "card" | "upi" | "apple";

export default function CheckoutPage() {
  const course = { title: "AI Foundations", subtitle: "Aurora Labs", price: 199, currency: "USD" };
  const [email, setEmail] = useState("");
  const [coupon, setCoupon] = useState("");
  const [method, setMethod] = useState<Method>("card");
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [applied, setApplied] = useState<{ code: string; discount: number } | null>(null);

  const subtotal = course.price;
  const discount = applied?.discount ?? 0;
  const total = useMemo(() => Math.max(0, subtotal - discount), [subtotal, discount]);

  function applyCoupon() {
    setError(null);
    const code = coupon.trim().toUpperCase();
    if (!code) return;
    if (code === "SAVE20") {
      setApplied({ code, discount: Math.round(subtotal * 0.2) });
    } else if (code === "FREE") {
      setApplied({ code, discount: subtotal });
    } else {
      setApplied(null);
      setError("Invalid coupon code");
    }
  }

  function pay() {
    setError(null);
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Enter a valid email address");
      return;
    }
    setProcessing(true);
    setTimeout(() => {
      setProcessing(false);
      setSuccess(true);
    }, 1000);
  }

  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-900 dark:bg-black dark:text-zinc-50">
      <div className="mx-auto max-w-5xl px-6 py-10">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold">Checkout</h1>
            <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">Secure payment. Instant access.</p>
          </div>
          <div className="flex items-center gap-2 text-xs text-zinc-500 dark:text-zinc-400">
            <span className="inline-flex items-center gap-1">
              <span className="inline-block h-2 w-2 rounded-full bg-emerald-500" />
              SSL secured
            </span>
            <span>•</span>
            <span>14-day money-back guarantee</span>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-12">
          <section className="lg:col-span-7">
            <div className="rounded-xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
              <div className="px-6 pt-6">
                <h2 className="text-sm font-semibold">Your details</h2>
              </div>
              {error && (
                <div className="mx-6 mt-4 rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700 dark:border-rose-800 dark:bg-rose-950/50 dark:text-rose-300">
                  {error}
                </div>
              )}
              <div className="px-6 pb-6 pt-4">
                <label htmlFor="email" className="text-sm font-medium text-zinc-800 dark:text-zinc-200">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@company.com"
                  className="mt-1 h-10 w-full rounded-lg border border-zinc-300 bg-white px-3 text-sm outline-none ring-0 transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 dark:border-zinc-700 dark:bg-zinc-900 dark:focus:border-indigo-400"
                />
              </div>
            </div>

            <div className="mt-6 rounded-xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
              <div className="px-6 pt-6">
                <h2 className="text-sm font-semibold">Payment method</h2>
              </div>
              <div className="px-6 pb-6 pt-4">
                <div className="grid gap-3 md:grid-cols-3">
                  <label className={method === "card" ? "flex items-center gap-2 rounded-lg border border-indigo-400 bg-indigo-50 px-3 py-2 text-sm dark:border-indigo-500/50 dark:bg-indigo-900/20" : "flex items-center gap-2 rounded-lg border border-zinc-300 px-3 py-2 text-sm hover:bg-zinc-50 dark:border-zinc-700 dark:hover:bg-zinc-800"}>
                    <input type="radio" name="method" checked={method === "card"} onChange={() => setMethod("card")} />
                    Card
                  </label>
                  <label className={method === "upi" ? "flex items-center gap-2 rounded-lg border border-indigo-400 bg-indigo-50 px-3 py-2 text-sm dark:border-indigo-500/50 dark:bg-indigo-900/20" : "flex items-center gap-2 rounded-lg border border-zinc-300 px-3 py-2 text-sm hover:bg-zinc-50 dark:border-zinc-700 dark:hover:bg-zinc-800"}>
                    <input type="radio" name="method" checked={method === "upi"} onChange={() => setMethod("upi")} />
                    UPI
                  </label>
                  <label className={method === "apple" ? "flex items-center gap-2 rounded-lg border border-indigo-400 bg-indigo-50 px-3 py-2 text-sm dark:border-indigo-500/50 dark:bg-indigo-900/20" : "flex items-center gap-2 rounded-lg border border-zinc-300 px-3 py-2 text-sm hover:bg-zinc-50 dark:border-zinc-700 dark:hover:bg-zinc-800"}>
                    <input type="radio" name="method" checked={method === "apple"} onChange={() => setMethod("apple")} />
                    Apple Pay
                  </label>
                </div>

                <div className="mt-4 rounded-lg border border-zinc-200 bg-zinc-50 p-4 text-sm dark:border-zinc-800 dark:bg-zinc-800/40">
                  {method === "card" && <div className="text-zinc-600 dark:text-zinc-400">Enter card details securely on the next step.</div>}
                  {method === "upi" && <div className="text-zinc-600 dark:text-zinc-400">You will be redirected to your UPI app to authorize payment.</div>}
                  {method === "apple" && <div className="text-zinc-600 dark:text-zinc-400">Apple Pay will open to confirm your purchase.</div>}
                </div>
              </div>
            </div>

            <div className="mt-6 rounded-xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
              <div className="px-6 py-4">
                <div className="text-xs text-zinc-500 dark:text-zinc-400">
                  By purchasing, you agree to our{" "}
                  <Link href="/terms" className="font-medium text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300">
                    Terms
                  </Link>{" "}
                  and{" "}
                  <Link href="/privacy" className="font-medium text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300">
                    Privacy Policy
                  </Link>
                  .
                </div>
              </div>
            </div>
          </section>

          <aside className="lg:col-span-5">
            <div className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
              <div className="flex items-start justify-between">
                <div>
                  <div className="text-sm font-semibold">{course.title}</div>
                  <div className="mt-1 text-xs text-zinc-600 dark:text-zinc-400">{course.subtitle}</div>
                </div>
                <span className="rounded-full bg-zinc-100 px-2 py-0.5 text-xs font-medium text-zinc-700 dark:bg-zinc-800/60 dark:text-zinc-300">
                  {course.currency}
                </span>
              </div>
              <div className="mt-4 space-y-2 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-zinc-600 dark:text-zinc-400">Subtotal</span>
                  <span className="font-medium">${subtotal}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-zinc-600 dark:text-zinc-400">Discount</span>
                  <span className="font-medium">-${discount}</span>
                </div>
                <div className="flex items-center justify-between border-t border-zinc-200 pt-2 dark:border-zinc-800">
                  <span className="text-zinc-800 dark:text-zinc-200">Total</span>
                  <span className="text-lg font-semibold">${total}</span>
                </div>
              </div>

              <div className="mt-4 flex items-center gap-2">
                <input
                  value={coupon}
                  onChange={(e) => setCoupon(e.target.value)}
                  placeholder="Coupon code"
                  className="h-9 flex-1 rounded-md border border-zinc-300 bg-white px-3 text-sm outline-none ring-0 transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:focus:border-indigo-400"
                />
                <button
                  onClick={applyCoupon}
                  className="inline-flex h-9 items-center justify-center rounded-md border border-zinc-300 bg-white px-3 text-sm font-medium text-zinc-900 transition hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:hover:bg-zinc-800"
                >
                  Apply
                </button>
              </div>
              {applied && (
                <div className="mt-2 text-xs text-emerald-700 dark:text-emerald-300">
                  Coupon {applied.code} applied. You saved ${applied.discount}.
                </div>
              )}

              <button
                onClick={pay}
                disabled={processing}
                className="mt-6 inline-flex h-10 w-full items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 text-sm font-medium text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-indigo-500 dark:hover:bg-indigo-600"
              >
                {processing && <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-white/60 border-t-transparent" />}
                {processing ? "Processing…" : total === 0 ? "Complete purchase" : `Pay $${total}`}
              </button>

              {success && (
                <div className="mt-4 rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-800 dark:border-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300">
                  Payment successful. Access granted.
                </div>
              )}
            </div>

            <div className="mt-4 grid grid-cols-3 gap-3 text-center text-xs text-zinc-500 dark:text-zinc-400">
              <div className="rounded-lg border border-zinc-200 bg-white p-3 dark:border-zinc-800 dark:bg-zinc-900">Secure</div>
              <div className="rounded-lg border border-zinc-200 bg-white p-3 dark:border-zinc-800 dark:bg-zinc-900">Trusted</div>
              <div className="rounded-lg border border-zinc-200 bg-white p-3 dark:border-zinc-800 dark:bg-zinc-900">Fast</div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}

