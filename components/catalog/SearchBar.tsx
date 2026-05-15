"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Search, X } from "lucide-react";

interface Props {
  autoFocus?: boolean;
  onClose?: () => void;
  defaultValue?: string;
  onSearch?: (query: string) => void;
}

export default function SearchBar({ autoFocus, onClose, defaultValue = "", onSearch }: Props) {
  const [value, setValue] = useState(defaultValue);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  useEffect(() => {
    if (autoFocus) setTimeout(() => inputRef.current?.focus(), 50);
  }, [autoFocus]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!value.trim()) return;
    if (onSearch) {
      onSearch(value.trim());
      onClose?.();
    } else {
      router.push(`/catalogo?search=${encodeURIComponent(value.trim())}`);
      onClose?.();
    }
  };

  const clear = () => {
    setValue("");
    if (onSearch) onSearch("");
    inputRef.current?.focus();
  };

  return (
    <form onSubmit={handleSubmit} className="relative">
      <div className="flex items-center gap-3 bg-white rounded-full px-5 py-3 shadow-soft border border-terra-200/30">
        <Search size={16} className="text-terra-400 flex-shrink-0" strokeWidth={1.5} />
        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Buscar productos, categorías…"
          className="flex-1 bg-transparent font-sans text-sm text-terra-700 placeholder-terra-300 outline-none"
        />
        {value && (
          <button
            type="button"
            onClick={clear}
            className="p-0.5 text-terra-400 hover:text-terra-600 transition-colors"
          >
            <X size={14} strokeWidth={2} />
          </button>
        )}
      </div>
    </form>
  );
}
