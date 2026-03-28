"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Scale, Menu, X } from "lucide-react";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950">
      {/* Navbar */}
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? "bg-slate-900/80 backdrop-blur-xl border-b border-white/10 shadow-lg shadow-black/5"
            : "bg-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-20">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="w-9 h-9 rounded-lg bg-blue-600 flex items-center justify-center group-hover:bg-blue-500 transition-colors">
                <Scale className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-white tracking-tight">
                Lexa<span className="text-blue-400">Chile</span>
              </span>
            </Link>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center gap-8">
              <a
                href="#caracteristicas"
                className="text-sm font-medium text-slate-300 hover:text-white transition-colors"
              >
                Características
              </a>
              <a
                href="#comparacion"
                className="text-sm font-medium text-slate-300 hover:text-white transition-colors"
              >
                Precios
              </a>
              <a
                href="#contacto"
                className="text-sm font-medium text-slate-300 hover:text-white transition-colors"
              >
                Contacto
              </a>
            </div>

            {/* Desktop CTA */}
            <div className="hidden md:flex items-center gap-3">
              <Link
                href="/login"
                className="text-sm font-medium text-slate-300 hover:text-white px-4 py-2 transition-colors"
              >
                Iniciar Sesión
              </Link>
              <Link
                href="/register"
                className="text-sm font-semibold text-white bg-blue-600 hover:bg-blue-500 px-5 py-2.5 rounded-lg transition-colors shadow-lg shadow-blue-600/25"
              >
                Comenzar Gratis
              </Link>
            </div>

            {/* Mobile Toggle */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden p-2 text-slate-300 hover:text-white"
              aria-label="Menú"
            >
              {mobileOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileOpen && (
          <div className="md:hidden bg-slate-900/95 backdrop-blur-xl border-t border-white/10">
            <div className="px-4 py-4 space-y-3">
              <a
                href="#caracteristicas"
                onClick={() => setMobileOpen(false)}
                className="block text-sm font-medium text-slate-300 hover:text-white py-2"
              >
                Características
              </a>
              <a
                href="#comparacion"
                onClick={() => setMobileOpen(false)}
                className="block text-sm font-medium text-slate-300 hover:text-white py-2"
              >
                Precios
              </a>
              <a
                href="#contacto"
                onClick={() => setMobileOpen(false)}
                className="block text-sm font-medium text-slate-300 hover:text-white py-2"
              >
                Contacto
              </a>
              <div className="pt-3 border-t border-white/10 flex flex-col gap-2">
                <Link
                  href="/login"
                  className="text-sm font-medium text-slate-300 hover:text-white py-2"
                >
                  Iniciar Sesión
                </Link>
                <Link
                  href="/register"
                  className="text-sm font-semibold text-white bg-blue-600 hover:bg-blue-500 px-5 py-2.5 rounded-lg text-center"
                >
                  Comenzar Gratis
                </Link>
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Page Content */}
      {children}
    </div>
  );
}
