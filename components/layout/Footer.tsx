import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-terra-800 text-cream-200 mt-24">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16 lg:py-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 lg:gap-20">

          {/* Brand */}
          <div className="space-y-4">
            <div className="flex flex-col items-start leading-none">
              <span className="font-script text-5xl text-cream-300">ml</span>
              <span className="font-sans text-[9px] tracking-[0.35em] text-cream-400 uppercase -mt-1">
                by maria lugo
              </span>
            </div>
            <p className="font-sans text-sm text-cream-400/70 leading-relaxed max-w-xs">
              Accesorios y joyería femenina de autor. Piezas únicas diseñadas con amor.
            </p>
          </div>

          {/* Links */}
          <div className="space-y-5">
            <h3 className="font-sans text-[10px] tracking-[0.3em] uppercase text-cream-400/50">
              Catálogo
            </h3>
            <nav className="flex flex-col gap-3">
              {[
                { label: "Todos los productos", href: "/catalogo" },
                { label: "Destacados",          href: "/#destacados" },
                { label: "Nuevos ingresos",     href: "/#nuevos" },
                { label: "Más vendidos",        href: "/#bestsellers" },
              ].map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  className="font-sans text-sm text-cream-300/70 hover:text-cream-200 transition-colors"
                >
                  {l.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Contact */}
          <div className="space-y-5">
            <h3 className="font-sans text-[10px] tracking-[0.3em] uppercase text-cream-400/50">
              Presencia
            </h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <span className="text-gold text-lg">🇨🇱</span>
                <span className="font-sans text-sm text-cream-300/70">Chile</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-lg">🇻🇪</span>
                <span className="font-sans text-sm text-cream-300/70">Venezuela</span>
              </div>
            </div>
          </div>

        </div>

        <div className="mt-16 pt-8 border-t border-cream-200/10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="font-sans text-xs text-cream-400/40 tracking-wider">
            © {new Date().getFullYear()} By Maria Lugo. Todos los derechos reservados.
          </p>
          <p className="font-sans text-xs text-cream-400/30 tracking-wider">
            Catálogo interno — uso exclusivo
          </p>
        </div>
      </div>
    </footer>
  );
}
