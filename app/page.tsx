"use client";

import { useEffect, useState } from "react";
import { fetchProducts, fetchTopProducts } from "@/lib/api";
import { Product, TopProduct } from "@/lib/types";
import Hero from "@/components/home/Hero";
import BestSellers from "@/components/home/BestSellers";
import NewArrivals from "@/components/home/NewArrivals";
import FeaturedSection from "@/components/home/FeaturedSection";

function isNew(createdAt: string) {
  return (Date.now() - new Date(createdAt).getTime()) / 86_400_000 < 14;
}

export default function HomePage() {
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [topRaw, setTopRaw] = useState<TopProduct[]>([]);
  useEffect(() => {
    Promise.all([
      fetchProducts({ sort: "newest" }),
      fetchTopProducts(),
    ])
      .then(([products, top]) => {
        setAllProducts(products);
        setTopRaw(top);
      })
      .catch(console.error);
  }, []);

  const topIds = new Set(topRaw.map((p) => p.id));
  const bestsellers = allProducts.filter((p) => topIds.has(p.id)).slice(0, 4);
  const newArrivals = allProducts.filter((p) => isNew(p.created_at)).slice(0, 7);
  const featured = allProducts.filter(
    (p) => !topIds.has(p.id) && !isNew(p.created_at)
  );

  return (
    <>
      <Hero />
      <BestSellers products={bestsellers} />
      <NewArrivals products={newArrivals} />
      <FeaturedSection products={featured} />
    </>
  );
}
