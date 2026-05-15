"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Product } from "@/lib/types";
import ProductCard from "@/components/catalog/ProductCard";
import QuickView from "@/components/catalog/QuickView";

interface Props {
  products: Product[];
}

export default function BestSellers({ products }: Props) {
  const [quickView, setQuickView] = useState<Product | null>(null);

  if (!products.length) return null;

  return (
    <section id="bestsellers" className="py-20 lg:py-28 px-6">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-14 space-y-4"
        >
          <div className="flex items-center justify-center gap-4">
            <span className="h-px w-10 bg-gold" />
            <span className="font-sans text-[10px] tracking-[0.35em] uppercase text-terra-400">
              Más vendidos
            </span>
            <span className="h-px w-10 bg-gold" />
          </div>
          <h2 className="font-serif text-headline text-terra-800">
            Las favoritas de nuestras clientas
          </h2>
        </motion.div>

        {/* Horizontal scroll on mobile, grid on desktop */}
        <div className="flex gap-6 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-hide
          lg:grid lg:grid-cols-4 lg:overflow-visible lg:pb-0">
          {products.slice(0, 4).map((product, i) => (
            <div key={product.id} className="flex-shrink-0 w-64 snap-start lg:w-auto">
              <ProductCard
                product={{ ...product, is_bestseller: true }}
                onQuickView={setQuickView}
                index={i}
              />
            </div>
          ))}
        </div>
      </div>

      <QuickView product={quickView} onClose={() => setQuickView(null)} />
    </section>
  );
}
