"use client";
import { useRef, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";

type LessonType = "video" | "text" | "quiz" | "live";
type Lesson = { id: string; title: string; type: LessonType; data?: Record<string, unknown> };
type Section = { id: string; title: string; lessons: Lesson[] };

function uid() {
  return Math.random().toString(36).slice(2, 9);
}

function EditorPanel({
  current,
  selected,
  updateLessonTitle,
  updateLessonData,
  saving,
}: {
  current: Lesson | null;
  selected: { sectionId: string; lessonId: string } | null;
  updateLessonTitle: (sectionId: string, lessonId: string, title: string) => void;
  updateLessonData: (field: string, value: unknown) => void;
  saving: "idle" | "saving" | "saved";
}) {
  if (!current || !selected) {
    return (
      <div className="rounded-xl border border-zinc-200 bg-white p-6 text-center dark:border-zinc-800 dark:bg-zinc-900">
        <div className="text-sm font-medium">Select a lesson to edit</div>
        <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
          Choose a lesson from the left to start editing.
        </p>
      </div>
    );
  }
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <input
          value={current.title}
          onChange={(e) => updateLessonTitle(selected.sectionId, selected.lessonId, e.target.value)}
          className="w-2/3 rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm outline-none ring-0 transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:focus:border-indigo-400"
        />
        <span
          className={
            saving === "saving"
              ? "rounded-full bg-amber-100 px-2 py-1 text-xs font-medium text-amber-700 dark:bg-amber-900/40 dark:text-amber-300"
              : "rounded-full bg-emerald-100 px-2 py-1 text-xs font-medium text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300"
          }
        >
          {saving === "saving" ? "Saving…" : "Saved"}
        </span>
      </div>
      {current.type === "video" && (
        <div className="space-y-2">
          <label className="text-sm font-medium">Video URL</label>
          <input
            value={(current.data?.url as string) || ""}
            onChange={(e) => updateLessonData("url", e.target.value)}
            placeholder="https://"
            className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm outline-none ring-0 transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:focus:border-indigo-400"
          />
        </div>
      )}
      {current.type === "text" && (
        <div className="space-y-2">
          <label className="text-sm font-medium">Content</label>
          <textarea
            value={(current.data?.content as string) || ""}
            onChange={(e) => updateLessonData("content", e.target.value)}
            rows={10}
            className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm outline-none ring-0 transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:focus:border-indigo-400"
          />
        </div>
      )}
      {current.type === "quiz" && (
        <div className="space-y-2">
          <label className="text-sm font-medium">Question</label>
          <input
            value={(current.data?.question as string) || ""}
            onChange={(e) => updateLessonData("question", e.target.value)}
            className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm outline-none ring-0 transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:focus:border-indigo-400"
          />
          <div className="space-y-2">
            <label className="text-sm font-medium">Options</label>
            {Array.isArray(current.data?.options) &&
              (current.data?.options as string[]).map((opt, idx) => (
                <input
                  key={idx}
                  value={opt}
                  onChange={(e) => {
                    const next = [...((current.data?.options as string[]) || [])];
                    next[idx] = e.target.value;
                    updateLessonData("options", next);
                  }}
                  className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm outline-none ring-0 transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:focus:border-indigo-400"
                />
              ))}
            <div>
              <button
                type="button"
                onClick={() => {
                  const next = Array.isArray(current.data?.options)
                    ? ([...(current.data?.options as string[]), ""] as string[])
                    : ([""] as string[]);
                  updateLessonData("options", next);
                }}
                className="inline-flex h-8 items-center justify-center rounded-md border border-zinc-300 bg-white px-2 text-xs font-medium text-zinc-900 transition hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:hover:bg-zinc-800"
              >
                Add option
              </button>
            </div>
          </div>
        </div>
      )}
      {current.type === "live" && (
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-2">
            <label className="text-sm font-medium">Date</label>
            <input
              type="date"
              value={(current.data?.date as string) || ""}
              onChange={(e) => updateLessonData("date", e.target.value)}
              className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm outline-none ring-0 transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:focus:border-indigo-400"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Time</label>
            <input
              type="time"
              value={(current.data?.time as string) || ""}
              onChange={(e) => updateLessonData("time", e.target.value)}
              className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm outline-none ring-0 transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:focus:border-indigo-400"
            />
          </div>
        </div>
      )}
    </div>
  );
}

function SettingsPanel({ markDirty }: { markDirty: () => void }) {
  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900">
        <div className="text-sm font-semibold">Lesson settings</div>
        <div className="mt-3 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm">Published</span>
            <input type="checkbox" className="h-4 w-4 rounded" onChange={() => markDirty()} />
          </div>
          <div>
            <label className="text-sm">Visibility</label>
            <select
              className="mt-1 w-full rounded-md border border-zinc-300 bg-white px-2 py-2 text-sm outline-none ring-0 transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:focus:border-indigo-400"
              onChange={() => markDirty()}
            >
              <option value="public">Public</option>
              <option value="enrolled">Enrolled only</option>
              <option value="private">Private</option>
            </select>
          </div>
          <div>
            <label className="text-sm">Duration (min)</label>
            <input
              type="number"
              min={0}
              className="mt-1 w-full rounded-md border border-zinc-300 bg-white px-2 py-2 text-sm outline-none ring-0 transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:focus:border-indigo-400"
              onChange={() => markDirty()}
            />
          </div>
        </div>
      </div>
      <div className="rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900">
        <div className="text-sm font-semibold">Course settings</div>
        <div className="mt-3 space-y-3">
          <div>
            <label className="text-sm">Course title</label>
            <input
              defaultValue="Untitled course"
              className="mt-1 w-full rounded-md border border-zinc-300 bg-white px-2 py-2 text-sm outline-none ring-0 transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:focus:border-indigo-400"
              onChange={() => markDirty()}
            />
          </div>
          <div>
            <label className="text-sm">Category</label>
            <input
              placeholder="e.g., AI"
              className="mt-1 w-full rounded-md border border-zinc-300 bg-white px-2 py-2 text-sm outline-none ring-0 transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:focus:border-indigo-400"
              onChange={() => markDirty()}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CourseBuilderPage() {
  const params = useParams();
  const courseId = Array.isArray(params?.id) ? params.id[0] : (params?.id as string);

  const [sections, setSections] = useState<Section[]>([
    {
      id: uid(),
      title: "Getting Started",
      lessons: [
        { id: uid(), title: "Welcome", type: "text" },
        { id: uid(), title: "Orientation", type: "video" },
      ],
    },
    {
      id: uid(),
      title: "Core",
      lessons: [
        { id: uid(), title: "Module 1", type: "text" },
        { id: uid(), title: "Knowledge Check", type: "quiz" },
      ],
    },
  ]);

  const [selected, setSelected] = useState<{ sectionId: string; lessonId: string } | null>({
    sectionId: sections[0].id,
    lessonId: sections[0].lessons[0].id,
  });

  const [saving, setSaving] = useState<"idle" | "saving" | "saved">("saved");
  const saveTimer = useRef<number | null>(null);

  function markDirty() {
    setSaving("saving");
    if (saveTimer.current) {
      clearTimeout(saveTimer.current);
    }
    saveTimer.current = window.setTimeout(() => {
      setSaving("saved");
      saveTimer.current = null;
    }, 800);
  }

  function selectLesson(sectionId: string, lessonId: string) {
    setSelected({ sectionId, lessonId });
  }

  function updateSectionTitle(id: string, title: string) {
    setSections((prev) =>
      prev.map((s) => (s.id === id ? { ...s, title } : s))
    );
    markDirty();
  }

  function updateLessonTitle(sectionId: string, lessonId: string, title: string) {
    setSections((prev) =>
      prev.map((s) =>
        s.id === sectionId
          ? { ...s, lessons: s.lessons.map((l) => (l.id === lessonId ? { ...l, title } : l)) }
          : s
      )
    );
    markDirty();
  }

  function addLesson(sectionId: string, type: LessonType) {
    const newL: Lesson = { id: uid(), title: "Untitled", type };
    setSections((prev) =>
      prev.map((s) => (s.id === sectionId ? { ...s, lessons: [...s.lessons, newL] } : s))
    );
    setSelected({ sectionId, lessonId: newL.id });
    markDirty();
  }

  function onDragStart(e: React.DragEvent<HTMLDivElement>, sectionId: string, lessonId: string) {
    e.dataTransfer.setData("text/plain", JSON.stringify({ sectionId, lessonId }));
    e.dataTransfer.effectAllowed = "move";
  }
  function onDragOver(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  }
  function onDropLesson(
    e: React.DragEvent<HTMLDivElement>,
    targetSectionId: string,
    targetLessonId?: string
  ) {
    e.preventDefault();
    const data = e.dataTransfer.getData("text/plain");
    if (!data) return;
    const { sectionId, lessonId } = JSON.parse(data) as { sectionId: string; lessonId: string };
    if (!sectionId || !lessonId) return;
    setSections((prev) => {
      const srcSection = prev.find((s) => s.id === sectionId);
      const dstSection = prev.find((s) => s.id === targetSectionId);
      if (!srcSection || !dstSection) return prev;
      const moving = srcSection.lessons.find((l) => l.id === lessonId);
      if (!moving) return prev;
      const srcRest = srcSection.lessons.filter((l) => l.id !== lessonId);
      const dstLessons = [...dstSection.lessons];
      if (targetLessonId) {
        const idx = dstLessons.findIndex((l) => l.id === targetLessonId);
        if (idx >= 0) {
          dstLessons.splice(idx, 0, moving);
        } else {
          dstLessons.push(moving);
        }
      } else {
        dstLessons.push(moving);
      }
      return prev.map((s) => {
        if (s.id === srcSection.id && s.id === dstSection.id) {
          const without = srcRest;
          const withInserted = [...without];
          if (targetLessonId) {
            const idx = withInserted.findIndex((l) => l.id === targetLessonId);
            if (idx >= 0) withInserted.splice(idx, 0, moving);
            else withInserted.push(moving);
          } else {
            withInserted.push(moving);
          }
          return { ...s, lessons: withInserted };
        }
        if (s.id === srcSection.id) return { ...s, lessons: srcRest };
        if (s.id === dstSection.id) return { ...s, lessons: dstLessons };
        return s;
      });
    });
    markDirty();
  }

  const current =
    selected &&
    sections
      .find((s) => s.id === selected.sectionId)
      ?.lessons.find((l) => l.id === selected.lessonId) || null;

  function updateLessonData(field: string, value: unknown) {
    if (!selected) return;
    setSections((prev) =>
      prev.map((s) =>
        s.id === selected.sectionId
          ? {
              ...s,
              lessons: s.lessons.map((l) =>
                l.id === selected.lessonId ? { ...l, data: { ...(l.data || {}), [field]: value } } : l
              ),
            }
          : s
      )
    );
    markDirty();
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-semibold">Course Builder</h1>
          <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">Edit structure, content, and settings.</p>
        </div>
        <div className="flex items-center gap-2">
          <Link
            href={`/dashboard/courses/${courseId}`}
            className="inline-flex h-9 items-center justify-center rounded-md border border-zinc-300 bg-white px-3 text-sm font-medium text-zinc-900 transition hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:hover:bg-zinc-800"
          >
            Back to course
          </Link>
        </div>
      </div>
      <div className="grid grid-cols-12 gap-4">
        <aside className="col-span-12 md:col-span-3">
          <div className="rounded-xl border border-zinc-200 bg-white p-3 dark:border-zinc-800 dark:bg-zinc-900">
            <div className="flex items-center justify-between">
              <div className="text-sm font-semibold">Structure</div>
              <button
                className="inline-flex h-8 items-center justify-center rounded-md border border-zinc-300 bg-white px-2 text-xs font-medium text-zinc-900 transition hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:hover:bg-zinc-800"
                onClick={() =>
                  setSections((prev) => [...prev, { id: uid(), title: "New section", lessons: [] }])
                }
              >
                Add section
              </button>
            </div>
            <div className="mt-3 space-y-3">
              {sections.map((s) => (
                <div key={s.id} className="rounded-lg border border-zinc-200 bg-white p-2 dark:border-zinc-800 dark:bg-zinc-900">
                  <input
                    value={s.title}
                    onChange={(e) => updateSectionTitle(s.id, e.target.value)}
                    className="w-full rounded-md border border-zinc-300 bg-white px-2 py-1 text-sm outline-none ring-0 transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:focus:border-indigo-400"
                  />
                  <div className="mt-2 space-y-2">
                    {s.lessons.map((l) => (
                      <div
                        key={l.id}
                        draggable
                        onDragStart={(e) => onDragStart(e, s.id, l.id)}
                        onDragOver={onDragOver}
                        onDrop={(e) => onDropLesson(e, s.id, l.id)}
                        onClick={() => selectLesson(s.id, l.id)}
                        className={
                          selected?.lessonId === l.id
                            ? "flex cursor-pointer items-center justify-between rounded-md bg-zinc-100 px-2 py-1 text-sm dark:bg-zinc-800"
                            : "flex cursor-pointer items-center justify-between rounded-md px-2 py-1 text-sm hover:bg-zinc-100 dark:hover:bg-zinc-800"
                        }
                      >
                        <div className="flex items-center gap-2">
                          <span className="inline-block h-3 w-3 rounded-sm bg-zinc-300 dark:bg-zinc-700" />
                          <span className="truncate">{l.title}</span>
                        </div>
                        <span className="text-xs text-zinc-500 dark:text-zinc-400">{l.type}</span>
                      </div>
                    ))}
                    <div
                      onDragOver={onDragOver}
                      onDrop={(e) => onDropLesson(e, s.id)}
                      className="rounded-md border border-dashed border-zinc-300 p-2 text-center text-xs text-zinc-500 dark:border-zinc-700 dark:text-zinc-400"
                    >
                      Drop here to add
                    </div>
                  </div>
                  <div className="mt-2 grid grid-cols-4 gap-2">
                    <button
                      onClick={() => addLesson(s.id, "video")}
                      className="inline-flex h-8 items-center justify-center rounded-md border border-zinc-300 bg-white px-2 text-xs transition hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:hover:bg-zinc-800"
                    >
                      Video
                    </button>
                    <button
                      onClick={() => addLesson(s.id, "text")}
                      className="inline-flex h-8 items-center justify-center rounded-md border border-zinc-300 bg-white px-2 text-xs transition hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:hover:bg-zinc-800"
                    >
                      Text
                    </button>
                    <button
                      onClick={() => addLesson(s.id, "quiz")}
                      className="inline-flex h-8 items-center justify-center rounded-md border border-zinc-300 bg-white px-2 text-xs transition hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:hover:bg-zinc-800"
                    >
                      Quiz
                    </button>
                    <button
                      onClick={() => addLesson(s.id, "live")}
                      className="inline-flex h-8 items-center justify-center rounded-md border border-zinc-300 bg-white px-2 text-xs transition hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:hover:bg-zinc-800"
                    >
                      Live
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </aside>
        <section className="col-span-12 md:col-span-6">
          <EditorPanel
            current={current}
            selected={selected}
            updateLessonTitle={updateLessonTitle}
            updateLessonData={updateLessonData}
            saving={saving}
          />
        </section>
        <aside className="col-span-12 md:col-span-3">
          <SettingsPanel markDirty={markDirty} />
        </aside>
      </div>
    </div>
  );
}
