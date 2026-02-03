"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // Check if already logged in (simple client-side check)
  useEffect(() => {
    const token = typeof window !== 'undefined' ? window.localStorage.getItem("bela_token") : null;
    if (token) {
       router.push("/catalog"); // Or dashboard
    }
  }, [router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

    try {
      const res = await fetch(`${apiUrl}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });

      const data = await res.json();

      if (res.ok && data.token) {
        window.localStorage.setItem("bela_token", data.token);
        router.push("/catalog");
      } else {
        setError(data.error || "Credenciais inválidas.");
      }
    } catch (err) {
      console.error(err);
      setError("Erro de conexão. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] font-sans flex flex-col items-center justify-center p-0 sm:p-4 overflow-x-hidden w-full relative">
       {/* Background Gradient */}
       <div className="fixed inset-0 bg-gradient-to-b from-[#0e0e0e]/80 to-[#000000]/90 -z-10"></div>
       
       {/* Container Responsivo */}
       <div className="w-full max-w-md mx-auto flex flex-col items-center px-6 py-10 z-10">
            
            {/* Header */}
            <div className="bg-black/20 backdrop-blur-xl border border-white/5 rounded-3xl p-8 w-full shadow-2xl relative overflow-hidden group">
                 {/* Glow Effect */}
                 <div className="absolute top-0 right-0 -mr-16 -mt-16 w-32 h-32 bg-[#D4AF37]/20 blur-3xl rounded-full pointer-events-none group-hover:bg-[#D4AF37]/30 transition-all duration-700"></div>

                 <div className="mb-10 text-center relative z-10">
                     <Link href="/" className="inline-block mb-4 hover:scale-105 transition-transform duration-300">
                        <h1 className="text-3xl font-serif tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-[#D4AF37] to-[#F2D47E] drop-shadow-sm" style={{ fontFamily: 'Playfair Display, serif' }}>
                           <span className="italic mr-1 text-4xl">B</span>ela Escala
                        </h1>
                     </Link>
                     <h2 className="text-white/60 font-light text-sm tracking-wide uppercase">Acesso à Plataforma</h2>
                 </div>

                {/* Login Form */}
                <form onSubmit={handleLogin} className="space-y-5 relative z-10">
                    
                    {/* Email Input */}
                    <div className="relative group/input">
                        <input 
                          type="email" 
                          required
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="E-mail"
                          className="w-full bg-[#0A0A0A] border border-[#333] rounded-xl px-4 py-4 text-white placeholder:text-white/30 focus:outline-none focus:border-[#D4AF37] focus:bg-[#111] transition-all text-sm pl-11 shadow-inner"
                        />
                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#666] group-focus-within/input:text-[#D4AF37] transition-colors">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M4 4H20C21.1 4 22 4.9 22 6V18C22 19.1 21.1 20 20 20H4C2.9 20 2 19.1 2 18V6C2 4.9 2.9 4 4 4Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                <path d="M22 6L12 13L2 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                        </div>
                    </div>

                    {/* Password Input */}
                    <div className="relative group/input">
                        <input 
                          type={showPassword ? "text" : "password"} 
                          required
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          placeholder="Senha"
                          className="w-full bg-[#0A0A0A] border border-[#333] rounded-xl px-4 py-4 text-white placeholder:text-white/30 focus:outline-none focus:border-[#D4AF37] focus:bg-[#111] transition-all text-sm pl-11 shadow-inner"
                        />
                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#666] group-focus-within/input:text-[#D4AF37] transition-colors">
                           <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                               <rect x="3" y="11" width="18" height="11" rx="2" ry="2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                               <path d="M7 11V7C7 4.23858 9.23858 2 12 2C14.7614 2 17 4.23858 17 7V11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                           </svg>
                        </div>
                        <button 
                           type="button"
                           onClick={() => setShowPassword(!showPassword)}
                           className="absolute right-4 top-1/2 -translate-y-1/2 text-[#666] hover:text-[#D4AF37] transition-colors"
                        >
                            {showPassword ? (
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24M1 1l22 22"/></svg>
                            ) : (
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                            )}
                        </button>
                    </div>

                    {error && (
                        <div className="text-red-400 text-xs text-center bg-red-900/10 p-3 rounded-xl border border-red-500/20 animate-pulse">
                        {error}
                        </div>
                    )}

                    {/* Primary CTA */}
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-gradient-to-r from-[#D4AF37] to-[#C5A028] text-black font-bold text-sm py-4 rounded-xl shadow-lg shadow-[#D4AF37]/10 hover:shadow-[#D4AF37]/30 hover:brightness-110 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed mt-2 tracking-wide uppercase"
                    >
                        {loading ? "Entrando..." : "Entrar"}
                    </button>

                     {/* Divider */}
                     <div className="relative flex py-4 items-center w-full">
                        <div className="flex-grow border-t border-white/5"></div>
                        <span className="flex-shrink-0 mx-4 text-white/20 text-[10px] uppercase tracking-widest">ou</span>
                        <div className="flex-grow border-t border-white/5"></div>
                    </div>

                    {/* Secondary Links */}
                    <div className="flex flex-col items-center gap-4">
                        <Link href="/register" className="w-full text-center py-3 rounded-xl border border-white/10 hover:border-[#D4AF37]/50 hover:bg-white/5 text-white/70 hover:text-white text-sm font-medium transition-all group-hover:border-white/20">
                            Criar nova conta
                        </Link>
                        <Link href="/forgot-password" opacity-60 className="text-platinum/40 hover:text-[#D4AF37] text-xs transition-colors">
                            Esqueci minha senha
                        </Link>
                    </div>
                </form>
            </div>
            
            {/* Quick Demo Login (Dev/Demo Only) */}
            <div className="mt-8 text-center opacity-30 hover:opacity-100 transition-opacity">
                 <div className="flex justify-center gap-3">
                    <button 
                       type="button"
                       onClick={() => {setEmail('cliente@belaescala.com'); setPassword('123456');}}
                       className="text-[10px] bg-white/5 border border-white/10 px-3 py-1 rounded-full text-white/50 hover:text-white transition-colors"
                    >
                        Demo Cliente
                    </button>
                    <button 
                       type="button"
                       onClick={() => {setEmail('admin@belaescala.com'); setPassword('123456');}}
                       className="text-[10px] bg-white/5 border border-white/10 px-3 py-1 rounded-full text-white/50 hover:text-white transition-colors"
                    >
                        Demo Admin
                    </button>
                 </div>
            </div>

       </div>
    </div>
  );
}