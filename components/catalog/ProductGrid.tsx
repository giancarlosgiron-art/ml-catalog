"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Product } from "@/lib/types";
import ProductCard from "./ProductCard";
import QuickView from "./QuickView";

interface Props {
  products: Product[];
  loading?: boolean;
}

function SkeletonCard() {
  return (
    <div className="bg-white rounded-3xl overflow-hidden shadow-card">
      <div className="aspect-[3/4] bg-cream-200 animate-shimmer bg-gradient-to-r from-cream-200 via-cream-100 to-cream-200 bg-[length:200%_100%]" />
      <div className="px-4 py-4 space-y-2.5">
        <div className="h-2.5 bg-cream-200 rounded-full w-1/3 animate-pulse" />
        <div className="h-3.5 bg-cream-200 rounded-full w-4/5 animate-pulse" />
        <div className="h-3 bg-cream-200 rounded-full w-2/5 animate-pulse" />
      </div>
    </div>
  );
}

export default function ProductGrid({ products, loading }: Props) {
  const [quickView, setQuickView] = useState<Product | null>(null);

  return (
    <>
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 lg:gap-6">
        {loading
          ? Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)
          : (
            <AnimatePresence mode="popLayout">
              {products.map((product, i) => (
                <motion.div
                  key={product.id}
                  layout
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.96 }}
                  transition={{ duration: 0.3, delay: i * 0.04 }}
                >
                  <ProductCard
                    product={product}
                    onQuickView={setQuickView}
                    index={i}
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          )
        }
      </div>

      {!loading && products.length === 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="col-span-full text-center py-24 space-y-4"
        >
          <p className="text-5xl">🔍</p>
          <h3 className="font-serif text-xl text-terra-700">Sin resultados</h3>
          <p className="font-sans text-sm text-terra-400">
            Intenta ajustar los filtros o busca otro término.
          </p>
        </motion.div>
      )}

      <QuickView product={quickView} onClose={() => setQuickView(null)} />
    </>
  );
}
