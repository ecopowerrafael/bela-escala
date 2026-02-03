"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { LessonProgressButton } from "../../components/courses/LessonProgressButton";

type Lesson = {
  id: string;
  title: string;
  durationMin: number;
  order: number;
};

type Course = {
  id: string;
  slug: string;
  title: string;
  description?: string | null;
  category?: string | null;
  lessons: Lesson[];
};

type Progress = {
  lessonId: string;
  completed: boolean;
};

export default function CoursesPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [status, setStatus] = useState("");
  const [progress, setProgress] = useState<Record<string, boolean>>({});
  const [locked, setLocked] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const load = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/courses`);
        const data = await response.json();
        setCourses(data.courses ?? []);
      } catch {
        setStatus("erro_ao_carregar");
      }
    };

    const loadProgress = async () => {
      const token = window.localStorage.getItem("bela_token");
      if (!token) return;

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/me/progress`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.ok) {
        const data = (await response.json()) as { progress?: Progress[] };
        const map: Record<string, boolean> = {};
        (data.progress ?? []).forEach((item) => {
          map[item.lessonId] = item.completed;
        });
        setProgress(map);
      }
    };

    const checkAccess = async () => {
      const token = window.localStorage.getItem("bela_token");
      if (!token) {
        const data = (await (await fetch(`${process.env.NEXT_PUBLIC_API_URL}/courses`)).json()) as {
          courses?: Course[];
        };
        (data.courses ?? []).forEach((course) => {
          setLocked((prev) => ({ ...prev, [course.id]: false }));
        });
        return;
      }

      const lockedMap: Record<string, boolean> = {};
      for (const course of courses) {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/courses/${course.slug}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        lockedMap[course.id] = response.status === 403;
      }
      setLocked(lockedMap);
    };

    load();
    loadProgress();
  }, []);

  useEffect(() => {
    const token = window.localStorage.getItem("bela_token");
    if (!token) return;

    const check = async () => {
      const lockedMap: Record<string, boolean> = {};
      for (const course of courses) {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/courses/${course.slug}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        lockedMap[course.id] = response.status === 403;
      }
      setLocked(lockedMap);
    };

    if (courses.length > 0) {
      check();
    }
  }, [courses]);

  return (
    <div className="min-h-screen bg-piano px-10 py-10 space-y-8">
      <header className="flex items-center justify-between">
        <div>
          <img src="/logo.png" alt="Bela Escala" className="h-6 w-auto mb-2" />
          <h1 className="text-2xl font-semibold">Trilhas</h1>
        </div>
        <Link className="text-platinum text-sm" href="/">
          Voltar
        </Link>
      </header>

      {status ? <p className="text-xs text-platinum">{status}</p> : null}

      <div className="grid gap-6 lg:grid-cols-2">
        {courses.map((course) => (
          <div
            key={course.id}
            className={`glass rounded-xl2 p-6 space-y-4 relative ${
              locked[course.id] ? "opacity-60" : ""
            }`}
          >
            <div>
              <p className="text-sm text-platinum">{course.category ?? "Trilha"}</p>
              <h2 className="text-xl font-semibold">{course.title}</h2>
              <p className="text-sm text-platinum">{course.description}</p>
            </div>
            <div className="space-y-2">
              {course.lessons.map((lesson) => (
                <div key={lesson.id} className="flex items-center justify-between text-sm">
                  <p>
                    {lesson.order}. {lesson.title}
                  </p>
                  <div className="flex items-center gap-3">
                    <span className="text-platinum">{lesson.durationMin} min</span>
                    {!locked[course.id] ? (
                      <LessonProgressButton
                        lessonId={lesson.id}
                        completed={progress[lesson.id] ?? false}
                        onUpdate={(completed) =>
                          setProgress((prev) => ({ ...prev, [lesson.id]: completed }))
                        }
                      />
                    ) : null}
                  </div>
                </div>
              ))}
            </div>
            {locked[course.id] ? (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 rounded-xl2 lock-overlay">
                <div className="h-12 w-12 rounded-full bg-gradient-to-br from-goldStart to-goldEnd shadow-glow flex items-center justify-center">
                  <span className="text-black text-xl">🔒</span>
                </div>
                <Link
                  href="/catalog"
                  className="rounded-full bg-gradient-to-br from-goldStart to-goldEnd px-4 py-2 text-sm font-semibold text-black"
                >
                  Desbloquear
                </Link>
              </div>
            ) : null}
          </div>
        ))}
      </div>
    </div>
  );
}

