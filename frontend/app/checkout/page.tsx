"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface Invoice {
  id: string;
  invoiceNumber: string;
  amountCents: number;
  status: "PENDENTE" | "PAGA" | "CANCELADA";
  createdAt: string;
  product: { name: string; slug: string };
}

export default function CheckoutPage() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState("");

  const router = useRouter();

  useEffect(() => {
    const stored = localStorage.getItem("bela_token");
    if (stored) {
      setToken(stored);
      fetchInvoices(stored);
    } else {
      setLoading(false);
    }
  }, []);

  const fetchInvoices = async (jwt: string) => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000"}/me/invoices`,
        { headers: { authorization: `Bearer ${jwt}` } }
      );
      if (res.ok) {
        const data = await res.json();
        setInvoices(data.invoices);
      }
    } finally {
      setLoading(false);
    }
  };

  const confirmPayment = async (invoiceId: string) => {
    if (!token) return;
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000"}/checkout/${invoiceId}/confirm`,
        {
          method: "POST",
          headers: { authorization: `Bearer ${token}` }
        }
      );
      if (res.ok) {
        const data = await res.json();
        setInvoices((prev) =>
          prev.map((inv) => (inv.id === invoiceId ? { ...inv, status: "PAGA" as const } : inv))
        );
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (!token) {
    return (
      <main className="min-h-screen bg-piano pt-20 px-4">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-3xl font-bold text-white mb-4">Checkout</h1>
          <div className="glass rounded-xl p-6">
            <p className="text-platinum mb-4">Faça login para acessar seu carrinho.</p>
            <Link href="/auth" className="bg-gradient-to-r from-gold to-gold-light text-piano px-4 py-2 rounded">
              Login
            </Link>
          </div>
        </div>
      </main>
    );
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-piano pt-20 px-4">
        <p className="text-platinum">Carregando...</p>
      </main>
    );
  }

  const totalPending = invoices
    .filter((inv) => inv.status === "PENDENTE")
    .reduce((sum, inv) => sum + inv.amountCents, 0) / 100;

  const totalPaid = invoices
    .filter((inv) => inv.status === "PAGA")
    .reduce((sum, inv) => sum + inv.amountCents, 0) / 100;

  return (
    <main className="min-h-screen bg-piano pt-20 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold gold-text mb-8">Carrinho & Pedidos</h1>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <div className="glass rounded-xl p-6">
            <p className="text-platinum text-sm">Pendente de Pagamento</p>
            <p className="text-4xl font-bold gold-text">R$ {totalPending.toFixed(2)}</p>
          </div>
          <div className="glass rounded-xl p-6">
            <p className="text-platinum text-sm">Já Pagos</p>
            <p className="text-4xl font-bold text-green-400">R$ {totalPaid.toFixed(2)}</p>
          </div>
        </div>

        {/* Invoices Table */}
        <div className="glass rounded-xl p-6 overflow-x-auto">
          <h2 className="text-2xl font-bold text-white mb-4">Seus Pedidos</h2>
          {invoices.length === 0 ? (
            <p className="text-platinum">Nenhum pedido realizado ainda.</p>
          ) : (
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-gold border-opacity-30">
                  <th className="pb-3 text-gold">Invoice</th>
                  <th className="pb-3 text-gold">Produto</th>
                  <th className="pb-3 text-gold">Valor</th>
                  <th className="pb-3 text-gold">Status</th>
                  <th className="pb-3 text-gold">Data</th>
                  <th className="pb-3 text-gold">Ação</th>
                </tr>
              </thead>
              <tbody>
                {invoices.map((invoice) => (
                  <tr key={invoice.id} className="border-b border-white border-opacity-10 hover:bg-white hover:bg-opacity-5">
                    <td className="py-4 text-white">{invoice.invoiceNumber}</td>
                    <td className="py-4 text-white">{invoice.product.name}</td>
                    <td className="py-4 text-white">R$ {(invoice.amountCents / 100).toFixed(2)}</td>
                    <td className="py-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-bold ${
                          invoice.status === "PAGA"
                            ? "bg-green-900 text-green-300"
                            : invoice.status === "PENDENTE"
                            ? "bg-yellow-900 text-yellow-300"
                            : "bg-red-900 text-red-300"
                        }`}
                      >
                        {invoice.status}
                      </span>
                    </td>
                    <td className="py-4 text-platinum text-xs">{new Date(invoice.createdAt).toLocaleDateString("pt-BR")}</td>
                    <td className="py-4">
                      {invoice.status === "PENDENTE" ? (
                        <button
                          onClick={() => confirmPayment(invoice.id)}
                          className="bg-gold bg-opacity-80 hover:bg-opacity-100 text-piano px-3 py-1 rounded text-xs font-bold transition"
                        >
                          Confirmar Pagamento
                        </button>
                      ) : (
                        <span className="text-platinum text-xs">Pago</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Back to Catalog */}
        <div className="mt-8 text-center">
          <Link href="/catalog" className="text-gold hover:text-gold-light transition">
            ← Voltar ao Catálogo
          </Link>
        </div>
      </div>
    </main>
  );
}
