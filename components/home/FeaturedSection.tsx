"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import { Product } from "@/lib/types";
import ProductCard from "@/components/catalog/ProductCard";
import QuickView from "@/components/catalog/QuickView";

interface Props {
  products: Product[];
}

export default function FeaturedSection({ products }: Props) {
  const [quickView, setQuickView] = useState<Product | null>(null);

  if (!products.length) return null;

  return (
    <section id="destacados" className="py-20 lg:py-28 px-6">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16 space-y-4"
        >
          <div className="flex items-center justify-center gap-3">
            <Sparkles size={14} className="text-gold" />
            <span className="font-sans text-[10px] tracking-[0.35em] uppercase text-terra-400">
              Piezas destacadas
            </span>
            <Sparkles size={14} className="text-gold" />
          </div>
          <h2 className="font-serif text-headline text-terra-800">
            Selección especial
          </h2>
          <p className="font-sans text-sm text-terra-500/70 max-w-md mx-auto">
            Nuestras piezas más especiales, elegidas con cuidado para ti.
          </p>
        </motion.div>

        {/* Masonry-style grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6">
          {products.slice(0, 8).map((product, i) => (
            <div
              key={product.id}
              className={
                // Make first card span 2 rows on desktop for visual interest
                i === 0 ? "md:row-span-2" : ""
              }
            >
              <ProductCard
                product={product}
                onQuickView={setQuickView}
                index={i}
              />
            </div>
          ))}
        </div>

        {/* Divider quote */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="mt-20 text-center"
        >
          <p className="font-serif text-xl lg:text-2xl text-terra-600/50 italic max-w-xl mx-auto">
            "Cada pieza cuenta una historia, cada accesorio define un momento."
          </p>
          <p className="mt-3 font-script text-2xl text-terra-400/50">
            by maria lugo
          </p>
        </motion.div>
      </div>

      <QuickView product={quickView} onClose={() => setQuickView(null)} />
    </section>
  );
}
