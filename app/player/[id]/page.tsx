"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import { useParams } from "next/navigation";

type LessonType = "video" | "text";
type Lesson = { id: string; title: string; type: LessonType; content: string; duration?: number; completed?: boolean };

function uid() {
  return Math.random().toString(36).slice(2, 9);
}

function ProgressBar({ value }: { value: number }) {
  return (
    <div className="w-full">
      <div className="h-1.5 w-full rounded-full bg-zinc-200 dark:bg-zinc-800">
        <div
          className="h-1.5 rounded-full bg-indigo-600 transition-[width] dark:bg-indigo-500"
          style={{ width: `${Math.max(0, Math.min(100, value))}%` }}
        />
      </div>
    </div>
  );
}

function NotesPanel({
  playerId,
  lessonId,
}: {
  playerId: string;
  lessonId: string;
}) {
  const [notes, setNotes] = useState("");
  useEffect(() => {
    const key = `notes:${playerId}:${lessonId}`;
    const saved = typeof window !== "undefined" ? window.localStorage.getItem(key) : null;
    if (saved) {
      // Defer state update to avoid synchronous setState in effect body
      const id = window.setTimeout(() => setNotes(saved), 0);
      return () => window.clearTimeout(id);
    }
  }, [playerId, lessonId]);
  function onChange(next: string) {
    setNotes(next);
    const key = `notes:${playerId}:${lessonId}`;
    try {
      window.localStorage.setItem(key, next);
    } catch {}
  }
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium">Your notes</label>
      <textarea
        value={notes}
        onChange={(e) => onChange(e.target.value)}
        rows={8}
        className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm outline-none ring-0 transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:focus:border-indigo-400"
      />
      <p className="text-xs text-zinc-500 dark:text-zinc-400">Autosaved locally</p>
    </div>
  );
}

type Comment = { id: string; author: string; text: string; when: string };

function DiscussionPanel({ playerId }: { playerId: string }) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [value, setValue] = useState("");
  useEffect(() => {
    const key = `discussion:${playerId}`;
    const saved = typeof window !== "undefined" ? window.localStorage.getItem(key) : null;
    if (saved) {
      try {
        const parsed = JSON.parse(saved) as Comment[];
        const id = window.setTimeout(() => setComments(parsed), 0);
        return () => window.clearTimeout(id);
      } catch {}
    }
  }, [playerId]);
  function addComment() {
    const next: Comment = { id: uid(), author: "You", text: value.trim(), when: "now" };
    if (!next.text) return;
    const all = [next, ...comments];
    setComments(all);
    setValue("");
    try {
      window.localStorage.setItem(`discussion:${playerId}`, JSON.stringify(all));
    } catch {}
  }
  return (
    <div className="space-y-3">
      <div className="flex gap-2">
        <input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Share a thought or question"
          className="flex-1 rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm outline-none ring-0 transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:focus:border-indigo-400"
        />
        <button
          onClick={addComment}
          className="inline-flex h-9 items-center justify-center rounded-md bg-indigo-600 px-3 text-sm font-medium text-white transition hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600"
        >
          Post
        </button>
      </div>
      <ul className="space-y-2">
        {comments.map((c) => (
          <li
            key={c.id}
            className="rounded-lg border border-zinc-200 bg-white p-3 dark:border-zinc-800 dark:bg-zinc-900"
          >
            <div className="text-sm">{c.text}</div>
            <div className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">{c.author} • {c.when}</div>
          </li>
        ))}
        {comments.length === 0 && (
          <li className="rounded-lg border border-zinc-200 bg-white p-3 text-center text-sm text-zinc-600 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-400">
            No discussion yet. Be the first to start a thread.
          </li>
        )}
      </ul>
    </div>
  );
}

function VideoPlayer({
  src,
  onProgress,
  resumeFrom,
  onEnded,
}: {
  src: string;
  onProgress: (time: number, duration: number) => void;
  resumeFrom?: number;
  onEnded: () => void;
}) {
  const ref = useRef<HTMLVideoElement | null>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (resumeFrom && resumeFrom > 0) {
      try {
        el.currentTime = resumeFrom;
      } catch {}
    }
  }, [resumeFrom]);
  return (
    <video
      ref={ref}
      src={src}
      controls
      onTimeUpdate={(e) => {
        const el = e.currentTarget;
        onProgress(el.currentTime, el.duration || 1);
      }}
      onEnded={onEnded}
      className="aspect-video w-full rounded-lg bg-black"
    />
  );
}

export default function CoursePlayerPage() {
  const params = useParams();
  const playerId = Array.isArray(params?.id) ? params.id[0] : (params?.id as string);

  const initialLessons: Lesson[] = [
    { id: "l1", title: "Welcome", type: "video", content: "/sample-video.mp4", duration: 180 },
    { id: "l2", title: "Orientation", type: "text", content: "This course will help you master the fundamentals." },
    { id: "l3", title: "Module 1", type: "video", content: "/sample-video.mp4", duration: 240 },
  ];

  const [lessons, setLessons] = useState<Lesson[]>(initialLessons);
  const [selectedId, setSelectedId] = useState<string>(initialLessons[0].id);
  const [activeTab, setActiveTab] = useState<"notes" | "discussion">("notes");
  const [resumeTime, setResumeTime] = useState<number>(0);

  const selected = useMemo(() => lessons.find((l) => l.id === selectedId) || null, [lessons, selectedId]);
  const progressPct = useMemo(() => {
    const completed = lessons.filter((l) => l.completed).length;
    return Math.round((completed / lessons.length) * 100);
  }, [lessons]);

  useEffect(() => {
    const key = `player:${playerId}`;
    const saved = typeof window !== "undefined" ? window.localStorage.getItem(key) : null;
    if (saved) {
      try {
        const parsed = JSON.parse(saved) as { selectedId?: string; time?: number };
        const id = window.setTimeout(() => {
          if (parsed.selectedId) setSelectedId(parsed.selectedId);
          if (parsed.time && parsed.time > 0) setResumeTime(parsed.time);
        }, 0);
        return () => window.clearTimeout(id);
      } catch {}
    }
  }, [playerId]);

  function persist(time?: number) {
    const key = `player:${playerId}`;
    const payload = { selectedId, time: time || 0 };
    try {
      window.localStorage.setItem(key, JSON.stringify(payload));
    } catch {}
  }

function onVideoProgress(time: number) {
  setResumeTime(time);
  persist(time);
  if (selected && selected.duration && time >= (selected.duration - 1)) {
    setLessons((prev) => prev.map((l) => (l.id === selected.id ? { ...l, completed: true } : l)));
  }
}

  function markTextComplete() {
    if (!selected) return;
    setLessons((prev) => prev.map((l) => (l.id === selected.id ? { ...l, completed: true } : l)));
    persist(0);
  }

  function goNext() {
    const idx = lessons.findIndex((l) => l.id === selectedId);
    const next = lessons[idx + 1];
    if (next) {
      setSelectedId(next.id);
      setResumeTime(0);
      persist(0);
    }
  }

  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-900 dark:bg-black dark:text-zinc-50">
      <div className="mx-auto max-w-7xl px-6 py-6">
        <div className="mb-4">
          <ProgressBar value={progressPct} />
          <div className="mt-2 flex items-center justify-between">
            <div className="text-sm text-zinc-600 dark:text-zinc-400">
              Progress {progressPct}%
            </div>
            <div className="text-xs text-zinc-500 dark:text-zinc-400">
              Resume saved automatically
            </div>
          </div>
        </div>
        <div className="grid grid-cols-12 gap-4">
          <aside className="col-span-12 md:col-span-3">
            <div className="rounded-xl border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900">
              <div className="flex items-center justify-between px-3 py-2">
                <div className="text-sm font-semibold">Lessons</div>
              </div>
              <div className="divide-y divide-zinc-200 dark:divide-zinc-800">
                {lessons.map((l, i) => (
                  <button
                    key={l.id}
                    onClick={() => {
                      setSelectedId(l.id);
                      setResumeTime(0);
                      persist(0);
                    }}
                    className={
                      selectedId === l.id
                        ? "flex w-full items-center justify-between px-3 py-2 text-left text-sm bg-zinc-100 dark:bg-zinc-800"
                        : "flex w-full items-center justify-between px-3 py-2 text-left text-sm hover:bg-zinc-100 dark:hover:bg-zinc-800"
                    }
                  >
                    <span className="truncate">{i + 1}. {l.title}</span>
                    {l.completed && (
                      <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-medium text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300">
                        Done
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>
          </aside>

          <section className="col-span-12 md:col-span-6">
            <div className="rounded-xl border border-zinc-200 bg-white p-3 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
              {selected?.type === "video" && selected.content ? (
                <VideoPlayer
                  src={selected.content}
                  resumeFrom={resumeTime}
                  onProgress={onVideoProgress}
                  onEnded={() => {
                    if (selected) {
                      setLessons((prev) => prev.map((l) => (l.id === selected.id ? { ...l, completed: true } : l)));
                    }
                  }}
                />
              ) : (
                <div className="space-y-4">
                  <div className="rounded-lg border border-zinc-200 bg-white p-3 dark:border-zinc-800 dark:bg-zinc-900">
                    <div className="prose prose-zinc dark:prose-invert max-w-none text-sm">
                      {selected?.content}
                    </div>
                  </div>
                  <button
                    onClick={markTextComplete}
                    className="inline-flex h-9 items-center justify-center rounded-md bg-indigo-600 px-3 text-sm font-medium text-white transition hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600"
                  >
                    Mark complete
                  </button>
                </div>
              )}
            </div>
            <div className="mt-4 rounded-xl border border-zinc-200 bg-white p-3 dark:border-zinc-800 dark:bg-zinc-900">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setActiveTab("notes")}
                  className={
                    activeTab === "notes"
                      ? "rounded-md bg-zinc-100 px-2 py-1 text-xs font-medium dark:bg-zinc-800"
                      : "rounded-md px-2 py-1 text-xs text-zinc-700 transition hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800"
                  }
                >
                  Notes
                </button>
                <button
                  onClick={() => setActiveTab("discussion")}
                  className={
                    activeTab === "discussion"
                      ? "rounded-md bg-zinc-100 px-2 py-1 text-xs font-medium dark:bg-zinc-800"
                      : "rounded-md px-2 py-1 text-xs text-zinc-700 transition hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800"
                  }
                >
                  Discussion
                </button>
              </div>
              <div className="mt-3">
                {activeTab === "notes" && selected && (
                  <NotesPanel playerId={playerId} lessonId={selected.id} />
                )}
                {activeTab === "discussion" && <DiscussionPanel playerId={playerId} />}
              </div>
            </div>
          </section>

          <aside className="col-span-12 md:col-span-3">
            <div className="rounded-xl border border-zinc-200 bg-white p-3 dark:border-zinc-800 dark:bg-zinc-900">
              <div className="text-sm font-semibold">Next up</div>
              <div className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
                Continue to the next lesson when ready.
              </div>
              <button
                onClick={goNext}
                className="mt-3 inline-flex h-9 w-full items-center justify-center rounded-md bg-indigo-600 px-3 text-sm font-medium text-white transition hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600"
              >
                Next lesson
              </button>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
