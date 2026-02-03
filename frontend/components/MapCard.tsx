type MapCardProps = {
  name: string;
  role: string;
  city: string;
  socials: { label: string; color: string }[];
};

export const MapCard = ({ name, role, city, socials }: MapCardProps) => {
  return (
    <div className="glass rounded-xl2 p-5 space-y-4">
      <div>
        <p className="text-sm text-platinum">{role}</p>
        <h3 className="text-lg font-semibold">{name}</h3>
        <p className="text-xs text-platinum">{city}</p>
      </div>
      <div className="flex gap-2">
        {socials.map((social) => (
          <span
            key={social.label}
            className="rounded-full px-3 py-1 text-xs font-semibold"
            style={{ backgroundColor: social.color }}
          >
            {social.label}
          </span>
        ))}
      </div>
      <button className="w-full rounded-full bg-gradient-to-br from-goldStart to-goldEnd px-4 py-2 text-sm font-semibold text-black">
        Agendar Reunião
      </button>
    </div>
  );
};
