import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Package, Hash } from "lucide-react";
import { fetchProduct, imageUrl } from "@/lib/api";
import StockBadge from "@/components/ui/StockBadge";
import CountryBadge from "@/components/ui/CountryBadge";
import TagBadge from "@/components/ui/TagBadge";

interface Props {
  params: Promise<{ id: string }>;
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

export default async function ProductPage({ params }: Props) {
  const { id } = await params;
  const product = await fetchProduct(Number(id));
  if (!product) notFound();

  const isNew = (Date.now() - new Date(product.created_at).getTime()) / 86_400_000 < 14;
  const isLowStock = product.stock > 0 && product.stock <= product.min_stock;

  return (
    <main className="min-h-screen pt-24 pb-20 px-6">
      <div className="max-w-6xl mx-auto">

        {/* Breadcrumb */}
        <Link
          href="/catalogo"
          className="inline-flex items-center gap-2 font-sans text-xs tracking-wider uppercase text-terra-400 hover:text-terra-600 transition-colors mb-10"
        >
          <ArrowLeft size={13} strokeWidth={1.5} />
          Volver al catálogo
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">

          {/* Image */}
          <div className="relative aspect-[3/4] lg:aspect-square rounded-4xl overflow-hidden bg-cream-100 shadow-card">
            {product.image ? (
              <Image
                src={imageUrl(product.image)}
                alt={product.name}
                fill
                priority
                className="object-cover"
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-[120px] opacity-10">💍</span>
              </div>
            )}
          </div>

          {/* Detail */}
          <div className="flex flex-col gap-6 lg:pt-4">

            {/* Tags */}
            <div className="flex flex-wrap gap-2">
              {isNew && <TagBadge tag="new" />}
              {product.is_bestseller && <TagBadge tag="bestseller" />}
              {isLowStock && <TagBadge tag="low_stock" />}
            </div>

            {/* Category */}
            {product.category_name && (
              <p className="font-sans text-[10px] tracking-[0.3em] uppercase text-terra-400">
                {product.category_name}
              </p>
            )}

            {/* Name */}
            <h1 className="font-serif text-3xl lg:text-4xl text-terra-800 leading-snug">
              {product.name}
            </h1>

            {/* Price */}
            <div className="flex flex-wrap items-baseline gap-3">
              {(product.country === "chile" || product.country === "both") && product.sale_price > 0 && (
                <span className="font-serif text-4xl text-terra-600">
                  {formatCLP(product.sale_price)}
                </span>
              )}
              {(product.country === "venezuela" || product.country === "both") && product.price_eur && product.price_eur > 0 && (
                <span className="font-serif text-3xl text-terra-400">
                  {formatEUR(product.price_eur)}
                </span>
              )}
            </div>

            {/* Description */}
            {product.description && (
              <p className="font-sans text-sm text-terra-600/70 leading-relaxed border-t border-terra-200/40 pt-5">
                {product.description}
              </p>
            )}

            {/* Specs grid */}
            <div className="grid grid-cols-2 gap-3 border-t border-terra-200/40 pt-5">
              {/* Stock */}
              <div className="bg-cream-100 rounded-2xl p-4 space-y-1.5">
                <div className="flex items-center gap-2 text-terra-400">
                  <Package size={13} strokeWidth={1.5} />
                  <span className="font-sans text-[9px] tracking-widest uppercase">Stock</span>
                </div>
                <p className="font-sans text-sm font-medium text-terra-700">
                  {product.stock} unidades
                </p>
                <StockBadge status={product.status} size="sm" />
              </div>

              {/* SKU */}
              {product.sku && (
                <div className="bg-cream-100 rounded-2xl p-4 space-y-1.5">
                  <div className="flex items-center gap-2 text-terra-400">
                    <Hash size={13} strokeWidth={1.5} />
                    <span className="font-sans text-[9px] tracking-widest uppercase">SKU</span>
                  </div>
                  <p className="font-mono text-sm text-terra-700">{product.sku}</p>
                </div>
              )}


              {/* Country */}
              {product.country && (
                <div className="bg-cream-100 rounded-2xl p-4 space-y-1.5">
                  <span className="font-sans text-[9px] tracking-widest uppercase text-terra-400">
                    Disponible en
                  </span>
                  <CountryBadge country={product.country} size="md" />
                </div>
              )}
            </div>

            {/* Date */}
            <p className="font-sans text-[10px] tracking-wider text-terra-400/60">
              Ingresado el {new Date(product.created_at).toLocaleDateString("es-CL", {
                day: "numeric", month: "long", year: "numeric"
              })}
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
