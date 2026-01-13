"use client";
import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

type Status = "active" | "suspended";
type Affiliate = {
  id: string;
  name: string;
  email: string;
  code: string;
  ratePct: number;
  enrollments: number;
  revenue: number;
  status: Status;
  joinedOn: string;
  earningsPaid?: number;
};

function StatusBadge({ status }: { status: Status }) {
  const classes =
    status === "active"
      ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/20 dark:text-emerald-300"
      : "bg-amber-100 text-amber-800 dark:bg-amber-900/20 dark:text-amber-300";
  return <span className={`rounded-full px-2 py-0.5 text-[11px] font-medium ${classes}`}>{status === "active" ? "Active" : "Suspended"}</span>;
}
function SkeletonRow() {
  return (
    <tr className="animate-pulse">
      <td className="px-3 py-3"><div className="h-4 w-40 rounded bg-zinc-200 dark:bg-zinc-800" /></td>
      <td className="px-3 py-3"><div className="h-4 w-[280px] rounded bg-zinc-200 dark:bg-zinc-800" /></td>
      <td className="px-3 py-3"><div className="h-4 w-20 rounded bg-zinc-200 dark:bg-zinc-800" /></td>
      <td className="px-3 py-3"><div className="h-4 w-24 rounded bg-zinc-200 dark:bg-zinc-800" /></td>
      <td className="px-3 py-3"><div className="h-4 w-24 rounded bg-zinc-200 dark:bg-zinc-800" /></td>
      <td className="px-3 py-3"><div className="h-4 w-20 rounded bg-zinc-200 dark:bg-zinc-800" /></td>
      <td className="px-3 py-3"><div className="h-8 w-24 rounded bg-zinc-200 dark:bg-zinc-800" /></td>
    </tr>
  );
}

export default function AffiliatesPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [affiliates, setAffiliates] = useState<Affiliate[]>([
    { id: "a1", name: "GrowthHub Media", email: "partners@growthhub.io", code: "GROWTH10", ratePct: 20, enrollments: 162, revenue: 11840, status: "active", joinedOn: "2025-07-12", earningsPaid: 1800 },
    { id: "a2", name: "EduInfluence", email: "team@eduinf.com", code: "EDU25", ratePct: 25, enrollments: 96, revenue: 7450, status: "active", joinedOn: "2025-10-01", earningsPaid: 800 },
    { id: "a3", name: "TechLearn Weekly", email: "sponsor@tlweekly.dev", code: "TLW15", ratePct: 15, enrollments: 52, revenue: 3920, status: "suspended", joinedOn: "2025-04-20", earningsPaid: 350 },
  ]);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [rate, setRate] = useState<number>(20);
  const [error, setError] = useState("");
  const [confirmSuspendId, setConfirmSuspendId] = useState<string | null>(null);
  const [drawerId, setDrawerId] = useState<string | null>(null);

  const totals = useMemo(() => {
    const e = affiliates.reduce((sum, a) => sum + a.enrollments, 0);
    const r = affiliates.reduce((sum, a) => sum + a.revenue, 0);
    const earnings = affiliates.reduce((sum, a) => sum + (a.revenue * a.ratePct) / 100, 0);
    const paid = affiliates.reduce((sum, a) => sum + (a.earningsPaid ?? 0), 0);
    const pending = Math.max(0, earnings - paid);
    return { enrollments: e, revenue: r, earnings, pending };
  }, [affiliates]);
  const selected = useMemo(() => affiliates.find((a) => a.id === drawerId) || null, [affiliates, drawerId]);
  const referral = useMemo(() => {
    if (!selected) return "";
    return `https://youracademy.com/catalog?ref=${selected.code}`;
  }, [selected]);
  const earningsFor = useMemo(() => (selected ? Math.round((selected.revenue * selected.ratePct) / 100) : 0), [selected]);
  const paidFor = useMemo(() => (selected ? selected.earningsPaid ?? 0 : 0), [selected]);
  const pendingFor = useMemo(() => Math.max(0, earningsFor - paidFor), [earningsFor, paidFor]);
  const perfData = useMemo(() => {
    if (!selected) return [];
    const base = Math.max(10, Math.round(selected.enrollments / 6));
    return [base - 2, base + 1, base + 4, base - 1, base + 2, base + 0];
  }, [selected]);
  const txs = useMemo(() => {
    if (!selected) return [];
    return [
      { id: "t1", course: "AI Foundations", amount: 199, currency: "USD", when: "2026-01-05", status: "succeeded" },
      { id: "t2", course: "Prompt Engineering", amount: 149, currency: "USD", when: "2026-01-03", status: "succeeded" },
      { id: "t3", course: "Data Viz Mastery", amount: 99, currency: "USD", when: "2025-12-29", status: "refunded" },
      { id: "t4", course: "AI Foundations", amount: 199, currency: "USD", when: "2025-12-26", status: "succeeded" },
      { id: "t5", course: "Prompt Engineering", amount: 149, currency: "USD", when: "2025-12-20", status: "pending" },
    ];
  }, [selected]);

  function openInvite() {
    setEditingId(null);
    setName("");
    setEmail("");
    setCode("");
    setRate(20);
    setError("");
    setShowModal(true);
  }
  function openEdit(a: Affiliate) {
    setEditingId(a.id);
    setName(a.name);
    setEmail(a.email);
    setCode(a.code);
    setRate(a.ratePct);
    setError("");
    setShowModal(true);
  }
  function saveAffiliate() {
    if (!name.trim()) {
      setError("Name is required");
      return;
    }
    if (!email.trim() || !email.includes("@")) {
      setError("Valid email is required");
      return;
    }
    if (!code.trim()) {
      setError("Referral code is required");
      return;
    }
    if (rate <= 0 || rate > 100) {
      setError("Commission rate must be between 1 and 100");
      return;
    }
    const exists = affiliates.some((a) => a.code.toLowerCase() === code.toLowerCase() && a.id !== editingId);
    if (exists) {
      setError("Referral code must be unique");
      return;
    }
    const payload: Affiliate = {
      id: editingId ?? Math.random().toString(36).slice(2, 9),
      name,
      email,
      code,
      ratePct: rate,
      enrollments: editingId ? affiliates.find((a) => a.id === editingId)?.enrollments ?? 0 : 0,
      revenue: editingId ? affiliates.find((a) => a.id === editingId)?.revenue ?? 0 : 0,
      status: editingId ? affiliates.find((a) => a.id === editingId)?.status ?? "active" : "active",
      joinedOn: editingId ? affiliates.find((a) => a.id === editingId)?.joinedOn ?? new Date().toISOString().slice(0, 10) : new Date().toISOString().slice(0, 10),
    };
    if (editingId) {
      setAffiliates((prev) => prev.map((a) => (a.id === editingId ? payload : a)));
    } else {
      setAffiliates((prev) => [payload, ...prev]);
    }
    setShowModal(false);
  }
  function confirmSuspend(id: string) {
    setConfirmSuspendId(id);
  }
  function suspendAffiliate() {
    if (!confirmSuspendId) return;
    setAffiliates((prev) => prev.map((a) => (a.id === confirmSuspendId ? { ...a, status: "suspended" } : a)));
    setConfirmSuspendId(null);
  }
  function openDrawer(id: string) {
    setDrawerId(id);
  }
  function saveCommission() {
    if (!selected) return;
    if (rate <= 0 || rate > 100) {
      setError("Commission rate must be between 1 and 100");
      return;
    }
    setAffiliates((prev) => prev.map((a) => (a.id === selected.id ? { ...a, ratePct: rate } : a)));
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-semibold">Affiliates</h1>
          <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">Manage affiliates and track commission-based sales</p>
        </div>
        <Link
          href="/dashboard/marketing/overview"
          className="inline-flex h-9 items-center justify-center rounded-md border border-zinc-300 bg-white px-3 text-sm font-medium text-zinc-900 transition hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:hover:bg-zinc-800"
        >
          Back to overview
        </Link>
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        <div className="rounded-lg border border-zinc-200 bg-white p-3 text-center dark:border-zinc-800 dark:bg-zinc-900">
          <div className="text-xs text-zinc-600 dark:text-zinc-400">Total affiliates</div>
          <div className="mt-1 text-2xl font-semibold">{affiliates.length}</div>
        </div>
        <div className="rounded-lg border border-zinc-200 bg-white p-3 text-center dark:border-zinc-800 dark:bg-zinc-900">
          <div className="text-xs text-zinc-600 dark:text-zinc-400">Affiliate-driven revenue</div>
          <div className="mt-1 text-2xl font-semibold">${totals.revenue.toLocaleString()}</div>
        </div>
        <div className="rounded-lg border border-zinc-200 bg-white p-3 text-center dark:border-zinc-800 dark:bg-zinc-900">
          <div className="text-xs text-zinc-600 dark:text-zinc-400">Pending commissions</div>
          <div className="mt-1 text-2xl font-semibold">${Math.round(totals.pending).toLocaleString()}</div>
        </div>
      </div>

      <div className="rounded-xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
        <div className="max-h-[520px] overflow-auto">
          <table className="w-full text-sm">
            <thead className="sticky top-0 z-10 bg-white dark:bg-zinc-900">
              <tr className="text-left">
                <th className="px-3 py-2 font-semibold">Affiliate name</th>
                <th className="px-3 py-2 font-semibold">Referral link</th>
                <th className="px-3 py-2 font-semibold">Commission rate</th>
                <th className="px-3 py-2 font-semibold">Revenue generated</th>
                <th className="px-3 py-2 font-semibold">Earnings</th>
                <th className="px-3 py-2 font-semibold">Status</th>
                <th className="px-3 py-2 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
              {loading ? (
                <>
                  {Array.from({ length: 6 }).map((_, i) => (
                    <SkeletonRow key={i} />
                  ))}
                </>
              ) : affiliates.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-3 py-12">
                    <div className="mx-auto max-w-md rounded-xl border border-zinc-200 bg-zinc-50 p-6 text-center shadow-sm dark:border-zinc-800 dark:bg-zinc-800/40">
                      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-indigo-100 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-300">
                        <svg viewBox="0 0 24 24" className="h-8 w-8" fill="none">
                          <path d="M3 13h18v2H3v-2zm2-4h14v2H5V9zm3-4h8v2H8V5zm3 12h2v4h-2v-4z" className="fill-current" />
                        </svg>
                      </div>
                      <div className="mt-4 text-base font-medium">No affiliates yet</div>
                      <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">Invite partners to promote your courses and earn commissions.</p>
                      <div className="mt-4">
                        <button
                          onClick={openInvite}
                          className="inline-flex h-9 items-center justify-center rounded-md bg-indigo-600 px-3 text-sm font-medium text-white transition hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600"
                        >
                          Invite affiliate
                        </button>
                      </div>
                    </div>
                  </td>
                </tr>
              ) : (
                affiliates.map((a) => {
                  const earnings = Math.round((a.revenue * a.ratePct) / 100);
                  const refUrl = `https://youracademy.com/catalog?ref=${a.code}`;
                  return (
                    <tr key={a.id} className="hover:bg-zinc-50 dark:hover:bg-zinc-800/40">
                      <td className="px-3 py-2">{a.name}</td>
                      <td className="px-3 py-2">
                        <div className="truncate text-xs text-zinc-600 dark:text-zinc-400">{refUrl}</div>
                      </td>
                      <td className="px-3 py-2">{a.ratePct}%</td>
                      <td className="px-3 py-2">${a.revenue.toLocaleString()}</td>
                      <td className="px-3 py-2">${earnings.toLocaleString()}</td>
                      <td className="px-3 py-2"><StatusBadge status={a.status} /></td>
                      <td className="px-3 py-2">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => openDrawer(a.id)}
                            className="inline-flex h-8 items-center justify-center rounded-md border border-zinc-300 bg-white px-2 text-xs font-medium text-zinc-900 transition hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:hover:bg-zinc-800"
                          >
                            View
                          </button>
                          <button
                            onClick={() => confirmSuspend(a.id)}
                            className="inline-flex h-8 items-center justify-center rounded-md border border-amber-300 bg-white px-2 text-xs font-medium text-amber-700 transition hover:bg-amber-50 dark:border-amber-900/50 dark:bg-zinc-900 dark:text-amber-300 dark:hover:bg-amber-950/30"
                          >
                            Suspend
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
        <div className="flex items-center justify-between border-t border-zinc-200 px-3 py-2 text-xs dark:border-zinc-800">
          <div className="text-zinc-600 dark:text-zinc-400">Total affiliates {affiliates.length}</div>
          <div className="text-zinc-600 dark:text-zinc-400">Revenue ${totals.revenue.toLocaleString()}</div>
          <div className="text-zinc-600 dark:text-zinc-400">Pending commissions ${Math.round(totals.pending).toLocaleString()}</div>
        </div>
      </div>

      {drawerId && selected && (
        <div className="fixed inset-0 z-40">
          <div className="absolute inset-0 bg-black/40" onClick={() => setDrawerId(null)} />
          <div className="absolute right-0 top-0 h-full w-[560px] overflow-auto border-l border-zinc-200 bg-white shadow-xl dark:border-zinc-800 dark:bg-zinc-900">
            <div className="flex items-center justify-between border-b border-zinc-200 px-4 py-3 dark:border-zinc-800">
              <div>
                <div className="text-sm font-semibold">{selected.name}</div>
                <div className="mt-0.5 text-xs text-zinc-600 dark:text-zinc-400">{referral}</div>
              </div>
              <div className="flex items-center gap-2">
                <StatusBadge status={selected.status} />
                <button
                  onClick={() => setDrawerId(null)}
                  className="inline-flex h-8 items-center justify-center rounded-md border border-zinc-300 bg-white px-2 text-xs font-medium text-zinc-900 transition hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:hover:bg-zinc-800"
                >
                  Close
                </button>
              </div>
            </div>
            <div className="space-y-6 p-4">
              <section className="rounded-lg border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900">
                <div className="text-sm font-semibold">Performance</div>
                <div className="mt-3">
                  <div className="flex items-end gap-2">
                    {perfData.map((v, i) => (
                      <div key={i} className="w-8 rounded bg-indigo-500" style={{ height: `${Math.max(16, v * 4)}px` }} />
                    ))}
                  </div>
                  <div className="mt-2 text-xs text-zinc-600 dark:text-zinc-400">Last 6 periods • Enrollments</div>
                </div>
              </section>
              <section className="rounded-lg border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900">
                <div className="flex items-center justify-between">
                  <div className="text-sm font-semibold">Transactions</div>
                </div>
                <div className="mt-3 space-y-2">
                  {txs.map((t) => (
                    <div key={t.id} className="flex items-center justify-between rounded-lg border border-zinc-200 bg-white p-3 text-sm dark:border-zinc-800 dark:bg-zinc-900">
                      <div className="truncate">{t.course}</div>
                      <div className="font-medium">${t.amount}</div>
                      <div className="text-xs text-zinc-600 dark:text-zinc-400">{t.when}</div>
                      <div className="text-xs">{t.status}</div>
                    </div>
                  ))}
                </div>
              </section>
              <section className="rounded-lg border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900">
                <div className="text-sm font-semibold">Commission settings</div>
                <div className="mt-3 grid gap-3 md:grid-cols-2">
                  <div>
                    <div className="text-xs font-medium text-zinc-700 dark:text-zinc-300">Commission rate (%)</div>
                    <input
                      type="number"
                      min={1}
                      max={100}
                      value={rate}
                      onChange={(e) => setRate(Number(e.target.value))}
                      className="mt-1 h-9 w-full rounded-md border border-zinc-300 bg-white px-3 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:focus:border-indigo-400"
                    />
                  </div>
                  <div>
                    <div className="text-xs font-medium text-zinc-700 dark:text-zinc-300">Current earnings</div>
                    <div className="mt-1 h-9 w-full rounded-md border border-zinc-200 bg-zinc-50 px-3 text-sm leading-9 dark:border-zinc-800 dark:bg-zinc-800/40">
                      ${earningsFor.toLocaleString()}
                    </div>
                  </div>
                </div>
                <div className="mt-2 grid gap-3 md:grid-cols-2">
                  <div>
                    <div className="text-xs font-medium text-zinc-700 dark:text-zinc-300">Paid</div>
                    <div className="mt-1 h-9 w-full rounded-md border border-zinc-200 bg-zinc-50 px-3 text-sm leading-9 dark:border-zinc-800 dark:bg-zinc-800/40">
                      ${paidFor.toLocaleString()}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs font-medium text-zinc-700 dark:text-zinc-300">Pending</div>
                    <div className="mt-1 h-9 w-full rounded-md border border-zinc-200 bg-zinc-50 px-3 text-sm leading-9 dark:border-zinc-800 dark:bg-zinc-800/40">
                      ${pendingFor.toLocaleString()}
                    </div>
                  </div>
                </div>
                {error && <div className="mt-3 rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-800 dark:border-rose-800 dark:bg-rose-950/40 dark:text-rose-300">{error}</div>}
                <div className="mt-3 flex items-center justify-end gap-2">
                  <button
                    onClick={() => setDrawerId(null)}
                    className="inline-flex h-9 items-center justify-center rounded-md border border-zinc-300 bg-white px-3 text-sm font-medium text-zinc-900 transition hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:hover:bg-zinc-800"
                  >
                    Close
                  </button>
                  <button
                    onClick={saveCommission}
                    className="inline-flex h-9 items-center justify-center rounded-md bg-indigo-600 px-3 text-sm font-medium text-white transition hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600"
                  >
                    Save
                  </button>
                </div>
              </section>
            </div>
          </div>
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 z-40">
          <div className="absolute inset-0 bg-black/40" onClick={() => setShowModal(false)} />
          <div className="absolute left-1/2 top-1/2 w-[520px] -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-xl dark:border-zinc-800 dark:bg-zinc-900">
            <div className="flex items-center justify-between border-b border-zinc-200 px-4 py-3 text-sm font-semibold dark:border-zinc-800">
              {editingId ? "Edit affiliate" : "Invite affiliate"}
              <button
                onClick={() => setShowModal(false)}
                className="inline-flex h-8 items-center justify-center rounded-md border border-zinc-300 bg-white px-2 text-xs font-medium text-zinc-900 transition hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:hover:bg-zinc-800"
              >
                Close
              </button>
            </div>
            <div className="space-y-3 px-4 py-3 text-sm">
              {error && (
                <div className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-rose-800 dark:border-rose-800 dark:bg-rose-950/40 dark:text-rose-300">
                  {error}
                </div>
              )}
              <div>
                <div className="text-xs font-medium text-zinc-700 dark:text-zinc-300">Name</div>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Affiliate or partner name"
                  className="mt-1 h-9 w-full rounded-md border border-zinc-300 bg-white px-3 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:focus:border-indigo-400"
                />
              </div>
              <div>
                <div className="text-xs font-medium text-zinc-700 dark:text-zinc-300">Email</div>
                <input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="partner@example.com"
                  className="mt-1 h-9 w-full rounded-md border border-zinc-300 bg-white px-3 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:focus:border-indigo-400"
                />
              </div>
              <div className="grid gap-3 md:grid-cols-2">
                <div>
                  <div className="text-xs font-medium text-zinc-700 dark:text-zinc-300">Referral code</div>
                  <input
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    placeholder="e.g., PARTNER20"
                    className="mt-1 h-9 w-full rounded-md border border-zinc-300 bg-white px-3 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:focus:border-indigo-400"
                  />
                </div>
                <div>
                  <div className="text-xs font-medium text-zinc-700 dark:text-zinc-300">Commission rate (%)</div>
                  <input
                    type="number"
                    min={1}
                    max={100}
                    value={rate}
                    onChange={(e) => setRate(Number(e.target.value))}
                    className="mt-1 h-9 w-full rounded-md border border-zinc-300 bg-white px-3 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:focus:border-indigo-400"
                  />
                </div>
              </div>
              <div className="flex items-center justify-end gap-2">
                <button
                  onClick={() => setShowModal(false)}
                  className="inline-flex h-9 items-center justify-center rounded-md border border-zinc-300 bg-white px-3 text-sm font-medium text-zinc-900 transition hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:hover:bg-zinc-800"
                >
                  Cancel
                </button>
                <button
                  onClick={saveAffiliate}
                  className="inline-flex h-9 items-center justify-center rounded-md bg-indigo-600 px-3 text-sm font-medium text-white transition hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600"
                >
                  {editingId ? "Save changes" : "Invite affiliate"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {confirmSuspendId && (
        <div className="fixed inset-0 z-40">
          <div className="absolute inset-0 bg-black/40" onClick={() => setConfirmSuspendId(null)} />
          <div className="absolute left-1/2 top-1/2 w-[360px] -translate-x-1/2 -translate-y-1/2 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900 shadow-xl dark:border-amber-800 dark:bg-amber-900/20 dark:text-amber-300">
            <div className="text-sm font-semibold">Suspend affiliate</div>
            <p className="mt-2">This will pause attribution and payouts for this affiliate.</p>
            <div className="mt-4 flex items-center justify-end gap-2">
              <button
                onClick={() => setConfirmSuspendId(null)}
                className="inline-flex h-8 items-center justify-center rounded-md border border-zinc-300 bg-white px-2 text-xs font-medium text-zinc-900 transition hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:hover:bg-zinc-800"
              >
                Cancel
              </button>
              <button
                onClick={suspendAffiliate}
                className="inline-flex h-8 items-center justify-center rounded-md bg-amber-600 px-2 text-xs font-medium text-white transition hover:bg-amber-700"
              >
                Suspend
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
