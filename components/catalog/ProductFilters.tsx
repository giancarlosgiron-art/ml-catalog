"use client";

import { motion } from "framer-motion";
import { SlidersHorizontal, X } from "lucide-react";
import { Category, ProductFilters as Filters } from "@/lib/types";
import SearchBar from "./SearchBar";

interface Props {
  filters: Filters;
  categories: Category[];
  onChange: (f: Partial<Filters>) => void;
  total: number;
}

const sortOptions = [
  { value: "newest",    label: "Más nuevos" },
  { value: "bestseller",label: "Más vendidos" },
  { value: "price_asc", label: "Precio: menor a mayor" },
  { value: "price_desc",label: "Precio: mayor a menor" },
  { value: "name",      label: "Nombre A-Z" },
] as const;

const statusOptions = [
  { value: "",            label: "Todo el stock" },
  { value: "available",   label: "Disponible" },
  { value: "low_stock",   label: "Poco stock" },
  { value: "out_of_stock",label: "Agotado" },
] as const;

const countryOptions = [
  { value: "",          label: "Todos los países" },
  { value: "chile",     label: "🇨🇱 Chile" },
  { value: "venezuela", label: "🇻🇪 Venezuela" },
  { value: "both",      label: "Ambos países" },
] as const;

function hasActiveFilters(f: Filters) {
  return !!(f.search || f.category || f.status || f.country);
}

export default function ProductFilters({ filters, categories, onChange, total }: Props) {
  const active = hasActiveFilters(filters);

  const clearAll = () =>
    onChange({ search: "", category: "", status: "", country: "", sort: filters.sort });

  return (
    <div className="space-y-5">
      {/* Search */}
      <SearchBar
        defaultValue={filters.search || ""}
        onSearch={(q) => onChange({ search: q })}
      />

      {/* Row: filters */}
      <motion.div
        layout
        className="flex flex-wrap items-center gap-3"
      >
        <SlidersHorizontal size={14} className="text-terra-400 flex-shrink-0" strokeWidth={1.5} />

        {/* Category pills */}
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => onChange({ category: "" })}
            className={`font-sans text-xs px-4 py-2 rounded-full border transition-all duration-300 ${
              !filters.category
                ? "bg-terra-500 text-cream-100 border-terra-500"
                : "bg-white text-terra-600 border-terra-200 hover:border-terra-400"
            }`}
          >
            Todos
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => onChange({ category: cat.id })}
              className={`font-sans text-xs px-4 py-2 rounded-full border transition-all duration-300 ${
                filters.category === cat.id
                  ? "bg-terra-500 text-cream-100 border-terra-500"
                  : "bg-white text-terra-600 border-terra-200 hover:border-terra-400"
              }`}
            >
              {cat.icon} {cat.name}
            </button>
          ))}
        </div>

        {/* Selects */}
        <select
          value={filters.status || ""}
          onChange={(e) => onChange({ status: e.target.value as Filters["status"] })}
          className="font-sans text-xs text-terra-700 bg-white border border-terra-200 rounded-full px-4 py-2 outline-none focus:border-terra-400 cursor-pointer"
        >
          {statusOptions.map((o) => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>

        <select
          value={filters.country || ""}
          onChange={(e) => onChange({ country: e.target.value as Filters["country"] })}
          className="font-sans text-xs text-terra-700 bg-white border border-terra-200 rounded-full px-4 py-2 outline-none focus:border-terra-400 cursor-pointer"
        >
          {countryOptions.map((o) => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>

        <select
          value={filters.sort || "newest"}
          onChange={(e) => onChange({ sort: e.target.value as Filters["sort"] })}
          className="font-sans text-xs text-terra-700 bg-white border border-terra-200 rounded-full px-4 py-2 outline-none focus:border-terra-400 cursor-pointer"
        >
          {sortOptions.map((o) => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>

        {active && (
          <button
            onClick={clearAll}
            className="flex items-center gap-1.5 font-sans text-xs text-terra-500 hover:text-terra-700 transition-colors underline-offset-2 hover:underline"
          >
            <X size={12} />
            Limpiar filtros
          </button>
        )}
      </motion.div>

      {/* Result count */}
      <p className="font-sans text-xs text-terra-400">
        {total} {total === 1 ? "producto" : "productos"} encontrados
      </p>
    </div>
  );
}
