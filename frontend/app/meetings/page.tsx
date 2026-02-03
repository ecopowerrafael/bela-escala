"use client";

import { useState } from "react";
import Link from "next/link";
import { AuthTokenBar } from "../../components/AuthTokenBar";

type Meeting = {
  id: string;
  status: string;
  jitsiRoomId: string;
  scheduledAt?: string;
};

export default function MeetingsPage() {
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [jitsiRoomId, setJitsiRoomId] = useState("");
  const [scheduledAt, setScheduledAt] = useState("");
  const [status, setStatus] = useState("");

  const loadMeetings = async () => {
    const token = window.localStorage.getItem("bela_token");
    if (!token) {
      setStatus("token_required");
      return;
    }

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/me/meetings`, {
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

  const createMeeting = async () => {
    const token = window.localStorage.getItem("bela_token");
    if (!token) {
      setStatus("token_required");
      return;
    }

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/meetings`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({
        jitsiRoomId,
        scheduledAt: scheduledAt || undefined
      })
    });

    const data = await response.json();
    setStatus(response.ok ? "meeting_criado" : data.error ?? "error");
  };

  return (
    <div className="min-h-screen bg-piano px-10 py-10 space-y-8">
      <header className="flex items-center justify-between">
        <div>
          <img src="/logo.png" alt="Bela Escala" className="h-6 w-auto mb-2" />
          <h1 className="text-2xl font-semibold">Meetings</h1>
        </div>
        <Link className="text-platinum text-sm" href="/">
          Voltar
        </Link>
      </header>

      <AuthTokenBar />

      <div className="glass rounded-xl2 p-6 space-y-4 max-w-xl">
        <h2 className="text-lg font-semibold">Criar meeting</h2>
        <input
          value={jitsiRoomId}
          onChange={(event) => setJitsiRoomId(event.target.value)}
          placeholder="Jitsi room id"
          className="w-full rounded-full border border-white/10 bg-transparent px-4 py-2 text-sm text-white focus:outline-none"
        />
        <input
          type="datetime-local"
          value={scheduledAt}
          onChange={(event) => setScheduledAt(event.target.value)}
          className="w-full rounded-full border border-white/10 bg-transparent px-4 py-2 text-sm text-white focus:outline-none"
        />
        <button
          onClick={createMeeting}
          className="rounded-full bg-gradient-to-br from-goldStart to-goldEnd px-4 py-2 text-sm font-semibold text-black"
        >
          Criar
        </button>
        {status ? <p className="text-xs text-platinum">{status}</p> : null}
      </div>

      <div className="glass rounded-xl2 p-6 space-y-4">
        <button
          onClick={loadMeetings}
          className="rounded-full bg-gradient-to-br from-goldStart to-goldEnd px-4 py-2 text-sm font-semibold text-black"
        >
          Carregar meus meetings
        </button>
        {meetings.length > 0 ? (
          <div className="space-y-3 text-sm text-platinum">
            {meetings.map((meeting) => (
              <div key={meeting.id}>
                <p className="text-white">{meeting.jitsiRoomId}</p>
                <p>Status: {meeting.status}</p>
                <p>
                  {meeting.scheduledAt
                    ? new Date(meeting.scheduledAt).toLocaleString()
                    : "Sem data"}
                </p>
              </div>
            ))}
          </div>
        ) : null}
      </div>
    </div>
  );
}
