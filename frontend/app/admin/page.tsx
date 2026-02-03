"use client";

import { useState } from "react";
import Link from "next/link";
import { AuthTokenBar } from "../../components/AuthTokenBar";

type Overview = {
  users: number;
  products: number;
  meetings: number;
  totalPoints: number;
};

export default function AdminPage() {
  const [overview, setOverview] = useState<Overview | null>(null);
  const [status, setStatus] = useState("");
  const [slug, setSlug] = useState("");
  const [name, setName] = useState("");
  const [priceCents, setPriceCents] = useState(19900);
  const [category, setCategory] = useState("Trilhas");

  const loadOverview = async () => {
    const token = window.localStorage.getItem("bela_token");
    if (!token) {
      setStatus("token_required");
      return;
    }

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/overview`, {
      headers: { Authorization: `Bearer ${token}` }
    });

    const data = await response.json();
    if (response.ok) {
      setOverview(data);
      setStatus("ok");
    } else {
      setStatus(data.error ?? "error");
    }
  };

  const createProduct = async () => {
    const token = window.localStorage.getItem("bela_token");
    if (!token) {
      setStatus("token_required");
      return;
    }

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/products`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ slug, name, priceCents, category })
    });

    const data = await response.json();
    setStatus(response.ok ? "produto_criado" : data.error ?? "error");
  };

  return (
    <div className="min-h-screen bg-piano px-10 py-10 space-y-8">
      <header className="flex items-center justify-between">
        <div>
          <p className="text-platinum text-sm">Bela Escala</p>
          <h1 className="text-2xl font-semibold">Admin Dashboard</h1>
        </div>
        <div className="flex gap-4 text-platinum text-sm">
          <Link href="/admin/users">Usuários</Link>
          <Link href="/admin/meetings">Meetings</Link>
          <Link href="/admin/courses">Trilhas</Link>
          <Link href="/admin/invoices">Invoices</Link>
          <Link href="/">Voltar</Link>
        </div>
      </header>

      <AuthTokenBar />

      <div className="glass rounded-xl2 p-6 space-y-4 max-w-xl">
        <h2 className="text-lg font-semibold">Overview</h2>
        <button
          onClick={loadOverview}
          className="rounded-full bg-gradient-to-br from-goldStart to-goldEnd px-4 py-2 text-sm font-semibold text-black"
        >
          Carregar métricas
        </button>
        {overview ? (
          <div className="text-sm text-platinum space-y-1">
            <p>Usuários: {overview.users}</p>
            <p>Produtos: {overview.products}</p>
            <p>Meetings: {overview.meetings}</p>
            <p>Pontos totais: {overview.totalPoints}</p>
          </div>
        ) : null}
      </div>

      <div className="glass rounded-xl2 p-6 space-y-4 max-w-xl">
        <h2 className="text-lg font-semibold">Novo produto</h2>
        <input
          value={slug}
          onChange={(event) => setSlug(event.target.value)}
          placeholder="slug"
          className="w-full rounded-full border border-white/10 bg-transparent px-4 py-2 text-sm text-white focus:outline-none"
        />
        <input
          value={name}
          onChange={(event) => setName(event.target.value)}
          placeholder="nome"
          className="w-full rounded-full border border-white/10 bg-transparent px-4 py-2 text-sm text-white focus:outline-none"
        />
        <input
          type="number"
          value={priceCents}
          onChange={(event) => setPriceCents(Number(event.target.value))}
          placeholder="preço em centavos"
          className="w-full rounded-full border border-white/10 bg-transparent px-4 py-2 text-sm text-white focus:outline-none"
        />
        <input
          value={category}
          onChange={(event) => setCategory(event.target.value)}
          placeholder="categoria"
          className="w-full rounded-full border border-white/10 bg-transparent px-4 py-2 text-sm text-white focus:outline-none"
        />
        <button
          onClick={createProduct}
          className="rounded-full bg-gradient-to-br from-goldStart to-goldEnd px-4 py-2 text-sm font-semibold text-black"
        >
          Criar produto
        </button>
        {status ? <p className="text-xs text-platinum">{status}</p> : null}
      </div>
    </div>
  );
}
