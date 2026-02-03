"use client";

import { useState } from "react";
import Link from "next/link";
import { AuthTokenBar } from "../../../components/AuthTokenBar";

type User = {
  id: string;
  name: string;
  email: string;
  role: string;
  points: number;
};

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [status, setStatus] = useState("");

  const loadUsers = async () => {
    const token = window.localStorage.getItem("bela_token");
    if (!token) {
      setStatus("token_required");
      return;
    }

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/users`, {
      headers: { Authorization: `Bearer ${token}` }
    });

    const data = await response.json();
    if (response.ok) {
      setUsers(data.users ?? []);
      setStatus("ok");
    } else {
      setStatus(data.error ?? "error");
    }
  };

  const updateRole = async (userId: string, role: string) => {
    const token = window.localStorage.getItem("bela_token");
    if (!token) {
      setStatus("token_required");
      return;
    }

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/admin/users/${userId}/role`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ role })
      }
    );

    const data = await response.json();
    setStatus(response.ok ? "role_atualizada" : data.error ?? "error");
    if (response.ok) {
      setUsers((prev) =>
        prev.map((user) => (user.id === userId ? { ...user, role } : user))
      );
    }
  };

  return (
    <div className="min-h-screen bg-piano px-10 py-10 space-y-8">
      <header className="flex items-center justify-between">
        <div>
          <p className="text-platinum text-sm">Bela Escala</p>
          <h1 className="text-2xl font-semibold">Admin • Usuários</h1>
        </div>
        <Link className="text-platinum text-sm" href="/admin">
          Voltar
        </Link>
      </header>

      <AuthTokenBar />

      <div className="glass rounded-xl2 p-6 space-y-4">
        <button
          onClick={loadUsers}
          className="rounded-full bg-gradient-to-br from-goldStart to-goldEnd px-4 py-2 text-sm font-semibold text-black"
        >
          Carregar usuários
        </button>
        {users.length > 0 ? (
          <div className="space-y-3 text-sm text-platinum">
            {users.map((user) => (
              <div key={user.id} className="flex items-center justify-between">
                <div>
                  <p className="text-white">{user.name}</p>
                  <p>{user.email}</p>
                  <p>Pontos: {user.points}</p>
                </div>
                <select
                  value={user.role}
                  onChange={(event) => updateRole(user.id, event.target.value)}
                  className="rounded-full border border-white/10 bg-transparent px-3 py-2 text-white"
                >
                  <option value="ADMIN">ADMIN</option>
                  <option value="MENTOR">MENTOR</option>
                  <option value="PREMIUM">PREMIUM</option>
                  <option value="FREE">FREE</option>
                </select>
              </div>
            ))}
          </div>
        ) : null}
        {status ? <p className="text-xs text-platinum">{status}</p> : null}
      </div>
    </div>
  );
}
