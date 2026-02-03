type RailItem = {
  title: string;
  subtitle: string;
  locked?: boolean;
};

export const Rail = ({ title, items }: { title: string; items: RailItem[] }) => {
  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-white">{title}</h2>
        <button className="text-sm text-platinum">Ver tudo</button>
      </div>
      <div className="flex gap-6 overflow-x-auto pb-4">
        {items.map((item) => (
          <div
            key={item.title}
            className="relative min-w-[240px] rounded-xl2 p-5 glass"
          >
            <div className="space-y-2">
              <p className="text-sm text-platinum">{item.subtitle}</p>
              <h3 className="text-lg font-semibold">{item.title}</h3>
            </div>
            {item.locked ? (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 rounded-xl2 lock-overlay">
                <div className="h-12 w-12 rounded-full bg-gradient-to-br from-goldStart to-goldEnd shadow-glow flex items-center justify-center">
                  <span className="text-black text-xl">🔒</span>
                </div>
                <button className="rounded-full bg-gradient-to-br from-goldStart to-goldEnd px-4 py-2 text-sm font-semibold text-black">
                  Desbloquear
                </button>
              </div>
            ) : null}
          </div>
        ))}
      </div>
    </section>
  );
};
