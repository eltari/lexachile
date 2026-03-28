"use client";

import { useState, useEffect, useCallback } from "react";
import {
  BookOpen,
  Search,
  Filter,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Check,
  X,
  FileText,
  Scale,
  Calendar,
  Tag,
  Loader2,
  AlertCircle,
  Database,
  Globe,
} from "lucide-react";

// ─── Tipos ──────────────────────────────────────────────────────────────────

type TipoNorma = "Ley" | "Decreto" | "DFL" | "DS" | "DL";
type EstadoNorma = "Vigente" | "Derogada" | "Modificada";

interface Ley {
  id: string;
  numero: string;
  titulo: string;
  tipo: TipoNorma;
  fechaPublicacion: string;
  fechaPromulgacion: string;
  estado: EstadoNorma;
  organismo: string;
  urlBCN: string;
  resumen: string;
}

// ─── Helpers ────────────────────────────────────────────────────────────────

const estadoColor: Record<EstadoNorma, string> = {
  Vigente: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300",
  Derogada: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300",
  Modificada: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300",
};

const tipoColor: Record<TipoNorma, string> = {
  Ley: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300",
  Decreto: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300",
  DFL: "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300",
  DS: "bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-300",
  DL: "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300",
};

// ─── Componente Tarjeta de Ley ──────────────────────────────────────────────

function TarjetaLey({ ley }: { ley: Ley }) {
  const [expandida, setExpandida] = useState(false);

  return (
    <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
      <button
        onClick={() => setExpandida(!expandida)}
        className="w-full text-left p-5"
      >
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2 flex-wrap">
              <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${tipoColor[ley.tipo] || tipoColor.Ley}`}>
                {ley.tipo} N° {ley.numero}
              </span>
              <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${estadoColor[ley.estado] || estadoColor.Vigente}`}>
                {ley.estado === "Vigente" && <Check className="w-3 h-3 inline mr-0.5" />}
                {ley.estado === "Derogada" && <X className="w-3 h-3 inline mr-0.5" />}
                {ley.estado}
              </span>
            </div>
            <h3 className="text-base font-semibold text-gray-900 dark:text-white leading-snug">
              {ley.titulo}
            </h3>
            <div className="flex items-center gap-4 mt-2 text-xs text-gray-500 dark:text-slate-400">
              {ley.fechaPublicacion && (
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" />
                  {new Date(ley.fechaPublicacion).toLocaleDateString("es-CL", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  })}
                </span>
              )}
              {ley.organismo && (
                <span className="flex items-center gap-1">
                  <Scale className="w-3.5 h-3.5" />
                  {ley.organismo}
                </span>
              )}
            </div>
          </div>
          <div className="shrink-0 mt-1">
            {expandida ? (
              <ChevronUp className="w-5 h-5 text-gray-400" />
            ) : (
              <ChevronDown className="w-5 h-5 text-gray-400" />
            )}
          </div>
        </div>
      </button>

      {expandida && (
        <div className="px-5 pb-5 border-t border-gray-100 dark:border-slate-800 pt-4">
          {ley.resumen && (
            <div className="bg-gray-50 dark:bg-slate-800/50 rounded-xl p-4 mb-4">
              <h4 className="text-xs font-semibold text-gray-500 dark:text-slate-400 uppercase tracking-wider mb-2">
                Resumen
              </h4>
              <p className="text-sm text-gray-700 dark:text-slate-300 leading-relaxed">
                {ley.resumen}
              </p>
            </div>
          )}

          {(ley.fechaPromulgacion || ley.fechaPublicacion) && (
            <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
              {ley.fechaPromulgacion && (
                <div>
                  <p className="text-xs text-gray-500 dark:text-slate-400">Fecha de Promulgacion</p>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {new Date(ley.fechaPromulgacion).toLocaleDateString("es-CL", {
                      day: "2-digit",
                      month: "long",
                      year: "numeric",
                    })}
                  </p>
                </div>
              )}
              {ley.fechaPublicacion && (
                <div>
                  <p className="text-xs text-gray-500 dark:text-slate-400">Fecha de Publicacion</p>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {new Date(ley.fechaPublicacion).toLocaleDateString("es-CL", {
                      day: "2-digit",
                      month: "long",
                      year: "numeric",
                    })}
                  </p>
                </div>
              )}
            </div>
          )}

          <a
            href={ley.urlBCN}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl text-sm font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all shadow-md shadow-blue-500/20"
          >
            <ExternalLink className="w-4 h-4" />
            Ver en BCN / LeyChile
          </a>
        </div>
      )}
    </div>
  );
}

// ─── Indicador de Fuente ───────────────────────────────────────────────────

function IndicadorFuente({ source }: { source: "real" | "mock" | null }) {
  if (!source) return null;

  if (source === "real") {
    return (
      <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 rounded-full text-xs font-medium text-emerald-700 dark:text-emerald-300">
        <Globe className="w-3.5 h-3.5" />
        Fuente: BCN (datos en vivo)
      </div>
    );
  }

  return (
    <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-full text-xs font-medium text-amber-700 dark:text-amber-300">
      <Database className="w-3.5 h-3.5" />
      Fuente: Datos de referencia
    </div>
  );
}

// ─── Pagina Principal ───────────────────────────────────────────────────────

export default function LeyesPage() {
  const [busqueda, setBusqueda] = useState("");
  const [filtroTipo, setFiltroTipo] = useState<TipoNorma | "">("");
  const [filtroEstado, setFiltroEstado] = useState<EstadoNorma | "">("");
  const [mostrarFiltros, setMostrarFiltros] = useState(false);
  const [leyes, setLeyes] = useState<Ley[]>([]);
  const [loading, setLoading] = useState(false);
  const [source, setSource] = useState<"real" | "mock" | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [buscado, setBuscado] = useState(false);

  const buscarLeyes = useCallback(async (query: string) => {
    if (!query.trim()) {
      setLeyes([]);
      setSource(null);
      setBuscado(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/scraping/bcn", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ accion: "buscarLey", query: query.trim() }),
      });

      if (!response.ok) {
        throw new Error(`Error ${response.status}`);
      }

      const json = await response.json();
      setLeyes(json.data?.leyes || []);
      setSource(json.source || json.data?.source || "mock");
      setBuscado(true);
    } catch (err) {
      console.error("Error buscando leyes:", err);
      setError("Error al buscar leyes. Intente nuevamente.");
    } finally {
      setLoading(false);
    }
  }, []);

  // Cargar datos iniciales
  useEffect(() => {
    buscarLeyes("ley");
  }, [buscarLeyes]);

  // Buscar con debounce cuando cambia el texto
  useEffect(() => {
    if (!busqueda.trim()) return;

    const timer = setTimeout(() => {
      buscarLeyes(busqueda);
    }, 500);

    return () => clearTimeout(timer);
  }, [busqueda, buscarLeyes]);

  // Filtrar localmente por tipo y estado
  const leyesFiltradas = leyes.filter((ley) => {
    const matchTipo = !filtroTipo || ley.tipo === filtroTipo;
    const matchEstado = !filtroEstado || ley.estado === filtroEstado;
    return matchTipo && matchEstado;
  });

  const tiposDisponibles: TipoNorma[] = ["Ley", "Decreto", "DFL", "DS", "DL"];
  const estadosDisponibles: EstadoNorma[] = ["Vigente", "Derogada", "Modificada"];

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div>
        <div className="flex items-center gap-3 mb-1">
          <div className="p-2.5 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl shadow-lg shadow-emerald-500/20">
            <BookOpen className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Biblioteca Legal
            </h1>
            <p className="text-sm text-gray-500 dark:text-slate-400">
              Consulta de leyes, decretos y normativa vigente en Chile
            </p>
          </div>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-2xl shadow-sm p-5">
        <div className="flex items-center gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar por numero, titulo o contenido..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") buscarLeyes(busqueda);
              }}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
            />
          </div>
          <button
            onClick={() => buscarLeyes(busqueda || "ley")}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-xl text-sm font-semibold hover:from-emerald-700 hover:to-teal-700 transition-all shadow-md shadow-emerald-500/20 disabled:opacity-50"
          >
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Search className="w-4 h-4" />
            )}
            Buscar
          </button>
          <button
            onClick={() => setMostrarFiltros(!mostrarFiltros)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-medium transition-all ${
              mostrarFiltros || filtroTipo || filtroEstado
                ? "border-emerald-300 bg-emerald-50 text-emerald-700 dark:border-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-300"
                : "border-gray-300 text-gray-600 hover:bg-gray-50 dark:border-slate-600 dark:text-slate-400 dark:hover:bg-slate-800"
            }`}
          >
            <Filter className="w-4 h-4" />
            Filtros
            {(filtroTipo || filtroEstado) && (
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
            )}
          </button>
        </div>

        {mostrarFiltros && (
          <div className="mt-4 pt-4 border-t border-gray-200 dark:border-slate-700">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-600 dark:text-slate-400 mb-1.5">
                  <Tag className="w-3.5 h-3.5 inline mr-1" />
                  Tipo de Norma
                </label>
                <select
                  value={filtroTipo}
                  onChange={(e) => setFiltroTipo(e.target.value as TipoNorma | "")}
                  className="w-full px-3 py-2.5 rounded-xl border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
                >
                  <option value="">Todos los tipos</option>
                  {tiposDisponibles.map((t) => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 dark:text-slate-400 mb-1.5">
                  <FileText className="w-3.5 h-3.5 inline mr-1" />
                  Estado
                </label>
                <select
                  value={filtroEstado}
                  onChange={(e) => setFiltroEstado(e.target.value as EstadoNorma | "")}
                  className="w-full px-3 py-2.5 rounded-xl border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
                >
                  <option value="">Todos los estados</option>
                  {estadosDisponibles.map((e) => (
                    <option key={e} value={e}>{e}</option>
                  ))}
                </select>
              </div>
            </div>
            {(filtroTipo || filtroEstado) && (
              <button
                onClick={() => {
                  setFiltroTipo("");
                  setFiltroEstado("");
                }}
                className="mt-3 text-xs text-emerald-600 dark:text-emerald-400 hover:underline font-medium"
              >
                Limpiar filtros
              </button>
            )}
          </div>
        )}
      </div>

      {/* Source indicator + Results Count */}
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-3">
          <p className="text-sm text-gray-500 dark:text-slate-400">
            {loading
              ? "Buscando..."
              : `${leyesFiltradas.length} ${leyesFiltradas.length === 1 ? "resultado" : "resultados"} encontrados`}
          </p>
          <IndicadorFuente source={source} />
        </div>
        {busqueda && (
          <button
            onClick={() => {
              setBusqueda("");
              setFiltroTipo("");
              setFiltroEstado("");
              setLeyes([]);
              setSource(null);
              setBuscado(false);
            }}
            className="text-xs text-gray-500 dark:text-slate-400 hover:text-gray-700 dark:hover:text-slate-200 font-medium"
          >
            Limpiar busqueda
          </button>
        )}
      </div>

      {/* Error */}
      {error && (
        <div className="flex items-center gap-3 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl">
          <AlertCircle className="w-5 h-5 text-red-500 shrink-0" />
          <p className="text-sm text-red-700 dark:text-red-300">{error}</p>
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div className="flex items-center justify-center py-16">
          <div className="text-center">
            <Loader2 className="w-8 h-8 text-emerald-500 animate-spin mx-auto mb-3" />
            <p className="text-sm text-gray-500 dark:text-slate-400">Consultando BCN / LeyChile...</p>
          </div>
        </div>
      )}

      {/* Results List */}
      {!loading && leyesFiltradas.length > 0 && (
        <div className="space-y-3">
          {leyesFiltradas.map((ley) => (
            <TarjetaLey key={ley.id} ley={ley} />
          ))}
        </div>
      )}

      {/* Empty state */}
      {!loading && leyesFiltradas.length === 0 && buscado && (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="p-4 bg-gray-100 dark:bg-slate-800 rounded-2xl mb-4">
            <BookOpen className="w-10 h-10 text-gray-400 dark:text-slate-500" />
          </div>
          <h3 className="text-lg font-semibold text-gray-700 dark:text-slate-300 mb-1">
            Sin resultados
          </h3>
          <p className="text-sm text-gray-500 dark:text-slate-400 max-w-md">
            No se encontraron leyes que coincidan con los criterios de busqueda. Intente con otros terminos o ajuste los filtros.
          </p>
        </div>
      )}

      {/* Initial state */}
      {!loading && !buscado && leyes.length === 0 && (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="p-4 bg-gray-100 dark:bg-slate-800 rounded-2xl mb-4">
            <Search className="w-10 h-10 text-gray-400 dark:text-slate-500" />
          </div>
          <h3 className="text-lg font-semibold text-gray-700 dark:text-slate-300 mb-1">
            Buscar en la Biblioteca Legal
          </h3>
          <p className="text-sm text-gray-500 dark:text-slate-400 max-w-md">
            Ingrese un termino de busqueda para consultar leyes, decretos y normativa chilena directamente desde la BCN.
          </p>
        </div>
      )}
    </div>
  );
}
