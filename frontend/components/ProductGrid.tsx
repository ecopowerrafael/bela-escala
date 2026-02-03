"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type Product = {
  id: string;
  name: string;
  slug: string;
  priceCents: number;
  category?: string | null;
  isLocked?: boolean;
};

export const ProductGrid = ({ products }: { products: Product[] }) => {
  const [status, setStatus] = useState<Record<string, string>>({});
  const router = useRouter();

  const getStatusMessage = (code: string) => {
    switch (code) {
      case "token_required": return "Faça login para continuar";
      case "already_owned": return "Você já possui este item";
      case "error": return "Erro ao adicionar. Tente novamente.";
      default: return "";
    }
  };

  const addToCart = async (productId: string) => {
    const token = window.localStorage.getItem("bela_token");
    if (!token) {
      setStatus((prev) => ({ ...prev, [productId]: "token_required" }));
      return;
    }

    setStatus((prev) => ({ ...prev, [productId]: "loading" }));

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000"}/checkout`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
          },
          body: JSON.stringify({ productId })
        }
      );

      if (response.ok) {
        setStatus((prev) => ({ ...prev, [productId]: "success" }));
        setTimeout(() => router.push("/checkout"), 1000);
      } else {
        const data = await response.json();
        if (data.error?.includes("Already owned")) {
          setStatus((prev) => ({ ...prev, [productId]: "already_owned" }));
        } else {
          setStatus((prev) => ({ ...prev, [productId]: "error" }));
        }
      }
    } catch (err) {
      console.error(err);
      setStatus((prev) => ({ ...prev, [productId]: "error" }));
    }
  };

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      {products.map((product) => (
        <div key={product.id} className="glass rounded-xl2 p-5 space-y-4">
          <div>
            <h3 className="text-lg font-semibold">{product.name}</h3>
            {product.category ? (
              <span className="inline-flex rounded-full border border-goldStart/40 px-3 py-1 text-xs text-platinum mt-2">
                {product.category}
              </span>
            ) : null}
            <p className="text-platinum mt-2">
              R$ {(product.priceCents / 100).toFixed(2)}
            </p>
          </div>
          <button
            onClick={() => addToCart(product.id)}
            disabled={status[product.id] === "loading" || product.isLocked === false}
            className="w-full rounded-full bg-gradient-to-br from-goldStart to-goldEnd px-4 py-2 text-sm font-semibold text-black disabled:opacity-50 transition"
          >
            {status[product.id] === "already_owned"
              ? "Já Possui"
              : product.isLocked === false
              ? "Acesso liberado"
              : status[product.id] === "loading"
              ? "Adicionando..."
              : status[product.id] === "success"
              ? "Adicionado!"
              : "Adicionar ao Carrinho"}
          </button>
          
          {status[product.id] && getStatusMessage(status[product.id]) ? (
             <p className="text-xs text-red-400 text-center">{getStatusMessage(status[product.id])}</p>
          ) : null}
        </div>
      ))}
    </div>
  );
};
