type Estado = "Pendiente" | "En proceso" | "Resuelto";

interface StatusBadgeProps {
  estado: Estado | string;
}

const config: Record<string, { className: string; dot: string; label: string }> = {
  Pendiente: {
    className: "badge-pendiente",
    dot: "bg-yellow-400",
    label: "Pendiente",
  },
  "En proceso": {
    className: "badge-en-proceso",
    dot: "bg-blue-400",
    label: "En proceso",
  },
  Resuelto: {
    className: "badge-resuelto",
    dot: "bg-green-400",
    label: "Resuelto",
  },
};

export default function StatusBadge({ estado }: StatusBadgeProps) {
  const cfg = config[estado] ?? {
    className: "badge-pendiente",
    dot: "bg-gray-400",
    label: estado,
  };

  return (
    <span className={cfg.className}>
      <span className={`inline-block h-1.5 w-1.5 rounded-full ${cfg.dot}`} />
      {cfg.label}
    </span>
  );
}
