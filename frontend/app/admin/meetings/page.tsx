"use client";

import { useState } from "react";
import Link from "next/link";
import { AuthTokenBar } from "../../../components/AuthTokenBar";

type Meeting = {
  id: string;
  status: string;
  jitsiRoomId: string;
  scheduledAt?: string;
  user?: { name: string; email: string };
  mentor?: { name: string; email: string } | null;
};

export default function AdminMeetingsPage() {
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [status, setStatus] = useState("");

  const loadMeetings = async () => {
    const token = window.localStorage.getItem("bela_token");
    if (!token) {
      setStatus("token_required");
      return;
    }

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/meetings`, {
      headers: { Authorization: `Bearer ${token}` }
    });

    const data = await response.json();
    if (response.ok) {
      setMeetings(data.meetings ?? []);
      setStatus("ok");
    } else {
      setStatus(data.error ?? "error");
    }
  };

  return (
    <div className="min-h-screen bg-piano px-10 py-10 space-y-8">
      <header className="flex items-center justify-between">
        <div>
          <p className="text-platinum text-sm">Bela Escala</p>
          <h1 className="text-2xl font-semibold">Admin • Meetings</h1>
        </div>
        <Link className="text-platinum text-sm" href="/admin">
          Voltar
        </Link>
      </header>

      <AuthTokenBar />

      <div className="glass rounded-xl2 p-6 space-y-4">
        <button
          onClick={loadMeetings}
          className="rounded-full bg-gradient-to-br from-goldStart to-goldEnd px-4 py-2 text-sm font-semibold text-black"
        >
          Carregar meetings
        </button>
        {meetings.length > 0 ? (
          <div className="space-y-3 text-sm text-platinum">
            {meetings.map((meeting) => (
              <div key={meeting.id} className="flex items-center justify-between">
                <div>
                  <p className="text-white">{meeting.jitsiRoomId}</p>
                  <p>Status: {meeting.status}</p>
                  <p>
                    {meeting.user?.name} • {meeting.user?.email}
                  </p>
                  <p>
                    Mentor: {meeting.mentor?.name ?? "-"}
                  </p>
                </div>
                <p className="text-xs text-platinum">
                  {meeting.scheduledAt ? new Date(meeting.scheduledAt).toLocaleString() : "-"}
                </p>
              </div>
            ))}
          </div>
        ) : null}
        {status ? <p className="text-xs text-platinum">{status}</p> : null}
      </div>
    </div>
  );
}
