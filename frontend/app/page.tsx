import Link from "next/link";
import { Rail } from "../components/Rail";
import { ChatWidget } from "../components/ChatWidget";
import { ProductGrid } from "../components/ProductGrid";

type HomeProduct = {
  id: string;
  slug: string;
  name: string;
  priceCents: number;
  category?: string | null;
  isLocked: boolean;
};

const fallbackRails = [
  {
    title: "Trilha: Estratégia de Marca",
    items: [
      { title: "Aula 01 — Fundamentos", subtitle: "20 min" },
      { title: "Aula 02 — Posicionamento", subtitle: "35 min" },
      { title: "Aula 03 — Proposta de Valor", subtitle: "40 min", locked: true }
    ]
  },
  {
    title: "Clube Premium",
    items: [
      { title: "Masterclass: Growth", subtitle: "Ao vivo" },
      { title: "Boardroom: Mentores", subtitle: "Network", locked: true },
      { title: "Sala VIP", subtitle: "Exclusivo", locked: true }
    ]
  }
];

const fetchHome = async () => {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  if (!apiUrl) return null;

  const demoUserId = process.env.NEXT_PUBLIC_DEMO_USER_ID;
  const url = demoUserId ? `${apiUrl}/home?userId=${demoUserId}` : `${apiUrl}/home`;

  try {
    const response = await fetch(url, { cache: "no-store" });
    if (!response.ok) return null;
    const data = (await response.json()) as { products?: HomeProduct[] };
    return data.products ?? null;
  } catch {
    return null;
  }
};

export default async function HomePage() {
  const products = await fetchHome();
  const productCards = products ?? [];
  const rails = products
    ? [
        {
          title: "Conteúdos disponíveis",
          items: products.map((product) => ({
            title: product.name,
            subtitle: product.slug,
            locked: product.isLocked
          }))
        }
      ]
    : fallbackRails;

  return (
    <div className="min-h-screen bg-piano">
      <header className="px-10 pt-10 flex items-center justify-between">
        <div>
          <p className="text-platinum text-sm">Bela Escala</p>
          <h1 className="text-3xl font-semibold">
            Mentoria <span className="gold-text">Premium</span>
          </h1>
        </div>
        <nav className="flex gap-6 text-sm text-platinum">
          <Link href="/">Home</Link>
          <Link href="/map">Mapa</Link>
          <Link href="/catalog">Catálogo</Link>
          <Link href="/courses">Trilhas</Link>
          <Link href="/meetings">Meetings</Link>
          <Link href="/checkout">Carrinho</Link>
          <Link href="/onboarding">Onboarding</Link>
          <Link href="/admin">Admin</Link>
          <button className="rounded-full bg-gradient-to-br from-goldStart to-goldEnd px-5 py-2 text-sm font-semibold text-black">
            Entrar
          </button>
        </nav>
      </header>

      <section className="px-10 py-12">
        <div className="relative overflow-hidden rounded-xl2 glass p-10">
          <div className="max-w-xl space-y-4">
            <p className="text-platinum text-sm">Netflix Original • Bela Escala</p>
            <h2 className="text-4xl font-semibold">
              Escale com mentores de elite
            </h2>
            <p className="text-platinum">
              Trilhas guiadas, reuniões estratégicas e comunidade privada em um
              ecossistema autônomo.
            </p>
            <div className="flex gap-4">
              <button className="rounded-full bg-gradient-to-br from-goldStart to-goldEnd px-6 py-3 text-sm font-semibold text-black">
                Começar agora
              </button>
              <button className="rounded-full border border-goldStart/60 px-6 py-3 text-sm text-platinum">
                Ver planos
              </button>
            </div>
          </div>
          <div className="absolute -right-10 -top-8 h-48 w-48 rounded-full bg-gradient-to-br from-goldStart to-goldEnd opacity-30 blur-3xl" />
        </div>
      </section>

      <main className="px-10 pb-16 space-y-10">
        {rails.map((rail) => (
          <Rail key={rail.title} title={rail.title} items={rail.items} />
        ))}
        {productCards.length > 0 ? <ProductGrid products={productCards} /> : null}
        <div className="flex justify-end">
          <ChatWidget />
        </div>
      </main>
    </div>
  );
}
