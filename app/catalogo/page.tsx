"use client";

import { useState, useEffect, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { fetchProducts, fetchCategories } from "@/lib/api";
import { Product, Category, ProductFilters } from "@/lib/types";
import ProductFiltersBar from "@/components/catalog/ProductFilters";
import ProductGrid from "@/components/catalog/ProductGrid";

const defaultFilters: ProductFilters = {
  search: "",
  category: "",
  status: "",
  sort: "newest",
  country: "",
};

export default function CatalogoPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<ProductFilters>({
    ...defaultFilters,
    search: searchParams.get("search") || "",
    sort: (searchParams.get("sort") as ProductFilters["sort"]) || "newest",
  });

  // Load categories once
  useEffect(() => {
    fetchCategories().then(setCategories);
  }, []);

  // Load products whenever filters change
  const load = useCallback(async () => {
    setLoading(true);
    const data = await fetchProducts(filters);
    setProducts(data);
    setLoading(false);
  }, [filters]);

  useEffect(() => { load(); }, [load]);

  const handleFilterChange = (partial: Partial<ProductFilters>) => {
    setFilters((prev) => ({ ...prev, ...partial }));
  };

  return (
    <main className="min-h-screen pt-28 pb-20 px-6">
      <div className="max-w-7xl mx-auto space-y-10">

        {/* Page header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-2"
        >
          <div className="flex items-center gap-3">
            <span className="h-px w-8 bg-terra-400/40" />
            <span className="font-sans text-[10px] tracking-[0.35em] uppercase text-terra-400">
              Catálogo completo
            </span>
          </div>
          <h1 className="font-serif text-4xl lg:text-5xl text-terra-800">
            Todos los productos
          </h1>
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <ProductFiltersBar
            filters={filters}
            categories={categories}
            onChange={handleFilterChange}
            total={products.length}
          />
        </motion.div>

        {/* Grid */}
        <ProductGrid products={products} loading={loading} />
      </div>
    </main>
  );
}
