"use client";

import { useState } from "react";

type LessonProgressButtonProps = {
  lessonId: string;
  completed: boolean;
  onUpdate: (completed: boolean) => void;
};

export const LessonProgressButton = ({
  lessonId,
  completed,
  onUpdate
}: LessonProgressButtonProps) => {
  const [loading, setLoading] = useState(false);

  const toggle = async () => {
    if (loading) return;
    const token = window.localStorage.getItem("bela_token");
    if (!token) return;

    setLoading(true);

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/lessons/${lessonId}/progress`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ completed: !completed })
      }
    );

    if (response.ok) {
      onUpdate(!completed);
    }

    setLoading(false);
  };

  return (
    <button
      onClick={toggle}
      className={`rounded-full px-3 py-1 text-xs font-semibold ${
        completed
          ? "bg-gradient-to-br from-goldStart to-goldEnd text-black"
          : "border border-goldStart/40 text-platinum"
      }`}
    >
      {completed ? "Concluída" : "Marcar"}
    </button>
  );
};
