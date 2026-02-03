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
    <div className="min-h-screen bg-[#050505] flex items-center justify-center p-4 sm:p-8 font-sans overflow-hidden">
      {/* Phone Mockup Frame - Consistente com a Home */}
      <div className="relative w-full max-w-[380px] h-[800px] bg-[#0A0A0A] rounded-[3rem] border-8 border-[#1a1a1a] shadow-[0_0_50px_rgba(0,0,0,0.8)] overflow-hidden flex flex-col ring-1 ring-white/10">
        
        {/* Dynamic Island */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 h-7 w-32 bg-black rounded-b-2xl z-20 pointer-events-none border-b border-l border-r border-[#222]"></div>

        {/* Screen Content */}
        <div className="flex-1 overflow-y-auto no-scrollbar bg-gradient-to-b from-[#111111] via-[#0a0a0a] to-[#000000] relative flex flex-col px-8 py-12">
            
            {/* Vignette & Texture */}
            <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.8)_100%)]"></div>
            
            {/* Header */}
            <div className="mt-8 mb-10 flex flex-col items-center z-10 text-center space-y-2">
                <div className="mb-2">
                   {/* Logo Stylized */}
                   <h1 className="text-3xl font-serif tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-[#D4AF37] to-[#F2D47E] drop-shadow-sm" style={{ fontFamily: 'Playfair Display, serif' }}>
                      <span className="italic mr-1 text-4xl">B</span>ela Escala
                   </h1>
                </div>
                <h2 className="text-white/90 font-light text-lg">Bem-vindo de volta!</h2>
            </div>

            {/* Login Form */}
            <form onSubmit={handleLogin} className="space-y-4 z-10 w-full flex-1">
                
                {/* Email Input */}
                <div className="relative group">
                    <input 
                      type="email" 
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="E-mail"
                      className="w-full bg-white/5 border border-[#D4AF37]/30 rounded-xl px-4 py-4 text-white placeholder:text-white/30 focus:outline-none focus:border-[#D4AF37] focus:bg-white/10 transition-all text-sm pl-11"
                    />
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#D4AF37]/70">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M4 4H20C21.1 4 22 4.9 22 6V18C22 19.1 21.1 20 20 20H4C2.9 20 2 19.1 2 18V6C2 4.9 2.9 4 4 4Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                            <path d="M22 6L12 13L2 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                    </div>
                </div>

                {/* Password Input */}
                <div className="relative group">
                    <input 
                      type={showPassword ? "text" : "password"} 
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Senha"
                      className="w-full bg-white/5 border border-[#D4AF37]/30 rounded-xl px-4 py-4 text-white placeholder:text-white/30 focus:outline-none focus:border-[#D4AF37] focus:bg-white/10 transition-all text-sm pl-11"
                    />
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#D4AF37]/70">
                       <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                           <rect x="3" y="11" width="18" height="11" rx="2" ry="2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                           <path d="M7 11V7C7 4.23858 9.23858 2 12 2C14.7614 2 17 4.23858 17 7V11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                       </svg>
                    </div>
                    <button 
                       type="button"
                       onClick={() => setShowPassword(!showPassword)}
                       className="absolute right-4 top-1/2 -translate-y-1/2 text-[#D4AF37]/50 hover:text-[#D4AF37] transition-colors"
                    >
                        {showPassword ? (
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24M1 1l22 22"/></svg>
                        ) : (
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                        )}
                    </button>
                </div>

                {error && (
                    <div className="text-red-400 text-xs text-center bg-red-900/10 p-2 rounded-lg border border-red-500/20">
                    {error}
                    </div>
                )}

                {/* Primary CTA */}
                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-gradient-to-r from-[#D4AF37] to-[#C5A028] text-black font-semibold text-sm py-4 rounded-xl shadow-lg shadow-[#D4AF37]/10 hover:shadow-[#D4AF37]/30 hover:brightness-110 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed mt-4"
                >
                    {loading ? "Entrando..." : "Entrar"}
                </button>

                 {/* Secondary Links */}
                 <div className="flex flex-col items-center gap-4 mt-6">
                    <Link href="/register" className="text-white hover:text-[#D4AF37] text-sm font-medium transition-colors">
                        Criar conta
                    </Link>
                    <Link href="/forgot-password" opacity-60 className="text-platinum/60 hover:text-white text-xs transition-colors">
                        Esqueci minha senha
                    </Link>
                </div>

                 {/* Social Divider */}
                 <div className="relative flex py-6 items-center w-full">
                    <div className="flex-grow border-t border-white/10"></div>
                    <span className="flex-shrink-0 mx-4 text-white/30 text-[10px] uppercase tracking-widest">ou continue com</span>
                    <div className="flex-grow border-t border-white/10"></div>
                </div>

                {/* Social Buttons */}
                <div className="flex gap-3">
                    <button type="button" className="flex-1 bg-white rounded-xl py-3 flex items-center justify-center gap-2 hover:bg-gray-100 transition-colors active:scale-95">
                        <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="w-5 h-5"/>
                        <span className="text-black text-sm font-medium">Google</span>
                    </button>
                    <button type="button" className="flex-1 bg-white rounded-xl py-3 flex items-center justify-center gap-2 hover:bg-gray-100 transition-colors active:scale-95">
                        <svg className="w-5 h-5 text-black" viewBox="0 0 24 24" fill="currentColor">
                           <path d="M17.05 20.28c-.98.95-2.05.88-3.08.4-.35-.16-1.07-.16-1.42 0-1.03.48-2.1.55-3.08-.4-.98-.98-1.32-2.38-1.32-3.8 0-3 1.9-5.2 4.88-5.2 1.3 0 2.22.65 2.78.65.55 0 1.6-.65 2.98-.65 1.25 0 2.58.5 3.38 1.55-3 1.6-2.5 5.85.3 7-.53 1.15-1.2 2.25-2.02 3.05zm-3.6-13c-.2-1.95 1.5-3.5 3.25-3.5 0 1.9-1.9 3.55-3.25 3.5z"/>
                        </svg>
                        <span className="text-black text-sm font-medium">Apple</span>
                    </button>
                </div>

            </form>

            {/* Quick Demo Login (Dev/Demo Only) */}
            <div className="mt-8 text-center">
                 <p className="text-[10px] text-white/20 uppercase tracking-widest mb-2">Demo Access</p>
                 <div className="flex justify-center gap-3">
                    <button 
                       type="button"
                       onClick={() => {setEmail('cliente@belaescala.com'); setPassword('123456');}}
                       className="text-[10px] bg-white/5 border border-white/10 px-2 py-1 rounded text-white/50 hover:text-white"
                    >
                        Cliente
                    </button>
                    <button 
                       type="button"
                       onClick={() => {setEmail('admin@belaescala.com'); setPassword('123456');}}
                       className="text-[10px] bg-white/5 border border-white/10 px-2 py-1 rounded text-white/50 hover:text-white"
                    >
                        Admin
                    </button>
                 </div>
            </div>

        </div>
      </div>
      
       <style jsx global>{`
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
       `}</style>
    </div>
  );
}
