import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Bela Escala",
  description: "Mentoria e comunidade premium"
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body className="min-h-screen bg-[#050505] text-white">
        {/* Imagem de Fundo Global */}
        <div 
          className="fixed inset-0 z-[-1] opacity-30 pointer-events-none bg-cover bg-center bg-no-repeat bg-fixed mix-blend-overlay"
          style={{ backgroundImage: "url('/bg-premium.jpg')" }} 
        />
        {children}
      </body>
    </html>
  );
}
