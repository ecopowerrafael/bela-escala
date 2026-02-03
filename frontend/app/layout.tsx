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
      <body className="min-h-screen bg-piano text-white">
        {children}
      </body>
    </html>
  );
}
