"use client";

import { useState } from "react";
import Link from "next/link";
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
} from "lucide-react";

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

const causasDisponibles = [
  { id: "1", label: "C-1234-2026 - Gonzalez con Munoz" },
  { id: "2", label: "C-892-2025 - Perez con Inversiones SpA" },
  { id: "3", label: "L-456-2026 - Soto con Empresa Ltda." },
  { id: "4", label: "F-789-2026 - Rodriguez con Rodriguez" },
  { id: "5", label: "C-321-2026 - Lopez con Banco Nacional" },
];

const clientesDisponibles = [
  { id: "1", label: "Juan Carlos Gonzalez (12.345.678-9)" },
  { id: "2", label: "Roberto Perez (9.876.543-2)" },
  { id: "3", label: "Maria Lopez (15.432.876-K)" },
  { id: "4", label: "Carlos Rodriguez (8.765.432-1)" },
  { id: "5", label: "Ana Fuentes (16.543.987-3)" },
];

export default function NuevoDocumentoPage() {
  const [nombre, setNombre] = useState("");
  const [tipo, setTipo] = useState("");
  const [causaId, setCausaId] = useState("");
  const [clienteId, setClienteId] = useState("");
  const [contenido, setContenido] = useState("");
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    // Simulated save
    await new Promise((resolve) => setTimeout(resolve, 800));
    setSaving(false);
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
          <button className="inline-flex items-center gap-2 px-4 py-2.5 bg-gray-100 hover:bg-gray-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-gray-700 dark:text-slate-300 rounded-xl text-sm font-semibold transition-colors">
            <Download className="w-4 h-4" />
            Exportar PDF
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="inline-flex items-center gap-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-xl text-sm font-semibold shadow-sm shadow-blue-600/20 transition-colors"
          >
            <Save className="w-4 h-4" />
            {saving ? "Guardando..." : "Guardar"}
          </button>
        </div>
      </div>

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
            <select
              value={causaId}
              onChange={(e) => setCausaId(e.target.value)}
              className="w-full px-3 py-2.5 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Sin causa asociada</option>
              {causasDisponibles.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.label}
                </option>
              ))}
            </select>
          </div>

          {/* Linked Client */}
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-gray-200 dark:border-slate-800 shadow-sm p-4">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
              <User className="w-4 h-4 text-gray-400" />
              Cliente
            </h3>
            <select
              value={clienteId}
              onChange={(e) => setClienteId(e.target.value)}
              className="w-full px-3 py-2.5 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Sin cliente asociado</option>
              {clientesDisponibles.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.label}
                </option>
              ))}
            </select>
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
                  Alejandro Torres
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
