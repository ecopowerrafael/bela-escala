"use client";

import { useState } from "react";
import Link from "next/link";
import { AuthTokenBar } from "../../../components/AuthTokenBar";

type Course = {
  id: string;
  title: string;
  slug: string;
  category?: string | null;
  lessons: { id: string; title: string; order: number }[];
  products?: { productId: string; product?: { name: string } }[];
};

export default function AdminCoursesPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [status, setStatus] = useState("");
  const [slug, setSlug] = useState("");
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [courseId, setCourseId] = useState("");
  const [lessonTitle, setLessonTitle] = useState("");
  const [lessonOrder, setLessonOrder] = useState(1);
  const [durationMin, setDurationMin] = useState(20);

  const loadCourses = async () => {
    const token = window.localStorage.getItem("bela_token");
    if (!token) {
      setStatus("token_required");
      return;
    }

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/courses`, {
      headers: { Authorization: `Bearer ${token}` }
    });

    const data = await response.json();
    if (response.ok) {
      setCourses(data.courses ?? []);
      setStatus("ok");
    } else {
      setStatus(data.error ?? "error");
    }
  };

  const createCourse = async () => {
    const token = window.localStorage.getItem("bela_token");
    if (!token) {
      setStatus("token_required");
      return;
    }

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/courses`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ slug, title, category })
    });

    const data = await response.json();
    setStatus(response.ok ? "curso_criado" : data.error ?? "error");
  };

  const createLesson = async () => {
    const token = window.localStorage.getItem("bela_token");
    if (!token) {
      setStatus("token_required");
      return;
    }

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/admin/courses/${courseId}/lessons`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          title: lessonTitle,
          durationMin,
          order: lessonOrder
        })
      }
    );

    const data = await response.json();
    setStatus(response.ok ? "aula_criada" : data.error ?? "error");
  };

  return (
    <div className="min-h-screen bg-piano px-10 py-10 space-y-8">
      <header className="flex items-center justify-between">
        <div>
          <img src="/logo.png" alt="Bela Escala" className="h-6 w-auto mb-2" />
          <h1 className="text-2xl font-semibold">Admin • Trilhas</h1>
        </div>
        <Link className="text-platinum text-sm" href="/admin">
          Voltar
        </Link>
      </header>

      <AuthTokenBar />

      <div className="glass rounded-xl2 p-6 space-y-4 max-w-xl">
        <h2 className="text-lg font-semibold">Criar trilha</h2>
        <input
          value={slug}
          onChange={(event) => setSlug(event.target.value)}
          placeholder="slug"
          className="w-full rounded-full border border-white/10 bg-transparent px-4 py-2 text-sm text-white focus:outline-none"
        />
        <input
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          placeholder="título"
          className="w-full rounded-full border border-white/10 bg-transparent px-4 py-2 text-sm text-white focus:outline-none"
        />
        <input
          value={category}
          onChange={(event) => setCategory(event.target.value)}
          placeholder="categoria"
          className="w-full rounded-full border border-white/10 bg-transparent px-4 py-2 text-sm text-white focus:outline-none"
        />
        <button
          onClick={createCourse}
          className="rounded-full bg-gradient-to-br from-goldStart to-goldEnd px-4 py-2 text-sm font-semibold text-black"
        >
          Criar trilha
        </button>
      </div>

      <div className="glass rounded-xl2 p-6 space-y-4 max-w-xl">
        <h2 className="text-lg font-semibold">Criar aula</h2>
        <input
          value={courseId}
          onChange={(event) => setCourseId(event.target.value)}
          placeholder="courseId"
          className="w-full rounded-full border border-white/10 bg-transparent px-4 py-2 text-sm text-white focus:outline-none"
        />
        <input
          value={lessonTitle}
          onChange={(event) => setLessonTitle(event.target.value)}
          placeholder="título da aula"
          className="w-full rounded-full border border-white/10 bg-transparent px-4 py-2 text-sm text-white focus:outline-none"
        />
        <input
          type="number"
          value={lessonOrder}
          onChange={(event) => setLessonOrder(Number(event.target.value))}
          placeholder="ordem"
          className="w-full rounded-full border border-white/10 bg-transparent px-4 py-2 text-sm text-white focus:outline-none"
        />
        <input
          type="number"
          value={durationMin}
          onChange={(event) => setDurationMin(Number(event.target.value))}
          placeholder="duração"
          className="w-full rounded-full border border-white/10 bg-transparent px-4 py-2 text-sm text-white focus:outline-none"
        />
        <button
          onClick={createLesson}
          className="rounded-full bg-gradient-to-br from-goldStart to-goldEnd px-4 py-2 text-sm font-semibold text-black"
        >
          Criar aula
        </button>
      </div>

      <div className="glass rounded-xl2 p-6 space-y-4">
        <button
          onClick={loadCourses}
          className="rounded-full bg-gradient-to-br from-goldStart to-goldEnd px-4 py-2 text-sm font-semibold text-black"
        >
          Carregar trilhas
        </button>
        {courses.length > 0 ? (
          <div className="space-y-3 text-sm text-platinum">
            {courses.map((course) => (
              <div key={course.id}>
                <p className="text-white">{course.title}</p>
                <p>ID: {course.id}</p>
                {course.lessons.map((lesson) => (
                  <p key={lesson.id}>
                    {lesson.order}. {lesson.title}
                  </p>
                ))}
                {course.lessons && course.lessons.length > 0 ? (
                  <div className="mt-2 space-y-1">
                    <p className="text-xs">Produtos vinculados:</p>
                    {course.products && course.products.length > 0 ? (
                      course.products.map((prod: any) => (
                        <p key={prod.productId} className="text-xs">
                          {prod.product?.name}
                        </p>
                      ))
                    ) : (
                      <p className="text-xs text-platinum/50">Nenhum</p>
                    )}
                  </div>
                ) : null}
              </div>
            ))}
          </div>
        ) : null}
        {status ? (
          <p className="text-xs text-platinum mt-4">
            {status === "ok" ? "Sucesso!" : 
             status === "token_required" ? "⚠️ Login necessário (use /login)" : 
             status === "error" ? "Erro ao carregar" : status}
          </p>
        ) : null}
      </div>
    </div>
  );
}
