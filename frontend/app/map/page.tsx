import Link from "next/link";
import { MapCard } from "../../components/MapCard";

type Member = {
  id?: string;
  name: string;
  role: string;
  city: string;
  socials: { label: string; color: string }[];
};

const fallbackMembers: Member[] = [
  {
    name: "Camila Rocha",
    role: "Mentora Growth",
    city: "São Paulo, BR",
    socials: [
      { label: "LinkedIn", color: "#0A66C2" },
      { label: "Instagram", color: "#E1306C" }
    ]
  },
  {
    name: "Eduardo Lima",
    role: "Founder Mentor",
    city: "Lisboa, PT",
    socials: [
      { label: "X", color: "#111111" },
      { label: "YouTube", color: "#FF0000" }
    ]
  }
];

const fetchMembers = async () => {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  if (!apiUrl) return null;

  try {
    const response = await fetch(`${apiUrl}/members`, { cache: "no-store" });
    if (!response.ok) return null;
    const data = (await response.json()) as { members?: Member[] };
    return data.members ?? null;
  } catch {
    return null;
  }
};

export default async function MapPage() {
  const members = (await fetchMembers()) ?? fallbackMembers;
  return (
    <div className="min-h-screen bg-piano px-10 py-10">
      <header className="flex items-center justify-between">
        <div>
          <p className="text-platinum text-sm">Bela Escala</p>
          <h1 className="text-2xl font-semibold">
            Mapa <span className="gold-text">Global</span>
          </h1>
        </div>
        <nav className="flex gap-6 text-sm text-platinum">
          <Link href="/">Home</Link>
          <Link href="/map">Mapa</Link>
        </nav>
      </header>

      <section className="mt-10 grid grid-cols-1 gap-8 lg:grid-cols-[2fr_1fr]">
        <div className="glass rounded-xl2 p-8 min-h-[420px] relative overflow-hidden">
          <p className="text-platinum text-sm">Mapa Mundi • Dark Mode</p>
          <h2 className="text-xl font-semibold mt-2">Conexões em tempo real</h2>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="h-64 w-96 rounded-full border border-goldStart/40 opacity-60" />
            <div className="absolute h-3 w-3 rounded-full bg-gradient-to-br from-goldStart to-goldEnd shadow-glow" style={{ top: "35%", left: "45%" }} />
            <div className="absolute h-3 w-3 rounded-full bg-gradient-to-br from-goldStart to-goldEnd shadow-glow" style={{ top: "55%", left: "62%" }} />
            <div className="absolute h-3 w-3 rounded-full bg-gradient-to-br from-goldStart to-goldEnd shadow-glow" style={{ top: "42%", left: "30%" }} />
          </div>
        </div>
        <div className="space-y-6">
          {members.map((member) => (
            <MapCard key={member.name} {...member} />
          ))}
        </div>
      </section>
    </div>
  );
}
