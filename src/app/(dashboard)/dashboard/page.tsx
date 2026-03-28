"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Scale,
  Users,
  Calendar,
  FileText,
  TrendingUp,
  Clock,
  ArrowRight,
  Loader2,
} from "lucide-react";
import { estadosCausa, formatFechaCorta } from "@/lib/utils";
import { format, parseISO } from "date-fns";
import { es } from "date-fns/locale";

type EstadoCausa = keyof typeof estadosCausa;

interface DashboardStats {
  causas: number;
  clientes: number;
  eventos: number;
  documentos: number;
}

interface RecentCausa {
  id: string;
  rol: string;
  caratulado: string;
  materia: string;
  estado: EstadoCausa;
  createdAt: string;
}

interface UpcomingEvento {
  id: string;
  titulo: string;
  tipo: string;
  fechaInicio: string;
  causa?: { id: string; rol: string; caratulado: string } | null;
}

const colorMap: Record<string, { bg: string; iconBg: string; iconText: string; trendText: string }> = {
  blue: {
    bg: "bg-blue-50 dark:bg-blue-900/20",
    iconBg: "bg-blue-100 dark:bg-blue-900/40",
    iconText: "text-blue-600 dark:text-blue-400",
    trendText: "text-blue-600 dark:text-blue-400",
  },
  emerald: {
    bg: "bg-emerald-50 dark:bg-emerald-900/20",
    iconBg: "bg-emerald-100 dark:bg-emerald-900/40",
    iconText: "text-emerald-600 dark:text-emerald-400",
    trendText: "text-emerald-600 dark:text-emerald-400",
  },
  amber: {
    bg: "bg-amber-50 dark:bg-amber-900/20",
    iconBg: "bg-amber-100 dark:bg-amber-900/40",
    iconText: "text-amber-600 dark:text-amber-400",
    trendText: "text-amber-600 dark:text-amber-400",
  },
  violet: {
    bg: "bg-violet-50 dark:bg-violet-900/20",
    iconBg: "bg-violet-100 dark:bg-violet-900/40",
    iconText: "text-violet-600 dark:text-violet-400",
    trendText: "text-violet-600 dark:text-violet-400",
  },
};

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats>({
    causas: 0,
    clientes: 0,
    eventos: 0,
    documentos: 0,
  });
  const [recentCausas, setRecentCausas] = useState<RecentCausa[]>([]);
  const [upcomingEvents, setUpcomingEvents] = useState<UpcomingEvento[]>([]);
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState<{ user?: { name?: string } } | null>(null);

  useEffect(() => {
    async function loadDashboard() {
      setLoading(true);
      try {
        const [causasRes, clientesRes, eventosRes, documentosRes, sessionRes] =
          await Promise.all([
            fetch("/api/causas?limit=5"),
            fetch("/api/clientes?limit=1"),
            fetch("/api/eventos"),
            fetch("/api/documentos?limit=1"),
            fetch("/api/auth/session"),
          ]);

        const causasJson = causasRes.ok ? await causasRes.json() : { data: [], pagination: { total: 0 } };
        const clientesJson = clientesRes.ok ? await clientesRes.json() : { pagination: { total: 0 } };
        const eventosJson = eventosRes.ok ? await eventosRes.json() : { data: [] };
        const documentosJson = documentosRes.ok ? await documentosRes.json() : { pagination: { total: 0 } };

        setStats({
          causas: causasJson.pagination?.total || 0,
          clientes: clientesJson.pagination?.total || 0,
          eventos: (eventosJson.data || []).length,
          documentos: documentosJson.pagination?.total || 0,
        });

        setRecentCausas(
          (causasJson.data || []).slice(0, 5).map((c: RecentCausa) => ({
            id: c.id,
            rol: c.rol,
            caratulado: c.caratulado,
            materia: c.materia,
            estado: c.estado,
            createdAt: c.createdAt,
          }))
        );

        // Filter upcoming events (future dates)
        const now = new Date();
        const upcoming = (eventosJson.data || [])
          .filter((e: UpcomingEvento) => new Date(e.fechaInicio) >= now)
          .slice(0, 4);
        setUpcomingEvents(upcoming);

        if (sessionRes.ok) {
          setSession(await sessionRes.json());
        }
      } catch {
        // Silently handle errors
      } finally {
        setLoading(false);
      }
    }
    loadDashboard();
  }, []);

  const statsConfig = [
    {
      label: "Causas Activas",
      value: stats.causas,
      icon: Scale,
      color: "blue",
    },
    {
      label: "Clientes",
      value: stats.clientes,
      icon: Users,
      color: "emerald",
    },
    {
      label: "Eventos Pendientes",
      value: stats.eventos,
      icon: Calendar,
      color: "amber",
    },
    {
      label: "Documentos",
      value: stats.documentos,
      icon: FileText,
      color: "violet",
    },
  ];

  const firstName = session?.user?.name?.split(" ")[0] || "Usuario";

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <Loader2 className="w-8 h-8 text-blue-500 mx-auto mb-3 animate-spin" />
          <p className="text-gray-500 text-sm">Cargando dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Welcome */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Bienvenido, {firstName}
        </h1>
        <p className="text-sm text-gray-500 dark:text-slate-400 mt-1">
          Aquí tienes un resumen de tu actividad jurídica.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statsConfig.map((stat) => {
          const colors = colorMap[stat.color];
          return (
            <div
              key={stat.label}
              className="bg-white dark:bg-slate-900 rounded-xl border border-gray-200 dark:border-slate-800 p-5 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between">
                <div
                  className={`w-10 h-10 rounded-lg flex items-center justify-center ${colors.iconBg}`}
                >
                  <stat.icon className={`w-5 h-5 ${colors.iconText}`} />
                </div>
                <TrendingUp className="w-4 h-4 text-green-500" />
              </div>
              <div className="mt-3">
                <p className="text-3xl font-bold text-gray-900 dark:text-white">
                  {stat.value}
                </p>
                <p className="text-sm text-gray-500 dark:text-slate-400 mt-0.5">
                  {stat.label}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Causas */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-xl border border-gray-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 dark:border-slate-800">
            <h2 className="text-base font-semibold text-gray-900 dark:text-white">
              Causas Recientes
            </h2>
            <Link
              href="/causas"
              className="flex items-center gap-1 text-xs font-medium text-blue-600 dark:text-blue-400 hover:underline"
            >
              Ver todas <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 dark:border-slate-800">
                  <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 dark:text-slate-400 uppercase tracking-wider">
                    ROL
                  </th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 dark:text-slate-400 uppercase tracking-wider">
                    Caratulado
                  </th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 dark:text-slate-400 uppercase tracking-wider hidden md:table-cell">
                    Materia
                  </th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 dark:text-slate-400 uppercase tracking-wider">
                    Estado
                  </th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 dark:text-slate-400 uppercase tracking-wider hidden sm:table-cell">
                    Fecha
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 dark:divide-slate-800/50">
                {recentCausas.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-5 py-8 text-center text-sm text-gray-400">
                      No hay causas registradas
                    </td>
                  </tr>
                ) : (
                  recentCausas.map((causa) => {
                    const estado = estadosCausa[causa.estado] || {
                      label: causa.estado,
                      color: "bg-gray-100 text-gray-700",
                    };
                    return (
                      <tr
                        key={causa.id}
                        className="hover:bg-gray-50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer"
                      >
                        <td className="px-5 py-3">
                          <Link
                            href={`/causas/${causa.id}`}
                            className="font-mono text-xs font-medium text-gray-900 dark:text-white hover:text-blue-600"
                          >
                            {causa.rol}
                          </Link>
                        </td>
                        <td className="px-5 py-3 font-medium text-gray-900 dark:text-white">
                          {causa.caratulado}
                        </td>
                        <td className="px-5 py-3 text-gray-500 dark:text-slate-400 hidden md:table-cell">
                          {causa.materia}
                        </td>
                        <td className="px-5 py-3">
                          <span
                            className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${estado.color}`}
                          >
                            {estado.label}
                          </span>
                        </td>
                        <td className="px-5 py-3 text-gray-500 dark:text-slate-400 hidden sm:table-cell">
                          {formatFechaCorta(causa.createdAt)}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Upcoming Events */}
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-gray-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 dark:border-slate-800">
            <h2 className="text-base font-semibold text-gray-900 dark:text-white">
              Próximas Audiencias
            </h2>
            <Link
              href="/calendario"
              className="flex items-center gap-1 text-xs font-medium text-blue-600 dark:text-blue-400 hover:underline"
            >
              Ver todas <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          <div className="divide-y divide-gray-50 dark:divide-slate-800/50">
            {upcomingEvents.length === 0 ? (
              <div className="px-5 py-8 text-center text-sm text-gray-400">
                No hay eventos próximos
              </div>
            ) : (
              upcomingEvents.map((event) => {
                const isUrgent = event.tipo === "audiencia" || event.tipo === "vencimiento";
                const causaLabel = event.causa
                  ? `${event.causa.rol} - ${event.causa.caratulado}`
                  : undefined;
                let dateLabel = "";
                try {
                  const d = parseISO(event.fechaInicio);
                  dateLabel = format(d, "EEE dd MMM, HH:mm", { locale: es });
                } catch {
                  dateLabel = formatFechaCorta(event.fechaInicio);
                }
                return (
                  <div
                    key={event.id}
                    className="px-5 py-4 hover:bg-gray-50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer"
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className={`mt-0.5 w-2 h-2 rounded-full shrink-0 ${
                          isUrgent ? "bg-red-500" : "bg-blue-500"
                        }`}
                      />
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-gray-900 dark:text-white">
                          {event.titulo}
                        </p>
                        {causaLabel && (
                          <p className="text-xs text-gray-500 dark:text-slate-400 mt-0.5 truncate">
                            {causaLabel}
                          </p>
                        )}
                        <div className="flex items-center gap-1 mt-1.5">
                          <Clock className="w-3 h-3 text-gray-400 dark:text-slate-500" />
                          <span className="text-xs font-medium text-gray-600 dark:text-slate-300">
                            {dateLabel}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
