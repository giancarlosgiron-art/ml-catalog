"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

const sentence = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.04 } },
};

const word = {
  hidden:  { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" as const } },
};

export default function Hero() {
  const headline = "Piezas únicas,\nelegancia auténtica.";

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center px-6 pt-24 pb-16 overflow-hidden">

      {/* Background rings */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full border border-terra-300/10 animate-[spin_80s_linear_infinite]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full border border-terra-300/15 animate-[spin_60s_linear_infinite_reverse]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full border border-terra-300/20" />
      </div>

      {/* Soft blobs */}
      <div className="absolute top-20 right-[10%] w-72 h-72 rounded-full bg-terra-200/20 blur-3xl pointer-events-none" />
      <div className="absolute bottom-20 left-[5%] w-64 h-64 rounded-full bg-gold-light/30 blur-3xl pointer-events-none" />

      {/* Content */}
      <div className="relative z-10 text-center max-w-4xl mx-auto space-y-8">

        {/* Eyebrow */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex items-center justify-center gap-4"
        >
          <span className="h-px w-12 bg-terra-400/40" />
          <span className="font-sans text-[10px] tracking-[0.35em] uppercase text-terra-400">
            Colección exclusiva
          </span>
          <span className="h-px w-12 bg-terra-400/40" />
        </motion.div>

        {/* Headline */}
        <motion.h1
          variants={sentence}
          initial="hidden"
          animate="visible"
          className="font-serif leading-[1.1] text-terra-800 whitespace-pre-line"
          style={{ fontSize: "clamp(2.5rem, 7vw, 5.5rem)" }}
        >
          {headline.split("").map((char, i) => (
            <motion.span key={i} variants={word} style={{ display: "inline" }}>
              {char === "\n" ? <br /> : char}
            </motion.span>
          ))}
        </motion.h1>

        {/* Script accent */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9, duration: 0.8 }}
          className="font-script text-4xl lg:text-5xl text-terra-400/60"
        >
          by maria lugo
        </motion.p>

        {/* Subline */}
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.1, duration: 0.6 }}
          className="font-sans text-base text-terra-600/70 max-w-sm mx-auto leading-relaxed"
        >
          Accesorios y joyería femenina de autor para mujeres que celebran su estilo.
        </motion.p>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.3, duration: 0.6 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Link
            href="/catalogo"
            className="group flex items-center gap-2.5 bg-terra-500 hover:bg-terra-600 text-cream-100 font-sans text-xs tracking-[0.2em] uppercase px-8 py-4 rounded-full transition-all duration-400 shadow-card hover:shadow-card-hover"
          >
            Ver catálogo completo
            <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform duration-300" />
          </Link>
          <Link
            href="/#nuevos"
            className="font-sans text-xs tracking-[0.2em] uppercase text-terra-600 hover:text-terra-500 transition-colors underline-offset-4 hover:underline"
          >
            Nuevos ingresos
          </Link>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2, duration: 0.8 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
      >
        <span className="font-sans text-[9px] tracking-[0.3em] uppercase text-terra-400/50">Scroll</span>
        <div className="w-px h-10 bg-gradient-to-b from-terra-400/40 to-transparent animate-pulse" />
      </motion.div>
    </section>
  );
}
