"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Scale,
  LayoutDashboard,
  Users,
  Calendar,
  FileText,
  Building2,
  BookOpen,
  Bot,
  BarChart3,
  LogOut,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/causas", label: "Causas", icon: Scale },
  { href: "/clientes", label: "Clientes", icon: Users },
  { href: "/calendario", label: "Calendario", icon: Calendar },
  { href: "/documentos", label: "Documentos", icon: FileText },
  { href: "/conservador", label: "Conservador CBR", icon: Building2 },
  { href: "/leyes", label: "Leyes", icon: BookOpen },
  { href: "/ia-asistente", label: "IA Asistente", icon: Bot },
  { href: "/reportes", label: "Reportes", icon: BarChart3 },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <>
      {/* Mobile overlay */}
      <aside
        className={`
          fixed inset-y-0 left-0 z-40 flex flex-col
          bg-slate-900 text-white
          border-r border-slate-800
          transition-all duration-300 ease-in-out
          ${collapsed ? "w-[72px]" : "w-64"}
        `}
      >
        {/* Logo */}
        <div className="flex items-center gap-3 px-4 h-16 border-b border-slate-800 shrink-0">
          <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-blue-600 shrink-0">
            <Scale className="w-5 h-5 text-white" />
          </div>
          {!collapsed && (
            <div className="overflow-hidden">
              <h1 className="text-lg font-bold tracking-tight text-white">
                LexaChile
              </h1>
              <p className="text-[10px] text-slate-400 uppercase tracking-widest">
                Plataforma Jurídica
              </p>
            </div>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-4 px-2 space-y-1">
          {navItems.map((item) => {
            const isActive =
              item.href === "/"
                ? pathname === "/"
                : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`
                  flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium
                  transition-all duration-150 group
                  ${
                    isActive
                      ? "bg-blue-600/20 text-blue-400 shadow-sm shadow-blue-500/10"
                      : "text-slate-400 hover:text-white hover:bg-slate-800/60"
                  }
                `}
                title={collapsed ? item.label : undefined}
              >
                <item.icon
                  className={`w-5 h-5 shrink-0 ${
                    isActive
                      ? "text-blue-400"
                      : "text-slate-500 group-hover:text-slate-300"
                  }`}
                />
                {!collapsed && <span>{item.label}</span>}
                {isActive && !collapsed && (
                  <div className="ml-auto w-1.5 h-1.5 rounded-full bg-blue-400" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* User info */}
        <div className="border-t border-slate-800 p-3">
          {!collapsed ? (
            <div className="flex items-center gap-3 p-2 rounded-lg bg-slate-800/50">
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-sm font-bold text-white shrink-0">
                AT
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white truncate">
                  Alejandro Torres
                </p>
                <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-semibold bg-blue-600/30 text-blue-300 uppercase tracking-wider">
                  Abogado
                </span>
              </div>
              <button
                className="p-1.5 rounded-md text-slate-500 hover:text-white hover:bg-slate-700 transition-colors"
                title="Cerrar sesión"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <button
              className="w-full flex justify-center p-2 rounded-md text-slate-500 hover:text-white hover:bg-slate-700 transition-colors"
              title="Cerrar sesión"
            >
              <LogOut className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Collapse toggle */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="absolute -right-3 top-20 w-6 h-6 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-700 transition-colors shadow-lg"
        >
          {collapsed ? (
            <ChevronRight className="w-3.5 h-3.5" />
          ) : (
            <ChevronLeft className="w-3.5 h-3.5" />
          )}
        </button>
      </aside>

      {/* Spacer to push content */}
      <div
        className={`shrink-0 transition-all duration-300 ${
          collapsed ? "w-[72px]" : "w-64"
        }`}
      />
    </>
  );
}
