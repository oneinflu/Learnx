"use client";
import { useMemo, useState } from "react";
import Link from "next/link";

type Step = 1 | 2 | 3;

const reservedSubdomains = new Set(["admin", "api", "www", "docs", "help", "support"]);

function slugify(input: string) {
  return input
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

async function checkAvailability(sd: string) {
  return await new Promise<boolean>((resolve) => {
    setTimeout(() => {
      resolve(!reservedSubdomains.has(sd));
    }, 600);
  });
}

function StepIndicator({ step }: { step: Step }) {
  return (
    <div className="flex items-center justify-center gap-6 px-6 pt-6">
      <StepDot active={step >= 1} label="Account" />
      <div className="h-px w-12 bg-zinc-200 dark:bg-zinc-800" />
      <StepDot active={step >= 2} label="Academy" />
      <div className="h-px w-12 bg-zinc-200 dark:bg-zinc-800" />
      <StepDot active={step >= 3} label="Finish" />
    </div>
  );
}

export default function SignupPage() {
  const [step, setStep] = useState<Step>(1);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [academyName, setAcademyName] = useState("");
  const [subdomain, setSubdomain] = useState("");
  const [subdomainTouched, setSubdomainTouched] = useState(false);
  const [subdomainAvailable, setSubdomainAvailable] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const emailValid = useMemo(() => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email), [email]);
  const passwordValid = useMemo(() => password.length >= 8, [password]);
  const academyNameValid = useMemo(() => academyName.trim().length >= 2 && academyName.trim().length <= 48, [academyName]);
  const subdomainValid = useMemo(() => /^[a-z0-9](?:[a-z0-9-]{1,61}[a-z0-9])$/.test(subdomain), [subdomain]);

  function handleNextFromStep1(e: React.FormEvent) {
    e.preventDefault();
    const nextErrors: Record<string, string> = {};
    if (!emailValid) nextErrors.email = "Enter a valid email address.";
    if (!passwordValid) nextErrors.password = "Use at least 8 characters.";
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length === 0) setStep(2);
  }

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    const nextErrors: Record<string, string> = {};
    if (!academyNameValid) nextErrors.academyName = "2–48 characters required.";
    if (!subdomainValid) nextErrors.subdomain = "Use lowercase letters, numbers, and hyphens.";
    if (subdomainAvailable === false) nextErrors.subdomain = "This subdomain is taken. Try another.";
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;
    setLoading(true);
    const available = subdomainAvailable === null ? await checkAvailability(subdomain) : subdomainAvailable;
    if (!available) {
      setErrors({ subdomain: "This subdomain is taken. Try another." });
      setLoading(false);
      return;
    }
    setSubdomainAvailable(available);
    setTimeout(() => {
      setLoading(false);
      setStep(3);
    }, 1000);
  }

  function onAcademyNameChange(value: string) {
    setAcademyName(value);
    if (!subdomainTouched) {
      const slug = slugify(value);
      setSubdomain(slug);
      setSubdomainAvailable(null);
    }
  }

  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-900 dark:bg-black dark:text-zinc-50">
      <div className="mx-auto flex min-h-screen max-w-5xl flex-col items-center justify-center px-6 py-12">
        <div className="mb-8 flex items-center gap-3">
          <div className="h-8 w-8 rounded-md bg-zinc-900 dark:bg-zinc-50" />
          <span className="text-xl font-semibold">LearnX</span>
        </div>

        <div className="w-full max-w-xl rounded-xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
          <div className="px-6 pt-6">
            <h1 className="text-2xl font-semibold">Create your academy</h1>
            <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
              Start your free trial. No credit card required.
            </p>
          </div>

          <StepIndicator step={step} />

          {step === 1 && (
            <form onSubmit={handleNextFromStep1} className="px-6 pb-6 pt-4">
              <div className="space-y-4">
                <div>
                  <label htmlFor="email" className="text-sm font-medium text-zinc-800 dark:text-zinc-200">
                    Email
                  </label>
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    aria-invalid={Boolean(errors.email)}
                    placeholder="you@company.com"
                    className="mt-1 h-10 w-full rounded-lg border border-zinc-300 bg-white px-3 text-sm outline-none ring-0 transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 dark:border-zinc-700 dark:bg-zinc-900 dark:focus:border-indigo-400"
                  />
                  {errors.email && <p className="mt-1 text-xs text-rose-600 dark:text-rose-400">{errors.email}</p>}
                </div>
                <div>
                  <label htmlFor="password" className="text-sm font-medium text-zinc-800 dark:text-zinc-200">
                    Password
                  </label>
                  <input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    aria-invalid={Boolean(errors.password)}
                    placeholder="At least 8 characters"
                    className="mt-1 h-10 w-full rounded-lg border border-zinc-300 bg-white px-3 text-sm outline-none ring-0 transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 dark:border-zinc-700 dark:bg-zinc-900 dark:focus:border-indigo-400"
                  />
                  {errors.password && <p className="mt-1 text-xs text-rose-600 dark:text-rose-400">{errors.password}</p>}
                </div>
                <button
                  type="submit"
                  className="inline-flex h-10 w-full items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 text-sm font-medium text-white transition hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600"
                >
                  Continue
                </button>
                <p className="text-center text-xs text-zinc-500 dark:text-zinc-400">
                  By continuing, you agree to our{" "}
                  <Link href="/terms" className="font-medium text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300">
                    Terms
                  </Link>{" "}
                  and{" "}
                  <Link href="/privacy" className="font-medium text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300">
                    Privacy Policy
                  </Link>
                  .
                </p>
              </div>
            </form>
          )}

          {step === 2 && (
            <form onSubmit={handleCreate} className="px-6 pb-6 pt-4">
              <div className="space-y-4">
                <div>
                  <label htmlFor="academyName" className="text-sm font-medium text-zinc-800 dark:text-zinc-200">
                    Academy name
                  </label>
                  <input
                    id="academyName"
                    type="text"
                    value={academyName}
                    onChange={(e) => onAcademyNameChange(e.target.value)}
                    aria-invalid={Boolean(errors.academyName)}
                    placeholder="e.g., Aurora Learning"
                    className="mt-1 h-10 w-full rounded-lg border border-zinc-300 bg-white px-3 text-sm outline-none ring-0 transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 dark:border-zinc-700 dark:bg-zinc-900 dark:focus:border-indigo-400"
                  />
                  {errors.academyName && <p className="mt-1 text-xs text-rose-600 dark:text-rose-400">{errors.academyName}</p>}
                </div>

                <div>
                  <div className="flex items-center justify-between">
                    <label htmlFor="subdomain" className="text-sm font-medium text-zinc-800 dark:text-zinc-200">
                      Subdomain
                    </label>
                    <span className="text-xs text-zinc-500 dark:text-zinc-400">Lowercase, numbers, hyphens</span>
                  </div>
                  <input
                    id="subdomain"
                    type="text"
                    value={subdomain}
                    onChange={(e) => {
                      setSubdomainTouched(true);
                      setSubdomain(e.target.value.toLowerCase());
                      setSubdomainAvailable(null);
                    }}
                    onBlur={async () => {
                      if (!subdomainValid) {
                        setSubdomainAvailable(null);
                        return;
                      }
                      setLoading(true);
                      const available = await checkAvailability(subdomain);
                      setSubdomainAvailable(available);
                      setLoading(false);
                    }}
                    aria-invalid={Boolean(errors.subdomain)}
                    placeholder="aurora-learning"
                    className="mt-1 h-10 w-full rounded-lg border border-zinc-300 bg-white px-3 text-sm outline-none ring-0 transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 dark:border-zinc-700 dark:bg-zinc-900 dark:focus:border-indigo-400"
                  />
                  <div className="mt-2 flex items-center justify-between">
                    <span className="text-xs text-zinc-600 dark:text-zinc-400">
                      Preview: <span className="font-medium">https://{subdomain || "your-academy"}.platform.com</span>
                    </span>
                    {subdomainValid && subdomainAvailable !== null && (
                      <span
                        className={
                          subdomainAvailable
                            ? "rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-medium text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300"
                            : "rounded-full bg-rose-100 px-2 py-0.5 text-xs font-medium text-rose-700 dark:bg-rose-900/40 dark:text-rose-300"
                        }
                      >
                        {subdomainAvailable ? "Available" : "Unavailable"}
                      </span>
                    )}
                  </div>
                  {errors.subdomain && <p className="mt-1 text-xs text-rose-600 dark:text-rose-400">{errors.subdomain}</p>}
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="inline-flex h-10 w-full items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 text-sm font-medium text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-indigo-500 dark:hover:bg-indigo-600"
                >
                  {loading && <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-white/60 border-t-transparent" />}
                  {loading ? "Creating…" : "Create My Academy"}
                </button>

                <p className="text-center text-xs text-zinc-500 dark:text-zinc-400">
                  Free trial. Cancel anytime.
                </p>
              </div>
            </form>
          )}

          {step === 3 && (
            <div className="px-6 pb-8 pt-6">
              <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-emerald-800 dark:border-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300">
                <h2 className="text-lg font-semibold">Your academy is ready</h2>
                <p className="mt-1 text-sm">
                  Visit <span className="font-medium">https://{subdomain}.platform.com</span> to get started.
                </p>
              </div>
              <div className="mt-6 grid grid-cols-2 gap-3">
                <Link
                  href={`/login`}
                  className="inline-flex h-10 items-center justify-center rounded-lg border border-zinc-300 bg-white text-sm font-medium text-zinc-900 transition hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:hover:bg-zinc-800"
                >
                  Sign in
                </Link>
                <Link
                  href={`/dashboard`}
                  className="inline-flex h-10 items-center justify-center rounded-lg bg-indigo-600 text-sm font-medium text-white transition hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600"
                >
                  Go to dashboard
                </Link>
              </div>
            </div>
          )}
        </div>

        <div className="mt-8 text-center text-xs text-zinc-500 dark:text-zinc-400">
          Need help?{" "}
          <Link href="/support" className="font-medium text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300">
            Contact support
          </Link>
        </div>
      </div>
    </div>
  );
}

function StepDot({ active, label }: { active: boolean; label: string }) {
  return (
    <div className="flex items-center gap-2">
      <span
        className={
          active
            ? "flex h-6 w-6 items-center justify-center rounded-full bg-indigo-600 text-xs font-semibold text-white dark:bg-indigo-500"
            : "flex h-6 w-6 items-center justify-center rounded-full border border-zinc-300 bg-white text-xs font-semibold text-zinc-600 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-400"
        }
      >
        {active ? "●" : "○"}
      </span>
      <span className="text-xs text-zinc-600 dark:text-zinc-400">{label}</span>
    </div>
  );
}
