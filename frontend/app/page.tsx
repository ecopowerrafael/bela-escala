"use client";

import Link from "next/link";

export default function WelcomePage() {
  return (
    <div className="min-h-screen font-sans flex flex-col items-center justify-center p-0 sm:p-4 overflow-x-hidden">
      
      {/* Background Gradient (Overlay suave para legibilidade) */}
      <div className="fixed inset-0 bg-gradient-to-b from-[#0e0e0e]/80 to-[#000000]/90 -z-10"></div>

      {/* Main Container - Responsive */}
      <div className="w-full max-w-md mx-auto flex flex-col items-center min-h-screen sm:min-h-[auto] sm:py-10 px-6 relative z-10 justify-between sm:justify-center">
             
             {/* Header Section */}
             <div className="flex flex-col items-center space-y-4 w-full mt-10 sm:mt-0 mb-8 sm:mb-10">
                {/* Logo Image */}
                <div className="relative group">
                    <div className="absolute -inset-2 bg-goldStart/20 blur-xl rounded-full opacity-50 group-hover:opacity-75 transition-opacity"></div>
                    <img src="/logo.png" alt="Bela Escala" className="h-16 w-auto relative drop-shadow-2xl hover:scale-110 transition-transform duration-300" />
                </div>
                
                {/* Curved Divider Line */}
                <div className="w-full max-w-[120px] h-[1px] bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent opacity-60"></div>
             </div>

             {/* Content Middle Section */}
             <div className="flex flex-col items-center w-full space-y-8 flex-1 justify-center sm:flex-none">
                {/* Welcome Message */}
                <div className="text-center space-y-2">
                    <h2 className="text-3xl sm:text-4xl font-light text-[#F5F5F5] leading-tight tracking-tight">
                    Seja bem-vindo<br/>ao <span className="font-semibold text-white dropdown-shadow">Bela Escala!</span>
                    </h2>
                </div>

                {/* Elevated Card */}
                <div className="w-full bg-[#141414] border border-[#D4AF37]/10 rounded-[2rem] p-5 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.5)] relative group cursor-pointer transition-all hover:-translate-y-1 hover:shadow-[0_20px_50px_-10px_rgba(0,0,0,0.7)] hover:border-[#D4AF37]/30">
                    {/* Glow Effect */}
                    <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent rounded-[2rem] opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
                    
                    <div className="space-y-5 relative">
                    <div className="space-y-1">
                        <h3 className="text-white text-lg font-medium leading-tight">Como usar a plataforma</h3>
                        <p className="text-platinum/50 text-xs font-light tracking-wide">Um passo a passo para você começar</p>
                    </div>

                    {/* Video Thumbnail */}
                    <div className="relative w-full aspect-[16/9] rounded-2xl overflow-hidden bg-gray-900 border border-white/5 shadow-inner group-hover:shadow-2xl transition-all">
                        {/* Image */}
                        <img 
                            src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=600&auto=format&fit=crop" 
                            alt="Preview" 
                            className="w-full h-full object-cover opacity-90 group-hover:scale-105 transition-transform duration-700 ease-out"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                        
                        {/* Play Button */}
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="h-14 w-14 rounded-full bg-[#D4AF37]/90 backdrop-blur-md flex items-center justify-center shadow-[0_0_20px_rgba(212,175,55,0.4)] pl-1 transition-all group-hover:scale-110 group-hover:bg-[#F2D47E]">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="#0A0A0A" xmlns="http://www.w3.org/2000/svg">
                                <path d="M8 5V19L19 12L8 5Z" />
                                </svg>
                            </div>
                        </div>
                    </div>

                    <p className="text-platinum/30 text-[10px] text-center uppercase tracking-[0.2em] font-medium">
                        Assista agora
                    </p>
                    </div>
                </div>
             </div>

             {/* Footer CTA Section */}
             <div className="w-full mt-8 mb-6 sm:mb-0">
               <Link href="/login" className="group relative block w-full">
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-[#D4AF37] to-[#F2D47E] rounded-full blur opacity-50 group-hover:opacity-100 transition duration-500 animate-pulse"></div>
                  <div className="relative flex items-center justify-center rounded-full bg-gradient-to-br from-[#D4AF37] to-[#C5A028] py-4 px-6 shadow-xl transition-all active:scale-95 group-hover:brightness-110">
                    <span className="text-[#050505] font-bold text-sm tracking-widest uppercase">Vamos lá</span>
                  </div>
               </Link>
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