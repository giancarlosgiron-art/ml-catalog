import { fetchProducts, fetchTopProducts } from "@/lib/api";
import { Product } from "@/lib/types";
import Hero from "@/components/home/Hero";
import BestSellers from "@/components/home/BestSellers";
import NewArrivals from "@/components/home/NewArrivals";
import FeaturedSection from "@/components/home/FeaturedSection";

function isNew(createdAt: string) {
  return (Date.now() - new Date(createdAt).getTime()) / 86_400_000 < 14;
}

export default async function HomePage() {
  const [allProducts, topRaw] = await Promise.all([
    fetchProducts({ sort: "newest" }),
    fetchTopProducts(),
  ]);

  const topIds = new Set(topRaw.map((p) => p.id));

  const bestsellers: Product[] = allProducts
    .filter((p) => topIds.has(p.id))
    .slice(0, 4);

  const newArrivals: Product[] = allProducts
    .filter((p) => isNew(p.created_at))
    .slice(0, 7);

  const featured: Product[] = allProducts
    .filter((p) => p.status === "available")
    .slice(0, 8);

  return (
    <>
      <Hero />
      <BestSellers products={bestsellers.length ? bestsellers : allProducts.slice(0, 4)} />
      <NewArrivals products={newArrivals.length ? newArrivals : allProducts.slice(0, 7)} />
      <FeaturedSection products={featured} />
    </>
  );
}
