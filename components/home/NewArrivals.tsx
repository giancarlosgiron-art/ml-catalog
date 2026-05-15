"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Product } from "@/lib/types";
import ProductCard from "@/components/catalog/ProductCard";
import QuickView from "@/components/catalog/QuickView";

interface Props {
  products: Product[];
}

export default function NewArrivals({ products }: Props) {
  const [quickView, setQuickView] = useState<Product | null>(null);

  if (!products.length) return null;

  return (
    <section id="nuevos" className="py-20 lg:py-28 px-6 bg-cream-100/50">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="flex flex-col sm:flex-row sm:items-end sm:justify-between mb-14 gap-4"
        >
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <span className="h-px w-8 bg-terra-400/40" />
              <span className="font-sans text-[10px] tracking-[0.35em] uppercase text-terra-400">
                Nuevos ingresos
              </span>
            </div>
            <h2 className="font-serif text-headline text-terra-800">
              Recién llegados
            </h2>
          </div>
          <Link
            href="/catalogo?sort=newest"
            className="group flex items-center gap-2 font-sans text-xs tracking-[0.15em] uppercase text-terra-500 hover:text-terra-600 transition-colors"
          >
            Ver todos
            <ArrowRight size={13} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </motion.div>

        {/* Featured big + grid */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* Big featured card */}
          {products[0] && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="lg:col-span-2"
            >
              <ProductCard
                product={products[0]}
                onQuickView={setQuickView}
                index={0}
              />
            </motion.div>
          )}

          {/* Smaller grid */}
          <div className="lg:col-span-3 grid grid-cols-2 sm:grid-cols-3 gap-4 lg:gap-6">
            {products.slice(1, 7).map((product, i) => (
              <ProductCard
                key={product.id}
                product={product}
                onQuickView={setQuickView}
                index={i + 1}
              />
            ))}
          </div>
        </div>
      </div>

      <QuickView product={quickView} onClose={() => setQuickView(null)} />
    </section>
  );
}
