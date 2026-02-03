"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface Invoice {
  id: string;
  invoiceNumber: string;
  status: "PENDENTE" | "PAGA" | "CANCELADA";
  amountCents: number;
  createdAt: string;
  user: { name: string; email: string };
  product: { name: string };
}

export default function AdminInvoicesPage() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [token, setToken] = useState("");

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
        `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000"}/admin/invoices`,
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

  const filtered = invoices.filter(
    (inv) => statusFilter === "ALL" || inv.status === statusFilter
  );

  const totalAmount = filtered.reduce((sum, inv) => sum + inv.amountCents, 0) / 100;

  if (!token) {
    return (
      <main className="min-h-screen bg-piano pt-20 px-4">
        <div className="max-w-2xl mx-auto">
          <p className="text-platinum mb-4">Faça login como administrador.</p>
          <Link href="/" className="text-gold">
            ← Home
          </Link>
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

  return (
    <main className="min-h-screen bg-piano pt-20 px-4 pb-12">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold gold-text">Gerenciar Invoices</h1>
          <Link href="/admin" className="text-gold hover:text-gold-light">
            ← Admin Home
          </Link>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="glass rounded-xl p-4">
            <p className="text-platinum text-xs">Total de Invoices</p>
            <p className="text-3xl font-bold gold-text">{invoices.length}</p>
          </div>
          <div className="glass rounded-xl p-4">
            <p className="text-platinum text-xs">Pendentes</p>
            <p className="text-3xl font-bold text-yellow-400">
              {invoices.filter((inv) => inv.status === "PENDENTE").length}
            </p>
          </div>
          <div className="glass rounded-xl p-4">
            <p className="text-platinum text-xs">Pagos</p>
            <p className="text-3xl font-bold text-green-400">
              {invoices.filter((inv) => inv.status === "PAGA").length}
            </p>
          </div>
          <div className="glass rounded-xl p-4">
            <p className="text-platinum text-xs">Valor Total (Filtrado)</p>
            <p className="text-3xl font-bold gold-text">R$ {totalAmount.toFixed(2)}</p>
          </div>
        </div>

        {/* Filters */}
        <div className="glass rounded-xl p-4 mb-6">
          <label className="block text-platinum text-sm mb-2">Filtrar por Status:</label>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="glass rounded-lg px-4 py-2 text-white border border-gold border-opacity-30 outline-none"
          >
            <option value="ALL">Todos</option>
            <option value="PENDENTE">Pendente</option>
            <option value="PAGA">Pago</option>
            <option value="CANCELADA">Cancelado</option>
          </select>
        </div>

        {/* Invoices Table */}
        <div className="glass rounded-xl p-6 overflow-x-auto">
          {filtered.length === 0 ? (
            <p className="text-platinum">Nenhuma invoice encontrada.</p>
          ) : (
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-gold border-opacity-30">
                  <th className="pb-3 text-gold">Invoice</th>
                  <th className="pb-3 text-gold">Cliente</th>
                  <th className="pb-3 text-gold">Email</th>
                  <th className="pb-3 text-gold">Produto</th>
                  <th className="pb-3 text-gold">Valor</th>
                  <th className="pb-3 text-gold">Status</th>
                  <th className="pb-3 text-gold">Data</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((invoice) => (
                  <tr
                    key={invoice.id}
                    className="border-b border-white border-opacity-10 hover:bg-white hover:bg-opacity-5"
                  >
                    <td className="py-4 text-white font-mono text-xs">{invoice.invoiceNumber}</td>
                    <td className="py-4 text-white">{invoice.user.name}</td>
                    <td className="py-4 text-platinum text-xs">{invoice.user.email}</td>
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
                    <td className="py-4 text-platinum text-xs">
                      {new Date(invoice.createdAt).toLocaleDateString("pt-BR")}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </main>
  );
}
