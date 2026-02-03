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
    <div className="min-h-screen bg-[#050505] text-white font-sans selection:bg-[#D4AF37] selection:text-black">
      {/* Background Ambience */}
      <div className="fixed inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#1a1a1a] via-[#050505] to-[#000000] z-0"></div>
      
      <div className="relative z-10 px-6 py-8 md:px-10 space-y-8 max-w-7xl mx-auto">
      
        {/* Header */}
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-white/10 pb-6">
          <div className="space-y-1">
             <Link href="/" className="inline-block">
                <span className="text-[#D4AF37] text-xs font-bold tracking-[0.2em] uppercase mb-1 block">Bela Escala</span>
             </Link>
            <h1 className="text-3xl md:text-4xl font-serif text-white tracking-tight" style={{ fontFamily: 'Playfair Display, serif' }}>
              Catálogo <span className="text-[#D4AF37] italic">Premium</span>
            </h1>
            <p className="text-white/50 text-sm max-w-md">Explore nossas trilhas, mentorias e acessos exclusivos.</p>
          </div>
          
           <Link 
             href="/" 
             className="text-xs font-bold uppercase tracking-widest text-white/50 hover:text-[#D4AF37] transition-colors flex items-center gap-2 group"
           >
             <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="group-hover:-translate-x-1 transition-transform">
               <path d="M19 12H5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
               <path d="M12 19L5 12L12 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
             </svg>
             Voltar ao Início
           </Link>
        </header>

        {/* Filters */}
        <div className="sticky top-4 z-50 backdrop-blur-xl bg-[#050505]/80 border border-white/10 rounded-2xl p-2 shadow-2xl flex flex-col md:flex-row gap-2">
            <div className="relative flex-1 group">
                 <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                    <svg className="w-4 h-4 text-white/30 group-focus-within:text-[#D4AF37] transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                 </div>
                 <input
                    value={query}
                    onChange={(event) => setQuery(event.target.value)}
                    placeholder="Buscar produtos ou mentorias..."
                    className="w-full bg-white/5 border border-transparent focus:border-[#D4AF37]/50 rounded-xl py-3 pl-10 pr-4 text-sm text-white placeholder:text-white/20 focus:outline-none focus:bg-white/10 transition-all font-light"
                  />
            </div>
            
             <select
                value={category}
                onChange={(event) => setCategory(event.target.value)}
                className="bg-white/5 border border-transparent focus:border-[#D4AF37]/50 rounded-xl px-4 py-3 text-sm text-white/80 focus:text-white focus:outline-none focus:bg-white/10 transition-all appearance-none cursor-pointer min-w-[150px]"
                style={{backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%23D4AF37' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`, backgroundPosition: `right 0.5rem center`, backgroundRepeat: `no-repeat`, backgroundSize: `1.5em 1.5em`, paddingRight: '2.5rem'}}
              >
                {categories.map((value) => (
                  <option key={value} value={value} className="bg-[#0A0A0A] text-white">
                    {value}
                  </option>
                ))}
            </select>
        </div>

        {status && (
           <div className="text-center py-4 bg-red-900/10 border border-red-500/20 rounded-xl">
              <p className="text-red-400 text-sm hidden">{status}</p>
              {/* Optional: Add user friendly error if needed, but status string is usually error code */}
           </div>
        )}

        {/* Content */}
        <div className="min-h-[400px]">
           <ProductGrid products={filtered} />
           
           {filtered.length === 0 && !status && (
              <div className="flex flex-col items-center justify-center py-20 text-center space-y-4">
                 <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center">
                    <svg className="w-8 h-8 text-white/20" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path></svg>
                 </div>
                 <p className="text-white/30 text-lg">Nenhum produto encontrado.</p>
                 <button onClick={() => {setQuery(''); setCategory('Todas');}} className="text-[#D4AF37] hover:underline text-sm font-medium tracking-wide">Limpar filtros</button>
              </div>
           )}
        </div>

      </div>
    </div>
  );
}
