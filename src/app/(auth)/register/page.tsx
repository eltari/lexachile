"use client";

import { useState } from "react";
import Link from "next/link";
import { Scale, Eye, EyeOff, Mail, Lock, User, Hash, ChevronDown } from "lucide-react";

const roles = [
  { value: "", label: "Selecciona tu rol" },
  { value: "abogado", label: "Abogado" },
  { value: "procurador", label: "Procurador" },
  { value: "paralegal", label: "Paralegal" },
  { value: "secretario", label: "Secretario/a" },
  { value: "administrador", label: "Administrador" },
  { value: "estudiante", label: "Estudiante de Derecho" },
];

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  return (
    <div className="flex flex-col items-center justify-center px-4 py-12">
      {/* Logo */}
      <div className="flex items-center gap-3 mb-8">
        <div className="w-12 h-12 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center">
          <Scale className="w-6 h-6 text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">
            LexaChile
          </h1>
          <p className="text-xs text-blue-200 uppercase tracking-widest">
            Plataforma Jurídica
          </p>
        </div>
      </div>

      {/* Card */}
      <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-2xl shadow-2xl p-8">
        <div className="text-center mb-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            Crear Cuenta
          </h2>
          <p className="text-sm text-gray-500 dark:text-slate-400 mt-1">
            Únete a la plataforma jurídica líder en Chile
          </p>
        </div>

        <form className="space-y-4">
          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1.5">
              Nombre completo
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-slate-500" />
              <input
                type="text"
                placeholder="Juan Pérez González"
                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 dark:bg-slate-800 text-gray-900 dark:text-white text-sm rounded-lg border border-gray-200 dark:border-slate-700 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all placeholder-gray-400 dark:placeholder-slate-500"
              />
            </div>
          </div>

          {/* RUT */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1.5">
              RUT
            </label>
            <div className="relative">
              <Hash className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-slate-500" />
              <input
                type="text"
                placeholder="12.345.678-9"
                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 dark:bg-slate-800 text-gray-900 dark:text-white text-sm rounded-lg border border-gray-200 dark:border-slate-700 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all placeholder-gray-400 dark:placeholder-slate-500"
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1.5">
              Correo electrónico
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-slate-500" />
              <input
                type="email"
                placeholder="tu@correo.cl"
                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 dark:bg-slate-800 text-gray-900 dark:text-white text-sm rounded-lg border border-gray-200 dark:border-slate-700 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all placeholder-gray-400 dark:placeholder-slate-500"
              />
            </div>
          </div>

          {/* Role */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1.5">
              Rol profesional
            </label>
            <div className="relative">
              <select className="w-full pl-4 pr-10 py-2.5 bg-gray-50 dark:bg-slate-800 text-gray-900 dark:text-white text-sm rounded-lg border border-gray-200 dark:border-slate-700 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all appearance-none">
                {roles.map((role) => (
                  <option key={role.value} value={role.value}>
                    {role.label}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-slate-500 pointer-events-none" />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1.5">
              Contraseña
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-slate-500" />
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Mínimo 8 caracteres"
                className="w-full pl-10 pr-10 py-2.5 bg-gray-50 dark:bg-slate-800 text-gray-900 dark:text-white text-sm rounded-lg border border-gray-200 dark:border-slate-700 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all placeholder-gray-400 dark:placeholder-slate-500"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-slate-500 hover:text-gray-600 dark:hover:text-slate-300"
              >
                {showPassword ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1.5">
              Confirmar contraseña
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-slate-500" />
              <input
                type={showConfirm ? "text" : "password"}
                placeholder="Repite tu contraseña"
                className="w-full pl-10 pr-10 py-2.5 bg-gray-50 dark:bg-slate-800 text-gray-900 dark:text-white text-sm rounded-lg border border-gray-200 dark:border-slate-700 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all placeholder-gray-400 dark:placeholder-slate-500"
              />
              <button
                type="button"
                onClick={() => setShowConfirm(!showConfirm)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-slate-500 hover:text-gray-600 dark:hover:text-slate-300"
              >
                {showConfirm ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-lg shadow-lg shadow-blue-600/30 hover:shadow-blue-600/40 transition-all active:scale-[0.98] mt-2"
          >
            Crear Cuenta
          </button>
        </form>

        {/* Divider */}
        <div className="flex items-center gap-3 my-6">
          <div className="flex-1 h-px bg-gray-200 dark:bg-slate-700" />
          <span className="text-xs text-gray-400 dark:text-slate-500">o</span>
          <div className="flex-1 h-px bg-gray-200 dark:bg-slate-700" />
        </div>

        {/* Login link */}
        <p className="text-center text-sm text-gray-500 dark:text-slate-400">
          ¿Ya tienes cuenta?{" "}
          <Link
            href="/login"
            className="text-blue-600 dark:text-blue-400 font-semibold hover:underline"
          >
            Inicia Sesión
          </Link>
        </p>
      </div>

      {/* Footer */}
      <p className="mt-8 text-xs text-blue-200/60">
        &copy; 2026 LexaChile. Todos los derechos reservados.
      </p>
    </div>
  );
}
