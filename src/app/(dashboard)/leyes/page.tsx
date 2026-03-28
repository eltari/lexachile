"use client";

import { useState, useMemo } from "react";
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

// ─── Mock Data ──────────────────────────────────────────────────────────────

const mockLeyes: Ley[] = [
  {
    id: "1",
    numero: "20.720",
    titulo: "Ley de Reorganización y Liquidación de Empresas y Personas",
    tipo: "Ley",
    fechaPublicacion: "2014-01-09",
    fechaPromulgacion: "2013-12-30",
    estado: "Vigente",
    organismo: "Ministerio de Economía",
    urlBCN: "https://www.bcn.cl/leychile/navegar?idNorma=1058072",
    resumen: "Sustituye el régimen concursal vigente por una ley de reorganización y liquidación de activos de empresas y personas, y perfecciona el rol de la superintendencia del ramo.",
  },
  {
    id: "2",
    numero: "21.595",
    titulo: "Ley de Delitos Económicos",
    tipo: "Ley",
    fechaPublicacion: "2023-08-17",
    fechaPromulgacion: "2023-08-11",
    estado: "Vigente",
    organismo: "Ministerio de Justicia",
    urlBCN: "https://www.bcn.cl/leychile/navegar?idNorma=1197185",
    resumen: "Sistematiza los delitos económicos y atentados contra el medio ambiente, regula las penas accesorias, modifica diversos cuerpos legales que establecen delitos de carácter económico.",
  },
  {
    id: "3",
    numero: "19.968",
    titulo: "Ley que crea los Tribunales de Familia",
    tipo: "Ley",
    fechaPublicacion: "2004-08-30",
    fechaPromulgacion: "2004-08-25",
    estado: "Vigente",
    organismo: "Ministerio de Justicia",
    urlBCN: "https://www.bcn.cl/leychile/navegar?idNorma=229557",
    resumen: "Crea los tribunales de familia, establece su competencia, organización y procedimientos aplicables ante dichos tribunales.",
  },
  {
    id: "4",
    numero: "20.393",
    titulo: "Responsabilidad Penal de las Personas Jurídicas",
    tipo: "Ley",
    fechaPublicacion: "2009-12-02",
    fechaPromulgacion: "2009-11-25",
    estado: "Vigente",
    organismo: "Ministerio de Justicia",
    urlBCN: "https://www.bcn.cl/leychile/navegar?idNorma=1008668",
    resumen: "Establece la responsabilidad penal de las personas jurídicas en los delitos de lavado de activos, financiamiento del terrorismo y cohecho a funcionario público.",
  },
  {
    id: "5",
    numero: "18.010",
    titulo: "Ley sobre Operaciones de Crédito de Dinero",
    tipo: "Ley",
    fechaPublicacion: "1981-06-27",
    fechaPromulgacion: "1981-06-23",
    estado: "Vigente",
    organismo: "Ministerio de Hacienda",
    urlBCN: "https://www.bcn.cl/leychile/navegar?idNorma=29528",
    resumen: "Regula las operaciones de crédito de dinero, establece los intereses máximos convencionales y las sanciones por usura.",
  },
  {
    id: "6",
    numero: "19.496",
    titulo: "Ley de Protección de los Derechos de los Consumidores",
    tipo: "Ley",
    fechaPublicacion: "1997-03-07",
    fechaPromulgacion: "1997-02-28",
    estado: "Vigente",
    organismo: "Ministerio de Economía",
    urlBCN: "https://www.bcn.cl/leychile/navegar?idNorma=61438",
    resumen: "Establece normas sobre protección de los derechos de los consumidores, regulando relaciones entre proveedores y consumidores, infracciones y sanciones.",
  },
  {
    id: "7",
    numero: "20.609",
    titulo: "Ley Zamudio — Establece Medidas contra la Discriminación",
    tipo: "Ley",
    fechaPublicacion: "2012-07-24",
    fechaPromulgacion: "2012-07-12",
    estado: "Vigente",
    organismo: "Ministerio Secretaría General de Gobierno",
    urlBCN: "https://www.bcn.cl/leychile/navegar?idNorma=1042092",
    resumen: "Establece medidas contra la discriminación arbitraria, define la acción de no discriminación y establece un procedimiento especial para su tramitación.",
  },
  {
    id: "8",
    numero: "19.947",
    titulo: "Ley de Matrimonio Civil",
    tipo: "Ley",
    fechaPublicacion: "2004-05-17",
    fechaPromulgacion: "2004-05-07",
    estado: "Modificada",
    organismo: "Ministerio de Justicia",
    urlBCN: "https://www.bcn.cl/leychile/navegar?idNorma=225128",
    resumen: "Establece nueva ley de matrimonio civil, regulando la celebración del matrimonio, la separación judicial y el divorcio.",
  },
  {
    id: "9",
    numero: "21.430",
    titulo: "Ley sobre Garantías y Protección Integral de los Derechos de la Niñez y Adolescencia",
    tipo: "Ley",
    fechaPublicacion: "2022-03-15",
    fechaPromulgacion: "2022-03-10",
    estado: "Vigente",
    organismo: "Ministerio de Desarrollo Social",
    urlBCN: "https://www.bcn.cl/leychile/navegar?idNorma=1173643",
    resumen: "Tiene por objeto la garantía y protección integral de los derechos de los niños, niñas y adolescentes que se encuentren en el territorio nacional.",
  },
  {
    id: "10",
    numero: "18.046",
    titulo: "Ley sobre Sociedades Anónimas",
    tipo: "Ley",
    fechaPublicacion: "1981-10-22",
    fechaPromulgacion: "1981-10-20",
    estado: "Derogada",
    organismo: "Ministerio de Hacienda",
    urlBCN: "https://www.bcn.cl/leychile/navegar?idNorma=29473",
    resumen: "Establece las normas sobre sociedades anónimas abiertas y cerradas, su constitución, administración, juntas de accionistas y disolución. (Derogada por Ley 21.XXX).",
  },
];

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
              <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${tipoColor[ley.tipo]}`}>
                {ley.tipo} N° {ley.numero}
              </span>
              <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${estadoColor[ley.estado]}`}>
                {ley.estado === "Vigente" && <Check className="w-3 h-3 inline mr-0.5" />}
                {ley.estado === "Derogada" && <X className="w-3 h-3 inline mr-0.5" />}
                {ley.estado}
              </span>
            </div>
            <h3 className="text-base font-semibold text-gray-900 dark:text-white leading-snug">
              {ley.titulo}
            </h3>
            <div className="flex items-center gap-4 mt-2 text-xs text-gray-500 dark:text-slate-400">
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" />
                {new Date(ley.fechaPublicacion).toLocaleDateString("es-CL", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                })}
              </span>
              <span className="flex items-center gap-1">
                <Scale className="w-3.5 h-3.5" />
                {ley.organismo}
              </span>
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
          <div className="bg-gray-50 dark:bg-slate-800/50 rounded-xl p-4 mb-4">
            <h4 className="text-xs font-semibold text-gray-500 dark:text-slate-400 uppercase tracking-wider mb-2">
              Resumen
            </h4>
            <p className="text-sm text-gray-700 dark:text-slate-300 leading-relaxed">
              {ley.resumen}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
            <div>
              <p className="text-xs text-gray-500 dark:text-slate-400">Fecha de Promulgación</p>
              <p className="font-medium text-gray-900 dark:text-white">
                {new Date(ley.fechaPromulgacion).toLocaleDateString("es-CL", {
                  day: "2-digit",
                  month: "long",
                  year: "numeric",
                })}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-500 dark:text-slate-400">Fecha de Publicación</p>
              <p className="font-medium text-gray-900 dark:text-white">
                {new Date(ley.fechaPublicacion).toLocaleDateString("es-CL", {
                  day: "2-digit",
                  month: "long",
                  year: "numeric",
                })}
              </p>
            </div>
          </div>

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

// ─── Página Principal ───────────────────────────────────────────────────────

export default function LeyesPage() {
  const [busqueda, setBusqueda] = useState("");
  const [filtroTipo, setFiltroTipo] = useState<TipoNorma | "">("");
  const [filtroEstado, setFiltroEstado] = useState<EstadoNorma | "">("");
  const [mostrarFiltros, setMostrarFiltros] = useState(false);

  const leyesFiltradas = useMemo(() => {
    return mockLeyes.filter((ley) => {
      const matchBusqueda =
        !busqueda ||
        ley.titulo.toLowerCase().includes(busqueda.toLowerCase()) ||
        ley.numero.includes(busqueda) ||
        ley.resumen.toLowerCase().includes(busqueda.toLowerCase());
      const matchTipo = !filtroTipo || ley.tipo === filtroTipo;
      const matchEstado = !filtroEstado || ley.estado === filtroEstado;
      return matchBusqueda && matchTipo && matchEstado;
    });
  }, [busqueda, filtroTipo, filtroEstado]);

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
              placeholder="Buscar por número, título o contenido..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
            />
          </div>
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

      {/* Results Count */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-500 dark:text-slate-400">
          {leyesFiltradas.length} {leyesFiltradas.length === 1 ? "resultado" : "resultados"} encontrados
        </p>
        {busqueda && (
          <button
            onClick={() => {
              setBusqueda("");
              setFiltroTipo("");
              setFiltroEstado("");
            }}
            className="text-xs text-gray-500 dark:text-slate-400 hover:text-gray-700 dark:hover:text-slate-200 font-medium"
          >
            Limpiar búsqueda
          </button>
        )}
      </div>

      {/* Results List */}
      {leyesFiltradas.length > 0 ? (
        <div className="space-y-3">
          {leyesFiltradas.map((ley) => (
            <TarjetaLey key={ley.id} ley={ley} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="p-4 bg-gray-100 dark:bg-slate-800 rounded-2xl mb-4">
            <BookOpen className="w-10 h-10 text-gray-400 dark:text-slate-500" />
          </div>
          <h3 className="text-lg font-semibold text-gray-700 dark:text-slate-300 mb-1">
            Sin resultados
          </h3>
          <p className="text-sm text-gray-500 dark:text-slate-400 max-w-md">
            No se encontraron leyes que coincidan con los criterios de búsqueda. Intente con otros términos o ajuste los filtros.
          </p>
        </div>
      )}
    </div>
  );
}
