import { StockStatus } from "@/lib/types";

interface Props {
  status: StockStatus;
  stock?: number;
  size?: "sm" | "md";
}

const config: Record<StockStatus, { label: string; classes: string; dot: string }> = {
  available:    { label: "Disponible",  classes: "bg-emerald-50 text-emerald-700 border-emerald-200", dot: "bg-emerald-500" },
  low_stock:    { label: "Poco stock",  classes: "bg-amber-50 text-amber-700 border-amber-200",      dot: "bg-amber-500" },
  out_of_stock: { label: "Agotado",    classes: "bg-rose-50 text-rose-600 border-rose-200",          dot: "bg-rose-500" },
};

export default function StockBadge({ status, stock, size = "sm" }: Props) {
  const { label, classes, dot } = config[status] ?? config.available;
  const text = size === "md"
    ? `${label}${stock !== undefined ? ` (${stock})` : ""}`
    : label;

  return (
    <span className={`inline-flex items-center gap-1.5 border rounded-full font-sans font-medium
      ${size === "sm" ? "text-[10px] px-2 py-0.5 tracking-wide" : "text-xs px-3 py-1"}
      ${classes}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${dot}`} />
      {text}
    </span>
  );
}
