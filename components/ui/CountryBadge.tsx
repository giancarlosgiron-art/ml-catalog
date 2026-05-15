interface Props {
  country?: "chile" | "venezuela" | "both" | null;
  size?: "sm" | "md";
}

export default function CountryBadge({ country, size = "sm" }: Props) {
  if (!country) return null;

  const flags: Record<string, string> = {
    chile:     "🇨🇱",
    venezuela: "🇻🇪",
    both:      "🇨🇱 🇻🇪",
  };

  const labels: Record<string, string> = {
    chile:     "Chile",
    venezuela: "Venezuela",
    both:      "Chile · Venezuela",
  };

  return (
    <span className={`inline-flex items-center gap-1 font-sans text-terra-600/70
      ${size === "sm" ? "text-[10px]" : "text-xs"}`}
    >
      <span>{flags[country]}</span>
      <span>{labels[country]}</span>
    </span>
  );
}
