interface Props {
  tag: "new" | "bestseller" | "low_stock" | "featured";
}

const config: Record<Props["tag"], { label: string; classes: string }> = {
  new:        { label: "Nuevo",         classes: "bg-terra-500 text-cream-100" },
  bestseller: { label: "Más vendido",   classes: "bg-gold text-terra-800" },
  low_stock:  { label: "Último stock",  classes: "bg-amber-500 text-white" },
  featured:   { label: "Destacado",     classes: "bg-terra-700 text-cream-100" },
};

export default function TagBadge({ tag }: Props) {
  const { label, classes } = config[tag];
  return (
    <span className={`font-sans text-[9px] font-semibold tracking-[0.12em] uppercase px-2.5 py-1 rounded-full ${classes}`}>
      {label}
    </span>
  );
}
