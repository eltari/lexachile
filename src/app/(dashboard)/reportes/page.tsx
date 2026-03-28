"use client";

import { useState } from "react";
import {
  BarChart3,
  Scale,
  Trophy,
  Clock,
  DollarSign,
  Download,
  FileSpreadsheet,
  FileText,
  ChevronDown,
  TrendingUp,
  Users,
} from "lucide-react";

// ─── Tipos ──────────────────────────────────────────────────────────────────

type Periodo = "mes" | "trimestre" | "anno";

interface DatoResumen {
  label: string;
  valor: string;
  subValor: string;
  icono: React.ElementType;
  color: string;
  trend: string;
  trendUp: boolean;
}

interface DatoBarraH {
  label: string;
  valor: number;
  color: string;
}

interface DatoBarraV {
  label: string;
  valor: number;
}

interface DatoDonut {
  label: string;
  valor: number;
  color: string;
  bgColor: string;
}

interface Abogado {
  nombre: string;
  activas: number;
  ganadas: number;
  perdidas: number;
  tasaExito: number;
  avatar: string;
}

// ─── Mock Data ──────────────────────────────────────────────────────────────

const resumenCards: DatoResumen[] = [
  {
    label: "Total Causas",
    valor: "247",
    subValor: "32 nuevas este período",
    icono: Scale,
    color: "blue",
    trend: "+15%",
    trendUp: true,
  },
  {
    label: "Causas Ganadas",
    valor: "89",
    subValor: "Tasa de éxito: 72%",
    icono: Trophy,
    color: "emerald",
    trend: "+8%",
    trendUp: true,
  },
  {
    label: "Tiempo Promedio",
    valor: "4,2 meses",
    subValor: "Por causa resuelta",
    icono: Clock,
    color: "amber",
    trend: "-12%",
    trendUp: true,
  },
  {
    label: "Facturación",
    valor: "$45.800.000",
    subValor: "Honorarios cobrados",
    icono: DollarSign,
    color: "violet",
    trend: "+22%",
    trendUp: true,
  },
];

const colorMapCards: Record<string, { bg: string; iconBg: string; iconText: string }> = {
  blue: {
    bg: "bg-blue-50 dark:bg-blue-900/20",
    iconBg: "bg-blue-100 dark:bg-blue-900/40",
    iconText: "text-blue-600 dark:text-blue-400",
  },
  emerald: {
    bg: "bg-emerald-50 dark:bg-emerald-900/20",
    iconBg: "bg-emerald-100 dark:bg-emerald-900/40",
    iconText: "text-emerald-600 dark:text-emerald-400",
  },
  amber: {
    bg: "bg-amber-50 dark:bg-amber-900/20",
    iconBg: "bg-amber-100 dark:bg-amber-900/40",
    iconText: "text-amber-600 dark:text-amber-400",
  },
  violet: {
    bg: "bg-violet-50 dark:bg-violet-900/20",
    iconBg: "bg-violet-100 dark:bg-violet-900/40",
    iconText: "text-violet-600 dark:text-violet-400",
  },
};

const causasPorMateria: DatoBarraH[] = [
  { label: "Civil", valor: 68, color: "bg-blue-500" },
  { label: "Laboral", valor: 52, color: "bg-emerald-500" },
  { label: "Familia", valor: 41, color: "bg-amber-500" },
  { label: "Penal", valor: 35, color: "bg-red-500" },
  { label: "Cobranza", valor: 28, color: "bg-purple-500" },
  { label: "Tributario", valor: 15, color: "bg-teal-500" },
  { label: "Administrativo", valor: 8, color: "bg-indigo-500" },
];

const causasPorMes: DatoBarraV[] = [
  { label: "Ene", valor: 18 },
  { label: "Feb", valor: 22 },
  { label: "Mar", valor: 15 },
  { label: "Abr", valor: 28 },
  { label: "May", valor: 24 },
  { label: "Jun", valor: 31 },
  { label: "Jul", valor: 19 },
  { label: "Ago", valor: 26 },
  { label: "Sep", valor: 33 },
  { label: "Oct", valor: 21 },
  { label: "Nov", valor: 27 },
  { label: "Dic", valor: 16 },
];

const estadoCausas: DatoDonut[] = [
  { label: "En Tramitación", valor: 42, color: "text-blue-500", bgColor: "bg-blue-500" },
  { label: "Sentenciadas", valor: 28, color: "text-emerald-500", bgColor: "bg-emerald-500" },
  { label: "En Acuerdo", valor: 15, color: "text-amber-500", bgColor: "bg-amber-500" },
  { label: "Archivadas", valor: 10, color: "text-gray-400", bgColor: "bg-gray-400" },
  { label: "Apelación", valor: 5, color: "text-red-500", bgColor: "bg-red-500" },
];

const abogados: Abogado[] = [
  { nombre: "Alejandro Torres M.", activas: 12, ganadas: 28, perdidas: 5, tasaExito: 85, avatar: "AT" },
  { nombre: "Carolina Mendoza A.", activas: 9, ganadas: 22, perdidas: 8, tasaExito: 73, avatar: "CM" },
  { nombre: "Francisco Rojas P.", activas: 15, ganadas: 19, perdidas: 6, tasaExito: 76, avatar: "FR" },
  { nombre: "Valentina Guzmán S.", activas: 8, ganadas: 15, perdidas: 3, tasaExito: 83, avatar: "VG" },
  { nombre: "Rodrigo Espinoza C.", activas: 6, ganadas: 12, perdidas: 10, tasaExito: 55, avatar: "RE" },
];

// ─── Componentes ────────────────────────────────────────────────────────────

function BarraHorizontal({ datos, maxValor }: { datos: DatoBarraH[]; maxValor: number }) {
  return (
    <div className="space-y-3">
      {datos.map((d) => (
        <div key={d.label} className="flex items-center gap-3">
          <span className="text-sm text-gray-600 dark:text-slate-400 w-28 text-right shrink-0">
            {d.label}
          </span>
          <div className="flex-1 h-8 bg-gray-100 dark:bg-slate-800 rounded-lg overflow-hidden relative">
            <div
              className={`h-full ${d.color} rounded-lg transition-all duration-700 ease-out flex items-center justify-end pr-2`}
              style={{ width: `${(d.valor / maxValor) * 100}%` }}
            >
              <span className="text-xs font-bold text-white">{d.valor}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function BarraVertical({ datos }: { datos: DatoBarraV[] }) {
  const maxVal = Math.max(...datos.map((d) => d.valor));

  return (
    <div className="flex items-end justify-between gap-2 h-48 px-2">
      {datos.map((d) => (
        <div key={d.label} className="flex flex-col items-center gap-1 flex-1">
          <span className="text-xs font-bold text-gray-700 dark:text-slate-300">{d.valor}</span>
          <div className="w-full bg-gray-100 dark:bg-slate-800 rounded-t-lg overflow-hidden relative" style={{ height: "100%" }}>
            <div
              className="absolute bottom-0 w-full bg-gradient-to-t from-blue-600 to-blue-400 rounded-t-lg transition-all duration-700 ease-out"
              style={{ height: `${(d.valor / maxVal) * 100}%` }}
            />
          </div>
          <span className="text-[10px] text-gray-500 dark:text-slate-400 font-medium">{d.label}</span>
        </div>
      ))}
    </div>
  );
}

function DisplayDonut({ datos }: { datos: DatoDonut[] }) {
  const total = datos.reduce((s, d) => s + d.valor, 0);

  return (
    <div className="flex items-center gap-8">
      {/* Anillo visual */}
      <div className="relative w-40 h-40 shrink-0">
        <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
          {(() => {
            let offset = 0;
            const gap = 2;
            return datos.map((d) => {
              const pct = (d.valor / total) * 100;
              const dashArray = pct - gap > 0 ? pct - gap : 0;
              const el = (
                <circle
                  key={d.label}
                  cx="50"
                  cy="50"
                  r="40"
                  fill="none"
                  strokeWidth="12"
                  className={d.bgColor.replace("bg-", "stroke-")}
                  strokeDasharray={`${dashArray} ${100 - dashArray}`}
                  strokeDashoffset={-offset}
                  strokeLinecap="round"
                />
              );
              offset += pct;
              return el;
            });
          })()}
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-2xl font-bold text-gray-900 dark:text-white">{total}%</span>
          <span className="text-[10px] text-gray-500 dark:text-slate-400">Total</span>
        </div>
      </div>

      {/* Leyenda */}
      <div className="space-y-2.5 flex-1">
        {datos.map((d) => (
          <div key={d.label} className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className={`w-3 h-3 rounded-full ${d.bgColor}`} />
              <span className="text-sm text-gray-700 dark:text-slate-300">{d.label}</span>
            </div>
            <span className="text-sm font-bold text-gray-900 dark:text-white">{d.valor}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Página Principal ───────────────────────────────────────────────────────

export default function ReportesPage() {
  const [periodo, setPeriodo] = useState<Periodo>("anno");

  const maxMateria = Math.max(...causasPorMateria.map((c) => c.valor));

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-gradient-to-br from-violet-500 to-purple-600 rounded-xl shadow-lg shadow-violet-500/20">
            <BarChart3 className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Reportes e Informes
            </h1>
            <p className="text-sm text-gray-500 dark:text-slate-400">
              Estadísticas y métricas de rendimiento del estudio
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Period Selector */}
          <div className="relative">
            <select
              value={periodo}
              onChange={(e) => setPeriodo(e.target.value as Periodo)}
              className="appearance-none pl-3 pr-9 py-2 rounded-xl border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-gray-900 dark:text-white text-sm font-medium focus:ring-2 focus:ring-violet-500 focus:border-violet-500 outline-none transition-all"
            >
              <option value="mes">Este Mes</option>
              <option value="trimestre">Este Trimestre</option>
              <option value="anno">Este Año</option>
            </select>
            <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          </div>

          {/* Export Buttons */}
          <button className="flex items-center gap-2 px-4 py-2 rounded-xl border border-gray-300 dark:border-slate-600 text-gray-700 dark:text-slate-300 text-sm font-medium hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors">
            <FileText className="w-4 h-4" />
            Exportar PDF
          </button>
          <button className="flex items-center gap-2 px-4 py-2 rounded-xl border border-gray-300 dark:border-slate-600 text-gray-700 dark:text-slate-300 text-sm font-medium hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors">
            <FileSpreadsheet className="w-4 h-4" />
            Exportar Excel
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {resumenCards.map((card) => {
          const colors = colorMapCards[card.color];
          return (
            <div
              key={card.label}
              className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-2xl p-5 shadow-sm"
            >
              <div className="flex items-start justify-between mb-3">
                <div className={`p-2.5 rounded-xl ${colors.iconBg}`}>
                  <card.icono className={`w-5 h-5 ${colors.iconText}`} />
                </div>
                <span
                  className={`flex items-center gap-1 text-xs font-bold px-2 py-0.5 rounded-full ${
                    card.trendUp
                      ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300"
                      : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300"
                  }`}
                >
                  <TrendingUp className={`w-3 h-3 ${!card.trendUp ? "rotate-180" : ""}`} />
                  {card.trend}
                </span>
              </div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{card.valor}</p>
              <p className="text-xs text-gray-500 dark:text-slate-400 mt-1">{card.subValor}</p>
            </div>
          );
        })}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Causas por Materia */}
        <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-2xl p-5 shadow-sm">
          <h3 className="text-base font-bold text-gray-900 dark:text-white mb-5">
            Causas por Materia
          </h3>
          <BarraHorizontal datos={causasPorMateria} maxValor={maxMateria} />
        </div>

        {/* Causas por Mes */}
        <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-2xl p-5 shadow-sm">
          <h3 className="text-base font-bold text-gray-900 dark:text-white mb-5">
            Causas por Mes
          </h3>
          <BarraVertical datos={causasPorMes} />
        </div>
      </div>

      {/* Estado de Causas */}
      <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-2xl p-5 shadow-sm">
        <h3 className="text-base font-bold text-gray-900 dark:text-white mb-5">
          Estado de Causas
        </h3>
        <DisplayDonut datos={estadoCausas} />
      </div>

      {/* Tabla de Abogados */}
      <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-2xl shadow-sm overflow-hidden">
        <div className="p-5 border-b border-gray-200 dark:border-slate-700">
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-gray-500 dark:text-slate-400" />
            <h3 className="text-base font-bold text-gray-900 dark:text-white">
              Rendimiento por Abogado
            </h3>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 dark:bg-slate-800/50">
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 dark:text-slate-400 uppercase tracking-wider">
                  Abogado
                </th>
                <th className="text-center px-4 py-3 text-xs font-semibold text-gray-500 dark:text-slate-400 uppercase tracking-wider">
                  Causas Activas
                </th>
                <th className="text-center px-4 py-3 text-xs font-semibold text-gray-500 dark:text-slate-400 uppercase tracking-wider">
                  Ganadas
                </th>
                <th className="text-center px-4 py-3 text-xs font-semibold text-gray-500 dark:text-slate-400 uppercase tracking-wider">
                  Perdidas
                </th>
                <th className="text-center px-4 py-3 text-xs font-semibold text-gray-500 dark:text-slate-400 uppercase tracking-wider">
                  Tasa Éxito
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-slate-700">
              {abogados.map((ab) => (
                <tr
                  key={ab.nombre}
                  className="hover:bg-gray-50 dark:hover:bg-slate-800/50 transition-colors"
                >
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-xs font-bold text-white shrink-0">
                        {ab.avatar}
                      </div>
                      <span className="text-sm font-medium text-gray-900 dark:text-white">
                        {ab.nombre}
                      </span>
                    </div>
                  </td>
                  <td className="text-center px-4 py-4">
                    <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-sm font-bold">
                      {ab.activas}
                    </span>
                  </td>
                  <td className="text-center px-4 py-4">
                    <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 text-sm font-bold">
                      {ab.ganadas}
                    </span>
                  </td>
                  <td className="text-center px-4 py-4">
                    <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 text-sm font-bold">
                      {ab.perdidas}
                    </span>
                  </td>
                  <td className="text-center px-4 py-4">
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-20 h-2 bg-gray-200 dark:bg-slate-700 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-700 ${
                            ab.tasaExito >= 75
                              ? "bg-emerald-500"
                              : ab.tasaExito >= 60
                              ? "bg-amber-500"
                              : "bg-red-500"
                          }`}
                          style={{ width: `${ab.tasaExito}%` }}
                        />
                      </div>
                      <span
                        className={`text-sm font-bold ${
                          ab.tasaExito >= 75
                            ? "text-emerald-600 dark:text-emerald-400"
                            : ab.tasaExito >= 60
                            ? "text-amber-600 dark:text-amber-400"
                            : "text-red-600 dark:text-red-400"
                        }`}
                      >
                        {ab.tasaExito}%
                      </span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
