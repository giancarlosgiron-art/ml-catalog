"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Menu, X } from "lucide-react";
import SearchBar from "@/components/catalog/SearchBar";

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
    setSearchOpen(false);
  }, [pathname]);

  const nav = [
    { label: "Inicio",    href: "/" },
    { label: "Catálogo",  href: "/catalogo" },
    { label: "Destacados", href: "/#destacados" },
    { label: "Nuevos",    href: "/#nuevos" },
  ];

  return (
    <>
      <motion.header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-600 ${
          scrolled
            ? "bg-cream-200/95 backdrop-blur-md shadow-soft"
            : "bg-transparent"
        }`}
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex items-center justify-between h-18 lg:h-22">

            {/* Logo */}
            <Link href="/" className="group flex flex-col items-start leading-none">
              <span className="font-script text-4xl lg:text-5xl text-terra-500 group-hover:text-terra-600 transition-colors duration-300">
                ml
              </span>
              <span className="font-sans text-[9px] lg:text-[10px] tracking-[0.35em] text-terra-400 uppercase -mt-1">
                by maria lugo
              </span>
            </Link>

            {/* Desktop nav */}
            <nav className="hidden lg:flex items-center gap-10">
              {nav.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`font-sans text-xs tracking-[0.15em] uppercase transition-colors duration-300 ${
                    pathname === item.href
                      ? "text-terra-500"
                      : "text-terra-700/70 hover:text-terra-500"
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </nav>

            {/* Actions */}
            <div className="flex items-center gap-4">
              <button
                onClick={() => setSearchOpen((s) => !s)}
                className="p-2 text-terra-600 hover:text-terra-500 transition-colors"
                aria-label="Buscar"
              >
                <Search size={18} strokeWidth={1.5} />
              </button>
              <button
                onClick={() => setMenuOpen((s) => !s)}
                className="lg:hidden p-2 text-terra-600 hover:text-terra-500 transition-colors"
                aria-label="Menú"
              >
                {menuOpen ? <X size={20} strokeWidth={1.5} /> : <Menu size={20} strokeWidth={1.5} />}
              </button>
            </div>

          </div>
        </div>

        {/* Search panel */}
        <AnimatePresence>
          {searchOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="overflow-hidden border-t border-terra-200/40 bg-cream-200/95 backdrop-blur-md"
            >
              <div className="max-w-2xl mx-auto px-6 py-4">
                <SearchBar autoFocus onClose={() => setSearchOpen(false)} />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>

      {/* Mobile menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, x: "100%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: "100%" }}
            transition={{ duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="fixed inset-0 z-40 bg-cream-200 flex flex-col pt-22 px-8"
          >
            <nav className="flex flex-col gap-8 mt-8">
              {nav.map((item, i) => (
                <motion.div
                  key={item.href}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.08 }}
                >
                  <Link
                    href={item.href}
                    className="font-serif text-3xl text-terra-700 hover:text-terra-500 transition-colors"
                  >
                    {item.label}
                  </Link>
                </motion.div>
              ))}
            </nav>
            <div className="mt-auto pb-12 text-terra-400 font-sans text-xs tracking-widest uppercase">
              By Maria Lugo © {new Date().getFullYear()}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
