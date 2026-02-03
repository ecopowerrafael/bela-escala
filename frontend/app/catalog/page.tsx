"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { ProductGrid } from "../../components/ProductGrid";

type Product = {
  id: string;
  name: string;
  slug: string;
  priceCents: number;
  category?: string | null;
};

export default function CatalogPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [status, setStatus] = useState("");
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("Todas");

  useEffect(() => {
    const load = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products`);
        const data = await response.json();
        setProducts(data.products ?? []);
      } catch {
        setStatus("erro_ao_carregar");
      }
    };

    load();
  }, []);

  const categories = useMemo(() => {
    const values = new Set(products.map((product) => product.category).filter(Boolean));
    return ["Todas", ...Array.from(values)] as string[];
  }, [products]);

  const filtered = useMemo(() => {
    return products.filter((product) => {
      const matchesCategory =
        category === "Todas" || product.category === category;
      const matchesQuery =
        product.name.toLowerCase().includes(query.toLowerCase()) ||
        product.slug.toLowerCase().includes(query.toLowerCase());
      return matchesCategory && matchesQuery;
    });
  }, [products, category, query]);

  return (
    <div className="min-h-screen bg-piano px-10 py-10 space-y-8">
      <header className="flex items-center justify-between">
        <div>
          <p className="text-platinum text-sm">Bela Escala</p>
          <h1 className="text-2xl font-semibold">Catálogo</h1>
        </div>
        <Link className="text-platinum text-sm" href="/">
          Voltar
        </Link>
      </header>

      <div className="glass rounded-xl2 p-6 space-y-4">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center">
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Buscar por nome ou slug"
            className="flex-1 rounded-full border border-white/10 bg-transparent px-4 py-2 text-sm text-white focus:outline-none"
          />
          <select
            value={category}
            onChange={(event) => setCategory(event.target.value)}
            className="rounded-full border border-white/10 bg-transparent px-4 py-2 text-sm text-white"
          >
            {categories.map((value) => (
              <option key={value} value={value}>
                {value}
              </option>
            ))}
          </select>
        </div>
        {status ? <p className="text-xs text-platinum">{status}</p> : null}
      </div>

      <ProductGrid products={filtered} />
    </div>
  );
}
