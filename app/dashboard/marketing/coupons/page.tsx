"use client";
import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

type DiscountType = "percentage" | "flat";
type Coupon = {
  id: string;
  code: string;
  type: DiscountType;
  value: number;
  limit: number;
  used: number;
  courses: string[];
  expiry: string;
  disabled?: boolean;
};

function StatusBadge({ coupon }: { coupon: Coupon }) {
  const now = new Date();
  const expired = new Date(coupon.expiry) < now;
  const isDisabled = !!coupon.disabled;
  const label = isDisabled ? "Disabled" : expired ? "Expired" : "Active";
  const classes = isDisabled
    ? "bg-rose-100 text-rose-800 dark:bg-rose-900/20 dark:text-rose-300"
    : expired
    ? "bg-amber-100 text-amber-800 dark:bg-amber-900/20 dark:text-amber-300"
    : "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/20 dark:text-emerald-300";
  return <span className={`rounded-full px-2 py-0.5 text-[11px] font-medium ${classes}`}>{label}</span>;
}
function SkeletonRow() {
  return (
    <tr className="animate-pulse">
      <td className="px-3 py-3">
        <div className="h-4 w-24 rounded bg-zinc-200 dark:bg-zinc-800" />
      </td>
      <td className="px-3 py-3">
        <div className="h-4 w-24 rounded bg-zinc-200 dark:bg-zinc-800" />
      </td>
      <td className="px-3 py-3">
        <div className="h-4 w-28 rounded bg-zinc-200 dark:bg-zinc-800" />
      </td>
      <td className="px-3 py-3">
        <div className="h-4 w-36 rounded bg-zinc-200 dark:bg-zinc-800" />
      </td>
      <td className="px-3 py-3">
        <div className="h-4 w-28 rounded bg-zinc-200 dark:bg-zinc-800" />
      </td>
      <td className="px-3 py-3">
        <div className="h-4 w-20 rounded bg-zinc-200 dark:bg-zinc-800" />
      </td>
      <td className="px-3 py-3">
        <div className="h-8 w-24 rounded bg-zinc-200 dark:bg-zinc-800" />
      </td>
    </tr>
  );
}

export default function CouponsPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [coupons, setCoupons] = useState<Coupon[]>([
    { id: "c1", code: "NEWYEAR20", type: "percentage", value: 20, limit: 200, used: 48, courses: ["AI Foundations", "Prompt Engineering"], expiry: "2026-02-01T00:00:00Z" },
    { id: "c2", code: "AI50", type: "flat", value: 50, limit: 100, used: 75, courses: ["AI Foundations"], expiry: "2025-12-31T00:00:00Z" },
  ]);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [code, setCode] = useState("");
  const [type, setType] = useState<DiscountType>("percentage");
  const [value, setValue] = useState<number>(10);
  const [expiry, setExpiry] = useState("");
  const [limit, setLimit] = useState<number>(100);
  const [selectedCourses, setSelectedCourses] = useState<string[]>([]);
  const [error, setError] = useState<string>("");
  const [confirmDisableId, setConfirmDisableId] = useState<string | null>(null);

  const allCourses = useMemo(() => {
    return Array.from(new Set(["AI Foundations", "Prompt Engineering", "Data Viz Mastery", ...coupons.flatMap((c) => c.courses)]));
  }, [coupons]);

  const expiredCount = useMemo(() => {
    const now = new Date();
    return coupons.filter((c) => new Date(c.expiry) < now && !c.disabled).length;
  }, [coupons]);

  function openCreate() {
    setEditingId(null);
    setCode("");
    setType("percentage");
    setValue(10);
    setLimit(100);
    setExpiry("");
    setSelectedCourses([]);
    setError("");
    setShowModal(true);
  }
  function openEdit(c: Coupon) {
    setEditingId(c.id);
    setCode(c.code);
    setType(c.type);
    setValue(c.value);
    setLimit(c.limit);
    setExpiry(c.expiry.slice(0, 10));
    setSelectedCourses(c.courses);
    setError("");
    setShowModal(true);
  }
  function toggleCourse(name: string) {
    setSelectedCourses((prev) => (prev.includes(name) ? prev.filter((n) => n !== name) : [...prev, name]));
  }
  function saveCoupon() {
    if (!code.trim()) {
      setError("Coupon code is required");
      return;
    }
    if (value <= 0) {
      setError("Discount value must be greater than 0");
      return;
    }
    if (limit <= 0) {
      setError("Usage limit must be greater than 0");
      return;
    }
    if (!expiry) {
      setError("Expiry date is required");
      return;
    }
    const exists = coupons.some((c) => c.code.toLowerCase() === code.toLowerCase() && c.id !== editingId);
    if (exists) {
      setError("Coupon code must be unique");
      return;
    }
    const payload: Coupon = {
      id: editingId ?? Math.random().toString(36).slice(2, 9),
      code,
      type,
      value,
      limit,
      used: editingId ? coupons.find((c) => c.id === editingId)?.used ?? 0 : 0,
      courses: selectedCourses,
      expiry: new Date(expiry).toISOString(),
      disabled: editingId ? coupons.find((c) => c.id === editingId)?.disabled : false,
    };
    if (editingId) {
      setCoupons((prev) => prev.map((c) => (c.id === editingId ? payload : c)));
    } else {
      setCoupons((prev) => [payload, ...prev]);
    }
    setShowModal(false);
  }
  function confirmDisable(id: string) {
    setConfirmDisableId(id);
  }
  function disableCoupon() {
    if (!confirmDisableId) return;
    setCoupons((prev) => prev.map((c) => (c.id === confirmDisableId ? { ...c, disabled: true } : c)));
    setConfirmDisableId(null);
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-semibold">Coupons</h1>
          <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">Create, manage, and analyze discount coupons</p>
        </div>
        <div className="flex items-center gap-2">
          <Link
            href="/dashboard/marketing/overview"
            className="inline-flex h-9 items-center justify-center rounded-md border border-zinc-300 bg-white px-3 text-sm font-medium text-zinc-900 transition hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:hover:bg-zinc-800"
          >
            Back to overview
          </Link>
          <button
            onClick={openCreate}
            className="inline-flex h-9 items-center justify-center rounded-md bg-indigo-600 px-3 text-sm font-medium text-white transition hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600"
          >
            Create Coupon
          </button>
        </div>
      </div>

      {expiredCount > 0 && (
        <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900 dark:border-amber-800 dark:bg-amber-900/20 dark:text-amber-300">
          {expiredCount} coupon{expiredCount > 1 ? "s" : ""} have expired. Consider updating expiry dates or creating new coupons.
        </div>
      )}

      <div className="rounded-xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
        <div className="max-h-[520px] overflow-auto">
          <table className="w-full text-sm">
            <thead className="sticky top-0 z-10 bg-white dark:bg-zinc-900">
              <tr className="text-left">
                <th className="px-3 py-2 font-semibold">Coupon code</th>
                <th className="px-3 py-2 font-semibold">Discount type</th>
                <th className="px-3 py-2 font-semibold">Usage</th>
                <th className="px-3 py-2 font-semibold">Linked courses</th>
                <th className="px-3 py-2 font-semibold">Expiry date</th>
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
              ) : coupons.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-3 py-12">
                    <div className="mx-auto max-w-md rounded-xl border border-zinc-200 bg-zinc-50 p-6 text-center shadow-sm dark:border-zinc-800 dark:bg-zinc-800/40">
                      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-indigo-100 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-300">
                        <svg viewBox="0 0 24 24" className="h-8 w-8" fill="none">
                          <path d="M3 13h18v2H3v-2zm2-4h14v2H5V9zm3-4h8v2H8V5zm3 12h2v4h-2v-4z" className="fill-current" />
                        </svg>
                      </div>
                      <div className="mt-4 text-base font-medium">No coupons yet</div>
                      <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">Create your first coupon to promote enrollments and reward your audience.</p>
                      <div className="mt-4">
                        <button
                          onClick={openCreate}
                          className="inline-flex h-9 items-center justify-center rounded-md bg-indigo-600 px-3 text-sm font-medium text-white transition hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600"
                        >
                          Create Coupon
                        </button>
                      </div>
                    </div>
                  </td>
                </tr>
              ) : (
                coupons.map((c) => (
                  <tr key={c.id} className="hover:bg-zinc-50 dark:hover:bg-zinc-800/40">
                    <td className="px-3 py-2">{c.code}</td>
                    <td className="px-3 py-2">{c.type === "percentage" ? "Percentage" : "Flat"}</td>
                    <td className="px-3 py-2">
                      <span className="font-medium">{c.used}</span> / {c.limit}
                    </td>
                    <td className="px-3 py-2">
                      {c.courses.length ? c.courses.join(", ") : "—"}
                    </td>
                    <td className="px-3 py-2">{new Date(c.expiry).toLocaleDateString()}</td>
                    <td className="px-3 py-2">
                      <StatusBadge coupon={c} />
                    </td>
                    <td className="px-3 py-2">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => openEdit(c)}
                          className="inline-flex h-8 items-center justify-center rounded-md border border-zinc-300 bg-white px-2 text-xs font-medium text-zinc-900 transition hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:hover:bg-zinc-800"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => confirmDisable(c.id)}
                          className="inline-flex h-8 items-center justify-center rounded-md border border-rose-300 bg-white px-2 text-xs font-medium text-rose-700 transition hover:bg-rose-50 dark:border-rose-900/50 dark:bg-zinc-900 dark:text-rose-300 dark:hover:bg-rose-950/30"
                        >
                          Disable
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-40">
          <div className="absolute inset-0 bg-black/40" onClick={() => setShowModal(false)} />
          <div className="absolute left-1/2 top-1/2 w-[520px] -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-xl dark:border-zinc-800 dark:bg-zinc-900">
            <div className="flex items-center justify-between border-b border-zinc-200 px-4 py-3 text-sm font-semibold dark:border-zinc-800">
              {editingId ? "Edit Coupon" : "Create Coupon"}
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
                <div className="text-xs font-medium text-zinc-700 dark:text-zinc-300">Coupon code</div>
                <input
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  placeholder="e.g., SUMMER25"
                  className="mt-1 h-9 w-full rounded-md border border-zinc-300 bg-white px-3 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:focus:border-indigo-400"
                />
              </div>
              <div className="grid gap-3 md:grid-cols-2">
                <div>
                  <div className="text-xs font-medium text-zinc-700 dark:text-zinc-300">Discount type</div>
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value as DiscountType)}
                    className="mt-1 h-9 w-full rounded-md border border-zinc-300 bg-white px-2 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:focus:border-indigo-400"
                  >
                    <option value="percentage">Percentage</option>
                    <option value="flat">Flat</option>
                  </select>
                </div>
                <div>
                  <div className="text-xs font-medium text-zinc-700 dark:text-zinc-300">Discount value</div>
                  <input
                    type="number"
                    min={1}
                    value={value}
                    onChange={(e) => setValue(Number(e.target.value))}
                    placeholder={type === "percentage" ? "e.g., 25" : "e.g., 50"}
                    className="mt-1 h-9 w-full rounded-md border border-zinc-300 bg-white px-3 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:focus:border-indigo-400"
                  />
                </div>
              </div>
              <div className="grid gap-3 md:grid-cols-2">
                <div>
                  <div className="text-xs font-medium text-zinc-700 dark:text-zinc-300">Expiry date</div>
                  <input
                    type="date"
                    value={expiry}
                    onChange={(e) => setExpiry(e.target.value)}
                    className="mt-1 h-9 w-full rounded-md border border-zinc-300 bg-white px-2 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:focus:border-indigo-400"
                  />
                </div>
                <div>
                  <div className="text-xs font-medium text-zinc-700 dark:text-zinc-300">Usage limit</div>
                  <input
                    type="number"
                    min={1}
                    value={limit}
                    onChange={(e) => setLimit(Number(e.target.value))}
                    className="mt-1 h-9 w-full rounded-md border border-zinc-300 bg-white px-2 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:focus:border-indigo-400"
                  />
                </div>
              </div>
              <div>
                <div className="text-xs font-medium text-zinc-700 dark:text-zinc-300">Linked courses</div>
                <div className="mt-2 grid grid-cols-2 gap-2">
                  {allCourses.map((course) => {
                    const checked = selectedCourses.includes(course);
                    return (
                      <label key={course} className="flex items-center gap-2 text-sm">
                        <input type="checkbox" checked={checked} onChange={() => toggleCourse(course)} />
                        <span>{course}</span>
                      </label>
                    );
                  })}
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
                  onClick={saveCoupon}
                  className="inline-flex h-9 items-center justify-center rounded-md bg-indigo-600 px-3 text-sm font-medium text-white transition hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600"
                >
                  {editingId ? "Save changes" : "Create coupon"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {confirmDisableId && (
        <div className="fixed inset-0 z-40">
          <div className="absolute inset-0 bg-black/40" onClick={() => setConfirmDisableId(null)} />
          <div className="absolute left-1/2 top-1/2 w-[360px] -translate-x-1/2 -translate-y-1/2 rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-800 shadow-xl dark:border-rose-800 dark:bg-rose-950/40 dark:text-rose-300">
            <div className="text-sm font-semibold">Disable coupon</div>
            <p className="mt-2">This will immediately disable the coupon. Students will no longer be able to redeem it.</p>
            <div className="mt-4 flex items-center justify-end gap-2">
              <button
                onClick={() => setConfirmDisableId(null)}
                className="inline-flex h-8 items-center justify-center rounded-md border border-zinc-300 bg-white px-2 text-xs font-medium text-zinc-900 transition hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:hover:bg-zinc-800"
              >
                Cancel
              </button>
              <button
                onClick={disableCoupon}
                className="inline-flex h-8 items-center justify-center rounded-md bg-rose-600 px-2 text-xs font-medium text-white transition hover:bg-rose-700"
              >
                Disable
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

