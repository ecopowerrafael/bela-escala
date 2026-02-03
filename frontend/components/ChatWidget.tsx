"use client";

import { useState } from "react";

type ChatMessage = {
  role: "user" | "assistant";
  content: string;
};

export const ChatWidget = () => {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!input.trim() || loading) return;

    const nextMessages = [...messages, { role: "user", content: input.trim() }];
    setMessages(nextMessages);
    setInput("");
    setLoading(true);

    try {
      const token = window.localStorage.getItem("bela_token");
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        },
        body: JSON.stringify({ message: input.trim() })
      });

      const data = await response.json();
      const answer = data.answer ?? "Sem resposta";

      setMessages([...nextMessages, { role: "assistant", content: answer }]);
    } catch {
      setMessages([...nextMessages, { role: "assistant", content: "Erro ao conectar." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="glass rounded-xl2 p-4 w-full max-w-sm space-y-4">
      <div>
        <p className="text-sm text-platinum">Agente Bela Escala</p>
        <h3 className="text-lg font-semibold">Suporte inteligente</h3>
      </div>
      <div className="space-y-3 max-h-52 overflow-y-auto pr-2">
        {messages.length === 0 ? (
          <p className="text-sm text-platinum">Pergunte sobre conteúdos e trilhas.</p>
        ) : (
          messages.map((message, index) => (
            <div
              key={`${message.role}-${index}`}
              className={
                message.role === "user"
                  ? "text-sm text-white"
                  : "text-sm text-platinum"
              }
            >
              {message.content}
            </div>
          ))
        )}
      </div>
      <div className="flex gap-2">
        <input
          value={input}
          onChange={(event) => setInput(event.target.value)}
          placeholder="Digite sua pergunta"
          className="flex-1 rounded-full border border-white/10 bg-transparent px-4 py-2 text-sm text-white focus:outline-none"
        />
        <button
          onClick={sendMessage}
          className="rounded-full bg-gradient-to-br from-goldStart to-goldEnd px-4 py-2 text-sm font-semibold text-black"
        >
          Enviar
        </button>
      </div>
    </div>
  );
};
