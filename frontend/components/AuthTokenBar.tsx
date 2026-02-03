"use client";

import { useEffect, useState } from "react";

export const AuthTokenBar = () => {
  const [token, setToken] = useState("");

  useEffect(() => {
    const stored = window.localStorage.getItem("bela_token") ?? "";
    setToken(stored);
  }, []);

  const saveToken = () => {
    window.localStorage.setItem("bela_token", token);
  };

  return (
    <div className="glass rounded-xl2 p-4 space-y-3">
      <p className="text-sm text-platinum">Token de acesso (JWT)</p>
      <input
        value={token}
        onChange={(event) => setToken(event.target.value)}
        placeholder="Cole seu JWT aqui"
        className="w-full rounded-full border border-white/10 bg-transparent px-4 py-2 text-sm text-white focus:outline-none"
      />
      <button
        onClick={saveToken}
        className="rounded-full bg-gradient-to-br from-goldStart to-goldEnd px-4 py-2 text-sm font-semibold text-black"
      >
        Salvar token
      </button>
    </div>
  );
};
