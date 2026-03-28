"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Save,
  Download,
  Bot,
  FileText,
  Scale,
  User,
  Calendar,
  Tag,
  Clock,
  Loader2,
} from "lucide-react";
import { exportDocumentoPDF } from "@/lib/export";

const tiposDocumento = [
  "Demanda",
  "Contestacion",
  "Recurso de Apelacion",
  "Recurso de Proteccion",
  "Contrato",
  "Poder",
  "Escritura",
  "Sentencia",
  "Otro",
];

interface CausaOption {
  id: string;
  rol: string;
  caratulado: string;
}

interface ClienteOption {
  id: string;
  nombre: string;
  rut: string;
}

export default function NuevoDocumentoPage() {
  const router = useRouter();
  const [nombre, setNombre] = useState("");
  const [tipo, setTipo] = useState("");
  const [causaId, setCausaId] = useState("");
  const [clienteId, setClienteId] = useState("");
  const [contenido, setContenido] = useState("");
  const [saving, setSaving] = useState(false);
  const [apiError, setApiError] = useState("");

  const [causasOptions, setCausasOptions] = useState<CausaOption[]>([]);
  const [clientesOptions, setClientesOptions] = useState<ClienteOption[]>([]);
  const [loadingOptions, setLoadingOptions] = useState(true);
  const [session, setSession] = useState<{ user?: { id: string; name?: string } } | null>(null);

  useEffect(() => {
    async function loadData() {
      try {
        const [causasRes, clientesRes, sessionRes] = await Promise.all([
          fetch("/api/causas?limit=100"),
          fetch("/api/clientes?limit=100"),
          fetch("/api/auth/session"),
        ]);

        if (causasRes.ok) {
          const json = await causasRes.json();
          setCausasOptions(
            (json.data || []).map((c: CausaOption) => ({
              id: c.id,
              rol: c.rol,
              caratulado: c.caratulado,
            }))
          );
        }
        if (clientesRes.ok) {
          const json = await clientesRes.json();
          setClientesOptions(
            (json.data || []).map((c: ClienteOption) => ({
              id: c.id,
              nombre: c.nombre,
              rut: c.rut,
            }))
          );
        }
        if (sessionRes.ok) {
          setSession(await sessionRes.json());
        }
      } catch {
        // Silently handle
      } finally {
        setLoadingOptions(false);
      }
    }
    loadData();
  }, []);

  const handleSave = async () => {
    if (!nombre.trim() || !tipo) {
      setApiError("El nombre y tipo son obligatorios");
      return;
    }
    setSaving(true);
    setApiError("");
    try {
      const res = await fetch("/api/documentos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nombre,
          tipo,
          contenido: contenido || undefined,
          causaId: causaId || undefined,
          clienteId: clienteId || undefined,
          autorId: session?.user?.id || "",
        }),
      });

      const json = await res.json();
      if (!res.ok) {
        setApiError(json.error || "Error al guardar el documento");
        setSaving(false);
        return;
      }

      router.push("/documentos");
    } catch {
      setApiError("Error de conexión al guardar");
      setSaving(false);
    }
  };

  const wordCount = contenido
    .trim()
    .split(/\s+/)
    .filter((w) => w.length > 0).length;
  const charCount = contenido.length;

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link
            href="/documentos"
            className="p-2 rounded-lg text-gray-500 hover:text-gray-900 hover:bg-gray-100 dark:text-slate-400 dark:hover:text-white dark:hover:bg-slate-800 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              {nombre || "Nuevo Documento"}
            </h1>
            <p className="text-sm text-gray-500 dark:text-slate-400 mt-0.5">
              Crea o edita un documento legal
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/ia-asistente"
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white rounded-xl text-sm font-semibold shadow-sm shadow-violet-600/20 transition-all"
          >
            <Bot className="w-4 h-4" />
            Generar con IA
          </Link>
          <button
            onClick={() => exportDocumentoPDF(nombre, contenido)}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-gray-100 hover:bg-gray-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-gray-700 dark:text-slate-300 rounded-xl text-sm font-semibold transition-colors"
          >
            <Download className="w-4 h-4" />
            Exportar PDF
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="inline-flex items-center gap-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-xl text-sm font-semibold shadow-sm shadow-blue-600/20 transition-colors"
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            {saving ? "Guardando..." : "Guardar"}
          </button>
        </div>
      </div>

      {/* API Error */}
      {apiError && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
          {apiError}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Editor Area */}
        <div className="lg:col-span-3 space-y-4">
          {/* Document Name */}
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-gray-200 dark:border-slate-800 shadow-sm p-4">
            <input
              type="text"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              placeholder="Nombre del documento..."
              className="w-full text-xl font-bold text-gray-900 dark:text-white bg-transparent border-none outline-none placeholder:text-gray-300 dark:placeholder:text-slate-600"
            />
          </div>

          {/* Rich Text Area */}
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-gray-200 dark:border-slate-800 shadow-sm">
            {/* Toolbar hint */}
            <div className="flex items-center gap-2 px-4 py-2.5 border-b border-gray-100 dark:border-slate-800">
              <span className="text-xs text-gray-400 dark:text-slate-500">
                Soporta formato Markdown: **negrita**, *cursiva*, # encabezados
              </span>
            </div>

            <textarea
              value={contenido}
              onChange={(e) => setContenido(e.target.value)}
              placeholder="Escribe el contenido del documento aqui...

Puedes usar formato Markdown:
# Titulo Principal
## Subtitulo
**texto en negrita**
*texto en cursiva*
- Lista de items
1. Lista numerada"
              rows={28}
              className="w-full px-6 py-4 bg-transparent text-sm text-gray-900 dark:text-white placeholder:text-gray-300 dark:placeholder:text-slate-600 outline-none resize-none font-mono leading-relaxed"
            />

            {/* Footer with word count */}
            <div className="flex items-center justify-between px-4 py-2.5 border-t border-gray-100 dark:border-slate-800">
              <div className="flex items-center gap-4">
                <span className="text-xs text-gray-400 dark:text-slate-500">
                  {wordCount} palabras
                </span>
                <span className="text-xs text-gray-400 dark:text-slate-500">
                  {charCount} caracteres
                </span>
              </div>
              <span className="text-xs text-gray-400 dark:text-slate-500">
                Guardado automatico activado
              </span>
            </div>
          </div>
        </div>

        {/* Sidebar - Metadata */}
        <div className="space-y-4">
          {/* Document Type */}
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-gray-200 dark:border-slate-800 shadow-sm p-4">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
              <Tag className="w-4 h-4 text-gray-400" />
              Tipo de Documento
            </h3>
            <select
              value={tipo}
              onChange={(e) => setTipo(e.target.value)}
              className="w-full px-3 py-2.5 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Seleccionar tipo...</option>
              {tiposDocumento.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>

          {/* Linked Causa */}
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-gray-200 dark:border-slate-800 shadow-sm p-4">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
              <Scale className="w-4 h-4 text-gray-400" />
              Causa Asociada
            </h3>
            {loadingOptions ? (
              <div className="flex items-center gap-2 py-2 text-sm text-gray-400">
                <Loader2 className="w-4 h-4 animate-spin" />
                Cargando...
              </div>
            ) : (
              <select
                value={causaId}
                onChange={(e) => setCausaId(e.target.value)}
                className="w-full px-3 py-2.5 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Sin causa asociada</option>
                {causasOptions.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.rol} - {c.caratulado}
                  </option>
                ))}
              </select>
            )}
          </div>

          {/* Linked Client */}
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-gray-200 dark:border-slate-800 shadow-sm p-4">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
              <User className="w-4 h-4 text-gray-400" />
              Cliente
            </h3>
            {loadingOptions ? (
              <div className="flex items-center gap-2 py-2 text-sm text-gray-400">
                <Loader2 className="w-4 h-4 animate-spin" />
                Cargando...
              </div>
            ) : (
              <select
                value={clienteId}
                onChange={(e) => setClienteId(e.target.value)}
                className="w-full px-3 py-2.5 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Sin cliente asociado</option>
                {clientesOptions.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.nombre} ({c.rut})
                  </option>
                ))}
              </select>
            )}
          </div>

          {/* Document Info */}
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-gray-200 dark:border-slate-800 shadow-sm p-4">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
              <FileText className="w-4 h-4 text-gray-400" />
              Informacion
            </h3>
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-500 dark:text-slate-400 flex items-center gap-1.5">
                  <Calendar className="w-3 h-3" />
                  Creado
                </span>
                <span className="text-xs font-medium text-gray-700 dark:text-slate-300">
                  {new Date().toLocaleDateString("es-CL")}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-500 dark:text-slate-400 flex items-center gap-1.5">
                  <Clock className="w-3 h-3" />
                  Modificado
                </span>
                <span className="text-xs font-medium text-gray-700 dark:text-slate-300">
                  {new Date().toLocaleDateString("es-CL")}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-500 dark:text-slate-400 flex items-center gap-1.5">
                  <User className="w-3 h-3" />
                  Autor
                </span>
                <span className="text-xs font-medium text-gray-700 dark:text-slate-300">
                  {session?.user?.name || "Usuario"}
                </span>
              </div>
            </div>
          </div>

          {/* Quick Templates */}
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-gray-200 dark:border-slate-800 shadow-sm p-4">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">
              Acciones Rapidas
            </h3>
            <div className="space-y-2">
              <Link
                href="/documentos/plantillas"
                className="w-full flex items-center gap-2 px-3 py-2.5 text-sm text-gray-700 dark:text-slate-300 bg-gray-50 dark:bg-slate-800 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
              >
                <FileText className="w-4 h-4 text-gray-400" />
                Usar Plantilla
              </Link>
              <Link
                href="/ia-asistente"
                className="w-full flex items-center gap-2 px-3 py-2.5 text-sm text-violet-700 dark:text-violet-300 bg-violet-50 dark:bg-violet-900/20 hover:bg-violet-100 dark:hover:bg-violet-900/30 rounded-lg transition-colors"
              >
                <Bot className="w-4 h-4" />
                Generar con IA
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
