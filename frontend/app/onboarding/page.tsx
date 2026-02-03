"use client";

import { useState } from "react";
import Link from "next/link";
import { AuthTokenBar } from "../../components/AuthTokenBar";

export default function OnboardingPage() {
  const [headline, setHeadline] = useState("");
  const [city, setCity] = useState("");
  const [socials, setSocials] = useState("LinkedIn:#0A66C2,Instagram:#E1306C");
  const [status, setStatus] = useState("");

  const submit = async () => {
    const token = window.localStorage.getItem("bela_token");
    if (!token) {
      setStatus("token_required");
      return;
    }

    const payload = {
      headline,
      city,
      socials: socials
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean)
        .map((item) => {
          const [label, color] = item.split(":");
          return { label, color };
        })
    };

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/onboarding`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(payload)
    });

    const data = await response.json();
    setStatus(response.ok ? "ok" : data.error ?? "error");
  };

  return (
    <div className="min-h-screen bg-piano px-10 py-10 space-y-8">
      <header className="flex items-center justify-between">
        <div>
          <img src="/logo.png" alt="Bela Escala" className="h-6 w-auto mb-2" />
          <h1 className="text-2xl font-semibold">Onboarding</h1>
        </div>
        <Link className="text-platinum text-sm" href="/">
          Voltar
        </Link>
      </header>

      <AuthTokenBar />

      <div className="glass rounded-xl2 p-6 space-y-4 max-w-xl">
        <div>
          <label className="text-sm text-platinum">Headline</label>
          <input
            value={headline}
            onChange={(event) => setHeadline(event.target.value)}
            className="mt-2 w-full rounded-full border border-white/10 bg-transparent px-4 py-2 text-sm text-white focus:outline-none"
          />
        </div>
        <div>
          <label className="text-sm text-platinum">Cidade</label>
          <input
            value={city}
            onChange={(event) => setCity(event.target.value)}
            className="mt-2 w-full rounded-full border border-white/10 bg-transparent px-4 py-2 text-sm text-white focus:outline-none"
          />
        </div>
        <div>
          <label className="text-sm text-platinum">Redes sociais</label>
          <input
            value={socials}
            onChange={(event) => setSocials(event.target.value)}
            className="mt-2 w-full rounded-full border border-white/10 bg-transparent px-4 py-2 text-sm text-white focus:outline-none"
          />
          <p className="text-xs text-platinum mt-1">Formato: Label:#cor</p>
        </div>
        <button
          onClick={submit}
          className="rounded-full bg-gradient-to-br from-goldStart to-goldEnd px-6 py-2 text-sm font-semibold text-black"
        >
          Salvar
        </button>
        {status ? <p className="text-xs text-platinum">{status}</p> : null}
      </div>
    </div>
  );
}
