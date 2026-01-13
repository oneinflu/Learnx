"use client";
import { useState } from "react";
import Link from "next/link";

type Tab = "general" | "branding" | "domain" | "payments" | "team" | "security";

function TabButton({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={
        active
          ? "inline-flex h-9 items-center justify-center rounded-md border border-indigo-500 bg-indigo-50 px-3 text-sm font-medium text-indigo-700 dark:border-indigo-500/60 dark:bg-indigo-900/20 dark:text-indigo-300"
          : "inline-flex h-9 items-center justify-center rounded-md border border-zinc-300 bg-white px-3 text-sm font-medium text-zinc-900 transition hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:hover:bg-zinc-800"
      }
    >
      {label}
    </button>
  );
}
 
export default function SettingsPage() {
  const [tab, setTab] = useState<Tab>("general");
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-semibold">Settings</h1>
          <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">Clean admin settings for your academy.</p>
        </div>
        <div className="flex items-center gap-2">
          <Link
            href="/dashboard"
            className="inline-flex h-9 items-center justify-center rounded-md border border-zinc-300 bg-white px-3 text-sm font-medium text-zinc-900 transition hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:hover:bg-zinc-800"
          >
            Back to dashboard
          </Link>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        <TabButton label="General" active={tab === "general"} onClick={() => setTab("general")} />
        <TabButton label="Branding" active={tab === "branding"} onClick={() => setTab("branding")} />
        <TabButton label="Domain" active={tab === "domain"} onClick={() => setTab("domain")} />
        <TabButton label="Payments" active={tab === "payments"} onClick={() => setTab("payments")} />
        <TabButton label="Team" active={tab === "team"} onClick={() => setTab("team")} />
        <TabButton label="Security" active={tab === "security"} onClick={() => setTab("security")} />
      </div>

      {tab === "general" && (
        <section className="space-y-6">
          <div className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
            <div className="text-sm font-semibold">Academy details</div>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <div>
                <label className="text-sm font-medium text-zinc-800 dark:text-zinc-200">Name</label>
                <input className="mt-1 h-10 w-full rounded-lg border border-zinc-300 bg-white px-3 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:focus:border-indigo-400" placeholder="Academy name" />
              </div>
              <div>
                <label className="text-sm font-medium text-zinc-800 dark:text-zinc-200">Tagline</label>
                <input className="mt-1 h-10 w-full rounded-lg border border-zinc-300 bg-white px-3 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:focus:border-indigo-400" placeholder="Short tagline" />
              </div>
              <div>
                <label className="text-sm font-medium text-zinc-800 dark:text-zinc-200">Timezone</label>
                <select className="mt-1 h-10 w-full rounded-lg border border-zinc-300 bg-white px-3 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:focus:border-indigo-400">
                  <option>UTC</option>
                  <option>America/New_York</option>
                  <option>Europe/London</option>
                  <option>Asia/Kolkata</option>
                </select>
              </div>
            </div>
            <div className="mt-6 flex gap-2">
              <button className="inline-flex h-9 items-center justify-center rounded-md bg-indigo-600 px-3 text-sm font-medium text-white transition hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600">Save changes</button>
              <button className="inline-flex h-9 items-center justify-center rounded-md border border-zinc-300 bg-white px-3 text-sm font-medium text-zinc-900 transition hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:hover:bg-zinc-800">Cancel</button>
            </div>
          </div>
        </section>
      )}

      {tab === "branding" && (
        <section className="space-y-6">
          <div className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
            <div className="text-sm font-semibold">Brand assets</div>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <div>
                <label className="text-sm font-medium text-zinc-800 dark:text-zinc-200">Logo</label>
                <div className="mt-1 flex items-center gap-3">
                  <div className="h-12 w-12 rounded-md bg-zinc-200 dark:bg-zinc-800" />
                  <button className="inline-flex h-9 items-center justify-center rounded-md border border-zinc-300 bg-white px-3 text-sm font-medium text-zinc-900 transition hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:hover:bg-zinc-800">Upload</button>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-zinc-800 dark:text-zinc-200">Brand color</label>
                <input type="color" className="mt-1 h-10 w-24 rounded-md border border-zinc-300 bg-white p-1 dark:border-zinc-700 dark:bg-zinc-900" defaultValue="#4f46e5" />
              </div>
              <div>
                <label className="text-sm font-medium text-zinc-800 dark:text-zinc-200">Theme</label>
                <select className="mt-1 h-10 w-full rounded-lg border border-zinc-300 bg-white px-3 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:focus:border-indigo-400">
                  <option>System</option>
                  <option>Light</option>
                  <option>Dark</option>
                </select>
              </div>
            </div>
            <div className="mt-6">
              <button className="inline-flex h-9 items-center justify-center rounded-md bg-indigo-600 px-3 text-sm font-medium text-white transition hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600">Save branding</button>
            </div>
          </div>
        </section>
      )}

      {tab === "domain" && (
        <section className="space-y-6">
          <div className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
            <div className="text-sm font-semibold">Custom domain</div>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <div>
                <label className="text-sm font-medium text-zinc-800 dark:text-zinc-200">Primary domain</label>
                <input className="mt-1 h-10 w-full rounded-lg border border-zinc-300 bg-white px-3 text-sm outline-none dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100" defaultValue="academy.example.com" />
              </div>
              <div>
                <label className="text-sm font-medium text-zinc-800 dark:text-zinc-200">Subdomain</label>
                <input className="mt-1 h-10 w-full rounded-lg border border-zinc-300 bg-white px-3 text-sm outline-none dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100" placeholder="your-name" />
              </div>
            </div>
            <div className="mt-4 rounded-lg border border-zinc-200 bg-zinc-50 p-4 text-sm dark:border-zinc-800 dark:bg-zinc-800/40">
              Update DNS to point your domain to the platform. Add a CNAME record to your subdomain.
            </div>
            <div className="mt-6 flex gap-2">
              <button className="inline-flex h-9 items-center justify-center rounded-md bg-indigo-600 px-3 text-sm font-medium text-white transition hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600">Save domain</button>
              <button className="inline-flex h-9 items-center justify-center rounded-md border border-zinc-300 bg-white px-3 text-sm font-medium text-zinc-900 transition hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:hover:bg-zinc-800">Cancel</button>
            </div>
          </div>
          <div className="rounded-xl border border-rose-200 bg-rose-50 p-6 text-sm text-rose-800 dark:border-rose-800 dark:bg-rose-950/40 dark:text-rose-300">
            <div className="text-sm font-semibold">Destructive</div>
            <p className="mt-2">Removing a custom domain will disconnect access via that domain. Confirm before proceeding.</p>
            <div className="mt-4">
              <button className="inline-flex h-9 items-center justify-center rounded-md bg-rose-600 px-3 text-sm font-medium text-white transition hover:bg-rose-700">Remove custom domain</button>
            </div>
          </div>
        </section>
      )}

      {tab === "payments" && (
        <section className="space-y-6">
          <div className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
            <div className="text-sm font-semibold">Processor</div>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <div>
                <label className="text-sm font-medium text-zinc-800 dark:text-zinc-200">Status</label>
                <div className="mt-1 flex items-center gap-2 text-sm">
                  <span className="inline-block h-2 w-2 rounded-full bg-emerald-500" />
                  Connected to Stripe
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-zinc-800 dark:text-zinc-200">Default currency</label>
                <select className="mt-1 h-10 w-full rounded-lg border border-zinc-300 bg-white px-3 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:focus:border-indigo-400">
                  <option>USD</option>
                  <option>EUR</option>
                  <option>INR</option>
                </select>
              </div>
              <div>
                <label className="text-sm font-medium text-zinc-800 dark:text-zinc-200">Tax rate</label>
                <input type="number" min="0" max="50" className="mt-1 h-10 w-full rounded-lg border border-zinc-300 bg-white px-3 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:focus:border-indigo-400" placeholder="0" />
              </div>
            </div>
            <div className="mt-6 flex gap-2">
              <button className="inline-flex h-9 items-center justify-center rounded-md bg-indigo-600 px-3 text-sm font-medium text-white transition hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600">Save payments</button>
              <button className="inline-flex h-9 items-center justify-center rounded-md border border-zinc-300 bg-white px-3 text-sm font-medium text-zinc-900 transition hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:hover:bg-zinc-800">Reconnect</button>
            </div>
          </div>
          <div className="rounded-xl border border-rose-200 bg-rose-50 p-6 text-sm text-rose-800 dark:border-rose-800 dark:bg-rose-950/40 dark:text-rose-300">
            Disconnecting payments will pause checkouts and renewals. Confirm before continuing.
            <div className="mt-3">
              <button className="inline-flex h-9 items-center justify-center rounded-md bg-rose-600 px-3 text-sm font-medium text-white transition hover:bg-rose-700">Disconnect</button>
            </div>
          </div>
        </section>
      )}

      {tab === "team" && (
        <section className="space-y-6">
          <div className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
            <div className="text-sm font-semibold">Members</div>
            <div className="mt-4 space-y-2">
              <div className="flex items-center justify-between rounded-lg border border-zinc-200 bg-white p-3 dark:border-zinc-800 dark:bg-zinc-900">
                <div className="flex items-center gap-2">
                  <span className="inline-block h-6 w-6 rounded-full bg-zinc-300 dark:bg-zinc-700" />
                  <div className="text-sm">Founder</div>
                  <span className="rounded-full bg-zinc-100 px-2 py-0.5 text-[11px] font-medium text-zinc-700 dark:bg-zinc-800/60 dark:text-zinc-300">Admin</span>
                </div>
                <button className="inline-flex h-8 items-center justify-center rounded-md border border-zinc-300 bg-white px-2 text-xs font-medium text-zinc-900 transition hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:hover:bg-zinc-800">Manage</button>
              </div>
              <div className="flex items-center justify-between rounded-lg border border-zinc-200 bg-white p-3 dark:border-zinc-800 dark:bg-zinc-900">
                <div className="flex items-center gap-2">
                  <span className="inline-block h-6 w-6 rounded-full bg-zinc-300 dark:bg-zinc-700" />
                  <div className="text-sm">Alex</div>
                  <span className="rounded-full bg-zinc-100 px-2 py-0.5 text-[11px] font-medium text-zinc-700 dark:bg-zinc-800/60 dark:text-zinc-300">Editor</span>
                </div>
                <button className="inline-flex h-8 items-center justify-center rounded-md border border-zinc-300 bg-white px-2 text-xs font-medium text-zinc-900 transition hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:hover:bg-zinc-800">Remove</button>
              </div>
            </div>
            <div className="mt-4 flex items-center gap-2">
              <input className="h-9 flex-1 rounded-md border border-zinc-300 bg-white px-3 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:focus:border-indigo-400" placeholder="Invite by email" />
              <select className="h-9 rounded-md border border-zinc-300 bg-white px-2 text-sm outline-none dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100">
                <option>Viewer</option>
                <option>Editor</option>
                <option>Admin</option>
              </select>
              <button className="inline-flex h-9 items-center justify-center rounded-md bg-indigo-600 px-3 text-sm font-medium text-white transition hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600">Invite</button>
            </div>
          </div>
          <div className="rounded-xl border border-rose-200 bg-rose-50 p-6 text-sm text-rose-800 dark:border-rose-800 dark:bg-rose-950/40 dark:text-rose-300">
            Removing a member revokes access immediately. Confirm before removing.
            <div className="mt-3">
              <button className="inline-flex h-9 items-center justify-center rounded-md bg-rose-600 px-3 text-sm font-medium text-white transition hover:bg-rose-700">Remove selected</button>
            </div>
          </div>
        </section>
      )}

      {tab === "security" && (
        <section className="space-y-6">
          <div className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
            <div className="text-sm font-semibold">Account security</div>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <div className="flex items-center justify-between rounded-lg border border-zinc-200 bg-white p-3 dark:border-zinc-800 dark:bg-zinc-900">
                <div className="text-sm">Two-factor authentication</div>
                <button className="inline-flex h-8 items-center justify-center rounded-md border border-zinc-300 bg-white px-2 text-xs font-medium text-zinc-900 transition hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:hover:bg-zinc-800">Enable</button>
              </div>
              <div className="flex items-center justify-between rounded-lg border border-zinc-200 bg-white p-3 dark:border-zinc-800 dark:bg-zinc-900">
                <div className="text-sm">Active sessions</div>
                <button className="inline-flex h-8 items-center justify-center rounded-md border border-zinc-300 bg-white px-2 text-xs font-medium text-zinc-900 transition hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:hover:bg-zinc-800">View</button>
              </div>
              <div className="flex items-center justify-between rounded-lg border border-zinc-200 bg-white p-3 dark:border-zinc-800 dark:bg-zinc-900">
                <div className="text-sm">API keys</div>
                <button className="inline-flex h-8 items-center justify-center rounded-md border border-zinc-300 bg-white px-2 text-xs font-medium text-zinc-900 transition hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:hover:bg-zinc-800">Reset</button>
              </div>
            </div>
          </div>
          <div className="rounded-xl border border-rose-200 bg-rose-50 p-6 text-sm text-rose-800 dark:border-rose-800 dark:bg-rose-950/40 dark:text-rose-300">
            Resetting API keys invalidates existing integrations. Confirm before resetting.
            <div className="mt-3">
              <button className="inline-flex h-9 items-center justify-center rounded-md bg-rose-600 px-3 text-sm font-medium text-white transition hover:bg-rose-700">Reset keys</button>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
