"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Eye, Heart } from "lucide-react";
import { Product } from "@/lib/types";
import { imageUrl } from "@/lib/api";
import StockBadge from "@/components/ui/StockBadge";
import TagBadge from "@/components/ui/TagBadge";
import CountryBadge from "@/components/ui/CountryBadge";

interface Props {
  product: Product;
  onQuickView?: (product: Product) => void;
  index?: number;
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

export default function ProductCard({ product, onQuickView, index = 0 }: Props) {
  const [imgError, setImgError] = useState(false);
  const [liked, setLiked] = useState(false);

  const isNew = (() => {
    const days = (Date.now() - new Date(product.created_at).getTime()) / 86_400_000;
    return days < 14;
  })();

  const isLowStock = product.stock > 0 && product.stock <= product.min_stock;

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.5, delay: index * 0.07, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="group relative"
    >
      {/* Card */}
      <div className="bg-white rounded-3xl overflow-hidden shadow-card hover:shadow-card-hover transition-shadow duration-500">

        {/* Image container */}
        <div className="relative aspect-[3/4] overflow-hidden bg-cream-100">
          {product.image && !imgError ? (
            <Image
              src={imageUrl(product.image)}
              alt={product.name}
              fill
              sizes="(max-width:768px) 50vw, (max-width:1200px) 33vw, 25vw"
              className="object-cover transition-transform duration-700 group-hover:scale-105"
              onError={() => setImgError(true)}
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center bg-cream-200">
              <span className="text-5xl opacity-30">💍</span>
            </div>
          )}

          {/* Gradient overlay on hover */}
          <div className="absolute inset-0 bg-gradient-to-t from-terra-900/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

          {/* Tags top-left */}
          <div className="absolute top-3 left-3 flex flex-col gap-1.5">
            {isNew && <TagBadge tag="new" />}
            {product.is_bestseller && <TagBadge tag="bestseller" />}
            {isLowStock && <TagBadge tag="low_stock" />}
          </div>

          {/* Wishlist button */}
          <button
            onClick={() => setLiked((l) => !l)}
            className="absolute top-3 right-3 p-2 rounded-full bg-white/80 backdrop-blur-sm shadow-soft opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110"
            aria-label="Guardar"
          >
            <Heart
              size={14}
              strokeWidth={1.5}
              className={liked ? "fill-terra-500 text-terra-500" : "text-terra-600"}
            />
          </button>

          {/* Quick view button */}
          {onQuickView && (
            <button
              onClick={() => onQuickView(product)}
              className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 bg-white/90 backdrop-blur-sm text-terra-700 font-sans text-xs tracking-wider uppercase px-4 py-2.5 rounded-full shadow-soft translate-y-3 opacity-0 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-400 whitespace-nowrap hover:bg-white"
            >
              <Eye size={13} strokeWidth={1.5} />
              Vista rápida
            </button>
          )}
        </div>

        {/* Info */}
        <div className="px-4 py-4 space-y-2">
          {/* Category */}
          {product.category_name && (
            <p className="font-sans text-[10px] tracking-[0.2em] uppercase text-terra-400">
              {product.category_name}
            </p>
          )}

          {/* Name */}
          <Link href={`/producto/${product.id}`}>
            <h3 className="font-serif text-base text-terra-800 leading-snug hover:text-terra-500 transition-colors line-clamp-2">
              {product.name}
            </h3>
          </Link>

          {/* Price + stock row */}
          <div className="flex items-center justify-between pt-1">
            <div className="flex flex-col gap-0.5">
              {(product.country === "chile" || product.country === "both") && product.sale_price > 0 && (
                <span className="font-serif text-lg font-medium text-terra-700">
                  {formatCLP(product.sale_price)}
                </span>
              )}
              {(product.country === "venezuela" || product.country === "both") && (product.price_eur ?? 0) > 0 && (
                <span className="font-serif text-base font-medium text-terra-500">
                  {formatEUR(product.price_eur ?? 0)}
                </span>
              )}
            </div>
            <StockBadge status={product.status} />
          </div>

          {/* Country */}
          <CountryBadge country={product.country} />
        </div>
      </div>
    </motion.div>
  );
}
