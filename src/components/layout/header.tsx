"use client";

import { useState } from "react";
import {
  Search,
  Bell,
  Sun,
  Moon,
  ChevronDown,
  User,
  Settings,
  LogOut,
} from "lucide-react";

export default function Header() {
  const [darkMode, setDarkMode] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    document.documentElement.classList.toggle("dark");
  };

  const notifications = [
    {
      id: 1,
      text: "Nueva audiencia programada - Causa ROL 1234-2026",
      time: "Hace 5 min",
      unread: true,
    },
    {
      id: 2,
      text: "Documento firmado por cliente María González",
      time: "Hace 30 min",
      unread: true,
    },
    {
      id: 3,
      text: "Plazo vence mañana - Causa ROL 892-2025",
      time: "Hace 2 horas",
      unread: false,
    },
  ];

  const unreadCount = notifications.filter((n) => n.unread).length;

  return (
    <header className="sticky top-0 z-30 h-16 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-b border-gray-200 dark:border-slate-800 flex items-center justify-between px-6">
      {/* Search */}
      <div className="flex-1 max-w-xl">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-slate-500" />
          <input
            type="text"
            placeholder="Buscar causas, clientes, documentos..."
            className="w-full pl-10 pr-4 py-2 bg-gray-100 dark:bg-slate-800 text-sm text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-slate-500 rounded-lg border border-transparent focus:border-blue-500 focus:bg-white dark:focus:bg-slate-800 focus:ring-1 focus:ring-blue-500 outline-none transition-all"
          />
          <kbd className="absolute right-3 top-1/2 -translate-y-1/2 hidden sm:inline-flex items-center px-1.5 py-0.5 text-[10px] font-medium text-gray-400 dark:text-slate-500 bg-white dark:bg-slate-700 rounded border border-gray-200 dark:border-slate-600">
            ⌘K
          </kbd>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2 ml-4">
        {/* Dark mode toggle */}
        <button
          onClick={toggleDarkMode}
          className="relative p-2 rounded-lg text-gray-500 dark:text-slate-400 hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors"
          title={darkMode ? "Modo claro" : "Modo oscuro"}
        >
          {darkMode ? (
            <Sun className="w-5 h-5" />
          ) : (
            <Moon className="w-5 h-5" />
          )}
        </button>

        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => {
              setShowNotifications(!showNotifications);
              setShowUserMenu(false);
            }}
            className="relative p-2 rounded-lg text-gray-500 dark:text-slate-400 hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors"
          >
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                {unreadCount}
              </span>
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-gray-200 dark:border-slate-700 overflow-hidden">
              <div className="px-4 py-3 border-b border-gray-100 dark:border-slate-700">
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
                  Notificaciones
                </h3>
              </div>
              <div className="max-h-72 overflow-y-auto">
                {notifications.map((n) => (
                  <div
                    key={n.id}
                    className={`px-4 py-3 border-b border-gray-50 dark:border-slate-700/50 hover:bg-gray-50 dark:hover:bg-slate-700/50 cursor-pointer transition-colors ${
                      n.unread ? "bg-blue-50/50 dark:bg-blue-900/10" : ""
                    }`}
                  >
                    <p className="text-sm text-gray-700 dark:text-slate-300">
                      {n.text}
                    </p>
                    <p className="text-xs text-gray-400 dark:text-slate-500 mt-1">
                      {n.time}
                    </p>
                  </div>
                ))}
              </div>
              <div className="px-4 py-2 bg-gray-50 dark:bg-slate-800/50">
                <button className="text-xs text-blue-600 dark:text-blue-400 font-medium hover:underline">
                  Ver todas las notificaciones
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Separator */}
        <div className="w-px h-8 bg-gray-200 dark:bg-slate-700 mx-1" />

        {/* User menu */}
        <div className="relative">
          <button
            onClick={() => {
              setShowUserMenu(!showUserMenu);
              setShowNotifications(false);
            }}
            className="flex items-center gap-2 p-1.5 pr-3 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors"
          >
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-xs font-bold text-white">
              AT
            </div>
            <span className="hidden sm:block text-sm font-medium text-gray-700 dark:text-slate-300">
              Alejandro
            </span>
            <ChevronDown className="w-3.5 h-3.5 text-gray-400 dark:text-slate-500" />
          </button>

          {showUserMenu && (
            <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-gray-200 dark:border-slate-700 overflow-hidden">
              <div className="px-4 py-3 border-b border-gray-100 dark:border-slate-700">
                <p className="text-sm font-semibold text-gray-900 dark:text-white">
                  Alejandro Torres
                </p>
                <p className="text-xs text-gray-500 dark:text-slate-400">
                  alejandro@lexachile.cl
                </p>
              </div>
              <div className="py-1">
                <button className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-gray-700 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-700/50 transition-colors">
                  <User className="w-4 h-4" />
                  Mi Perfil
                </button>
                <button className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-gray-700 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-700/50 transition-colors">
                  <Settings className="w-4 h-4" />
                  Configuración
                </button>
              </div>
              <div className="border-t border-gray-100 dark:border-slate-700 py-1">
                <button className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors">
                  <LogOut className="w-4 h-4" />
                  Cerrar Sesión
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
