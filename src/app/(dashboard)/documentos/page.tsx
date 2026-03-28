"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import {
  FileText,
  Plus,
  Bot,
  Search,
  FileSignature,
  ScrollText,
  Scale,
  BookTemplate,
  Download,
  MoreVertical,
  Calendar,
  User,
  Loader2,
} from "lucide-react";

type DocTipo = "escrito" | "contrato" | "sentencia" | "plantilla" | "otro";

interface DocumentoAPI {
  id: string;
  nombre: string;
  tipo: string;
  createdAt: string;
  causa?: { id: string; rol: string; caratulado: string } | null;
  cliente?: { id: string; nombre: string; rut: string } | null;
  autor?: { id: string; name: string } | null;
}

const tipoConfig: Record<
  DocTipo,
  { label: string; icon: typeof FileText; bg: string; text: string }
> = {
  escrito: {
    label: "Escrito",
    icon: FileSignature,
    bg: "bg-blue-50 dark:bg-blue-900/20",
    text: "text-blue-600 dark:text-blue-400",
  },
  contrato: {
    label: "Contrato",
    icon: ScrollText,
    bg: "bg-emerald-50 dark:bg-emerald-900/20",
    text: "text-emerald-600 dark:text-emerald-400",
  },
  sentencia: {
    label: "Sentencia",
    icon: Scale,
    bg: "bg-purple-50 dark:bg-purple-900/20",
    text: "text-purple-600 dark:text-purple-400",
  },
  plantilla: {
    label: "Plantilla",
    icon: BookTemplate,
    bg: "bg-amber-50 dark:bg-amber-900/20",
    text: "text-amber-600 dark:text-amber-400",
  },
  otro: {
    label: "Otro",
    icon: FileText,
    bg: "bg-gray-50 dark:bg-gray-900/20",
    text: "text-gray-600 dark:text-gray-400",
  },
};

const tabs = [
  { key: "todos", label: "Todos" },
  { key: "escrito", label: "Escritos" },
  { key: "contrato", label: "Contratos" },
  { key: "sentencia", label: "Sentencias" },
  { key: "plantilla", label: "Plantillas" },
];

export default function DocumentosPage() {
  const [activeTab, setActiveTab] = useState("todos");
  const [searchQuery, setSearchQuery] = useState("");
  const [documentos, setDocumentos] = useState<DocumentoAPI[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchDocumentos = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const params = new URLSearchParams();
      if (activeTab !== "todos") params.set("tipo", activeTab);
      if (searchQuery) params.set("search", searchQuery);
      params.set("limit", "50");

      const res = await fetch(`/api/documentos?${params.toString()}`);
      if (!res.ok) throw new Error("Error al cargar documentos");
      const json = await res.json();
      setDocumentos(json.data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error desconocido");
    } finally {
      setLoading(false);
    }
  }, [activeTab, searchQuery]);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchDocumentos();
    }, searchQuery ? 300 : 0);
    return () => clearTimeout(timer);
  }, [fetchDocumentos, searchQuery]);

  function getDocTipo(tipo: string): DocTipo {
    const lower = tipo.toLowerCase();
    if (lower.includes("escrito") || lower.includes("demanda") || lower.includes("recurso") || lower.includes("contestacion")) return "escrito";
    if (lower.includes("contrato") || lower.includes("escritura")) return "contrato";
    if (lower.includes("sentencia")) return "sentencia";
    if (lower.includes("plantilla")) return "plantilla";
    return "otro";
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Documentos y Escritos
          </h1>
          <p className="text-sm text-gray-500 dark:text-slate-400 mt-1">
            Gestiona todos tus documentos legales
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/ia-asistente"
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white rounded-xl text-sm font-semibold shadow-sm shadow-violet-600/20 transition-all"
          >
            <Bot className="w-4 h-4" />
            Generar con IA
          </Link>
          <Link
            href="/documentos/nuevo"
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-semibold shadow-sm shadow-blue-600/20 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Nuevo Documento
          </Link>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
          {error}
        </div>
      )}

      {/* Search + Tabs */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-gray-200 dark:border-slate-800 shadow-sm">
        <div className="p-4 border-b border-gray-100 dark:border-slate-800">
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar documentos por nombre, causa o cliente..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl text-sm text-gray-900 dark:text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Tab Bar */}
        <div className="flex items-center gap-1 px-4 pt-3 border-b border-gray-100 dark:border-slate-800">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`
                px-4 py-2.5 text-sm font-medium rounded-t-lg transition-colors relative
                ${
                  activeTab === tab.key
                    ? "text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20"
                    : "text-gray-500 dark:text-slate-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-slate-800"
                }
              `}
            >
              {tab.label}
              {activeTab === tab.key && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 dark:bg-blue-400 rounded-full" />
              )}
            </button>
          ))}
        </div>

        {/* Document Grid */}
        <div className="p-4">
          {loading ? (
            <div className="text-center py-12">
              <Loader2 className="w-8 h-8 text-blue-500 mx-auto mb-3 animate-spin" />
              <p className="text-sm text-gray-500">Cargando documentos...</p>
            </div>
          ) : documentos.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="w-12 h-12 text-gray-300 dark:text-slate-600 mx-auto mb-3" />
              <p className="text-sm text-gray-500 dark:text-slate-400">
                No se encontraron documentos
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {documentos.map((doc) => {
                const docTipo = getDocTipo(doc.tipo);
                const config = tipoConfig[docTipo];
                const Icon = config.icon;
                const causaLabel = doc.causa ? `${doc.causa.rol} - ${doc.causa.caratulado}` : undefined;
                const clienteLabel = doc.cliente?.nombre;
                return (
                  <Link
                    key={doc.id}
                    href={`/documentos/nuevo?id=${doc.id}`}
                    className="group bg-gray-50 dark:bg-slate-800/50 hover:bg-white dark:hover:bg-slate-800 border border-gray-200 dark:border-slate-700 hover:border-blue-300 dark:hover:border-blue-700 rounded-xl p-4 transition-all hover:shadow-md"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div
                        className={`w-10 h-10 rounded-lg flex items-center justify-center ${config.bg}`}
                      >
                        <Icon className={`w-5 h-5 ${config.text}`} />
                      </div>
                      <div className="flex items-center gap-1">
                        <span
                          className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${config.bg} ${config.text}`}
                        >
                          {config.label}
                        </span>
                        <button
                          onClick={(e) => e.preventDefault()}
                          className="p-1 rounded text-gray-400 hover:text-gray-600 dark:hover:text-slate-300 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <MoreVertical className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      {doc.nombre}
                    </h3>

                    <div className="space-y-1.5 mb-3">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-3 h-3 text-gray-400" />
                        <span className="text-xs text-gray-500 dark:text-slate-400">
                          {new Date(doc.createdAt).toLocaleDateString("es-CL")}
                        </span>
                      </div>
                      {causaLabel && (
                        <div className="flex items-center gap-1.5">
                          <Scale className="w-3 h-3 text-gray-400" />
                          <span className="text-xs text-gray-500 dark:text-slate-400 truncate">
                            {causaLabel}
                          </span>
                        </div>
                      )}
                      {clienteLabel && (
                        <div className="flex items-center gap-1.5">
                          <User className="w-3 h-3 text-gray-400" />
                          <span className="text-xs text-gray-500 dark:text-slate-400">
                            {clienteLabel}
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-gray-200 dark:border-slate-700">
                      <span className="text-xs text-gray-400 dark:text-slate-500">
                        {doc.tipo}
                      </span>
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                        }}
                        className="p-1.5 rounded-lg text-gray-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:text-blue-400 dark:hover:bg-blue-900/20 transition-colors opacity-0 group-hover:opacity-100"
                        title="Descargar"
                      >
                        <Download className="w-4 h-4" />
                      </button>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
