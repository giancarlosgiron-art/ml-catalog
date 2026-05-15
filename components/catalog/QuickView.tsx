"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { X, ArrowRight, Package } from "lucide-react";
import { Product } from "@/lib/types";
import { imageUrl } from "@/lib/api";
import StockBadge from "@/components/ui/StockBadge";
import CountryBadge from "@/components/ui/CountryBadge";

interface Props {
  product: Product | null;
  onClose: () => void;
}

function formatCLP(price: number) {
  return new Intl.NumberFormat("es-CL", {
    style: "currency",
    currency: "CLP",
    maximumFractionDigits: 0,
  }).format(price);
}

function formatEUR(price: number) {
  return new Intl.NumberFormat("es-ES", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 2,
  }).format(price);
}

export default function QuickView({ product, onClose }: Props) {
  const [imgError, setImgError] = useState(false);

  useEffect(() => {
    setImgError(false);
  }, [product]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  useEffect(() => {
    if (product) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [product]);

  return (
    <AnimatePresence>
      {product && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-50 bg-terra-900/40 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Panel */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 16 }}
            transition={{ duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="fixed inset-x-4 top-1/2 -translate-y-1/2 z-50 max-w-2xl mx-auto bg-white rounded-4xl shadow-modal overflow-hidden"
            style={{ maxHeight: "90dvh" }}
          >
            <div className="grid sm:grid-cols-2 h-full">
              {/* Image */}
              <div className="relative aspect-square sm:aspect-auto min-h-[260px] bg-cream-100">
                {product.image && !imgError ? (
                  <Image
                    src={imageUrl(product.image)}
                    alt={product.name}
                    fill
                    className="object-cover"
                    onError={() => setImgError(true)}
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-7xl opacity-20">💍</span>
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="p-7 flex flex-col gap-4 overflow-y-auto">
                {/* Close */}
                <button
                  onClick={onClose}
                  className="absolute top-4 right-4 p-2 rounded-full bg-white/90 backdrop-blur-sm shadow-soft hover:scale-110 transition-transform"
                >
                  <X size={16} strokeWidth={1.5} className="text-terra-600" />
                </button>

                {product.category_name && (
                  <p className="font-sans text-[10px] tracking-[0.25em] uppercase text-terra-400">
                    {product.category_name}
                  </p>
                )}

                <h2 className="font-serif text-2xl text-terra-800 leading-snug">
                  {product.name}
                </h2>

                <div className="flex flex-wrap items-baseline gap-3">
                  {(product.country === "chile" || product.country === "both") && product.sale_price > 0 && (
                    <span className="font-serif text-3xl text-terra-600">
                      {formatCLP(product.sale_price)}
                    </span>
                  )}
                  {(product.country === "venezuela" || product.country === "both") && (product.price_eur ?? 0) > 0 && (
                    <span className="font-serif text-2xl text-terra-400">
                      {formatEUR(product.price_eur!)}
                    </span>
                  )}
                </div>

                {product.description && (
                  <p className="font-sans text-sm text-terra-600/70 leading-relaxed">
                    {product.description}
                  </p>
                )}

                {/* Specs */}
                <div className="grid grid-cols-2 gap-3">
                  {product.sku && (
                    <div className="bg-cream-100 rounded-2xl p-3">
                      <p className="font-sans text-[9px] tracking-widest uppercase text-terra-400 mb-1">SKU</p>
                      <p className="font-mono text-xs text-terra-700">{product.sku}</p>
                    </div>
                  )}
                  <div className="bg-cream-100 rounded-2xl p-3">
                    <p className="font-sans text-[9px] tracking-widest uppercase text-terra-400 mb-1">Stock</p>
                    <div className="flex items-center gap-1.5">
                      <Package size={12} className="text-terra-500" />
                      <span className="font-sans text-xs text-terra-700">{product.stock} unid.</span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 items-center">
                  <StockBadge status={product.status} size="md" />
                  <CountryBadge country={product.country} size="md" />
                </div>

                <Link
                  href={`/producto/${product.id}`}
                  className="mt-auto flex items-center justify-center gap-2 bg-terra-500 hover:bg-terra-600 text-cream-100 font-sans text-xs tracking-[0.15em] uppercase py-3.5 rounded-2xl transition-colors duration-300 group"
                >
                  Ver detalle completo
                  <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
