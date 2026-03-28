"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import {
  Search,
  Plus,
  Filter,
  ChevronLeft,
  ChevronRight,
  Eye,
  Pencil,
  Trash2,
  Scale,
  Loader2,
  FileText,
  FileSpreadsheet,
  Download,
} from "lucide-react";
import { exportCausasPDF, exportCausasExcel } from "@/lib/export";
import { estadosCausa, materias, tribunales, formatFechaCorta } from "@/lib/utils";

type EstadoCausa = keyof typeof estadosCausa;

interface CausaAPI {
  id: string;
  rol: string;
  caratulado: string;
  materia: string;
  estado: EstadoCausa;
  tribunal: string;
  createdAt: string;
  cliente: { id: string; nombre: string; rut: string } | null;
  abogado: { id: string; name: string } | null;
}

const ITEMS_PER_PAGE = 10;

export default function CausasPage() {
  const [search, setSearch] = useState("");
  const [filtroMateria, setFiltroMateria] = useState("");
  const [filtroEstado, setFiltroEstado] = useState("");
  const [filtroTribunal, setFiltroTribunal] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);

  const [causas, setCausas] = useState<CausaAPI[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchCausas = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const params = new URLSearchParams();
      if (search) params.set("search", search);
      if (filtroMateria) params.set("materia", filtroMateria);
      if (filtroEstado) params.set("estado", filtroEstado);
      if (filtroTribunal) params.set("tribunal", filtroTribunal);
      params.set("page", String(currentPage));
      params.set("limit", String(ITEMS_PER_PAGE));

      const res = await fetch(`/api/causas?${params.toString()}`);
      if (!res.ok) throw new Error("Error al cargar las causas");
      const json = await res.json();
      setCausas(json.data || []);
      setTotal(json.pagination?.total || 0);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error desconocido");
    } finally {
      setLoading(false);
    }
  }, [search, filtroMateria, filtroEstado, filtroTribunal, currentPage]);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchCausas();
    }, search ? 300 : 0);
    return () => clearTimeout(timer);
  }, [fetchCausas, search]);

  const totalPages = Math.ceil(total / ITEMS_PER_PAGE);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Gestión de Causas
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            {total} causa{total !== 1 ? "s" : ""}{" "}
            encontrada{total !== 1 ? "s" : ""}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => exportCausasPDF(causas)}
            disabled={loading || causas.length === 0}
            className="inline-flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            title="Exportar a PDF"
          >
            <FileText className="w-4 h-4" />
            PDF
          </button>
          <button
            onClick={() => exportCausasExcel(causas)}
            disabled={loading || causas.length === 0}
            className="inline-flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            title="Exportar a Excel"
          >
            <FileSpreadsheet className="w-4 h-4" />
            Excel
          </button>
          <Link
            href="/causas/nueva"
            className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors shadow-sm"
          >
            <Plus className="w-4 h-4" />
            Nueva Causa
          </Link>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
        <div className="p-4 flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar por ROL, caratulado o cliente..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-shadow"
            />
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`inline-flex items-center gap-2 px-4 py-2.5 border rounded-lg text-sm font-medium transition-colors ${
              showFilters
                ? "bg-blue-50 border-blue-200 text-blue-700"
                : "border-gray-300 text-gray-700 hover:bg-gray-50"
            }`}
          >
            <Filter className="w-4 h-4" />
            Filtros
          </button>
        </div>

        {showFilters && (
          <div className="px-4 pb-4 grid grid-cols-1 sm:grid-cols-3 gap-3 border-t border-gray-100 pt-4">
            <select
              value={filtroMateria}
              onChange={(e) => {
                setFiltroMateria(e.target.value);
                setCurrentPage(1);
              }}
              className="px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            >
              <option value="">Todas las materias</option>
              {materias.map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>
            <select
              value={filtroEstado}
              onChange={(e) => {
                setFiltroEstado(e.target.value);
                setCurrentPage(1);
              }}
              className="px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            >
              <option value="">Todos los estados</option>
              {Object.entries(estadosCausa).map(([key, val]) => (
                <option key={key} value={key}>
                  {val.label}
                </option>
              ))}
            </select>
            <select
              value={filtroTribunal}
              onChange={(e) => {
                setFiltroTribunal(e.target.value);
                setCurrentPage(1);
              }}
              className="px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            >
              <option value="">Todos los tribunales</option>
              {tribunales.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="mx-4 mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
            {error}
          </div>
        )}

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-t border-gray-200 bg-gray-50">
                <th className="px-4 py-3 text-left font-semibold text-gray-600">
                  ROL
                </th>
                <th className="px-4 py-3 text-left font-semibold text-gray-600">
                  Caratulado
                </th>
                <th className="px-4 py-3 text-left font-semibold text-gray-600 hidden md:table-cell">
                  Materia
                </th>
                <th className="px-4 py-3 text-left font-semibold text-gray-600">
                  Estado
                </th>
                <th className="px-4 py-3 text-left font-semibold text-gray-600 hidden lg:table-cell">
                  Tribunal
                </th>
                <th className="px-4 py-3 text-left font-semibold text-gray-600 hidden md:table-cell">
                  Fecha
                </th>
                <th className="px-4 py-3 text-right font-semibold text-gray-600">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr>
                  <td colSpan={7} className="px-4 py-12 text-center">
                    <Loader2 className="w-8 h-8 text-blue-500 mx-auto mb-3 animate-spin" />
                    <p className="text-gray-500 text-sm">Cargando causas...</p>
                  </td>
                </tr>
              ) : causas.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-12 text-center">
                    <Scale className="w-10 h-10 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500 font-medium">
                      No se encontraron causas
                    </p>
                    <p className="text-gray-400 text-xs mt-1">
                      Intenta con otros filtros de búsqueda
                    </p>
                  </td>
                </tr>
              ) : (
                causas.map((causa) => {
                  const estado = estadosCausa[causa.estado] || { label: causa.estado, color: "bg-gray-100 text-gray-800" };
                  return (
                    <tr
                      key={causa.id}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-4 py-3.5">
                        <Link
                          href={`/causas/${causa.id}`}
                          className="font-mono font-semibold text-blue-600 hover:text-blue-800 hover:underline"
                        >
                          {causa.rol}
                        </Link>
                      </td>
                      <td className="px-4 py-3.5">
                        <div className="font-medium text-gray-900">
                          {causa.caratulado}
                        </div>
                        <div className="text-xs text-gray-500 mt-0.5">
                          {causa.cliente?.nombre || "Sin cliente"}
                        </div>
                      </td>
                      <td className="px-4 py-3.5 hidden md:table-cell text-gray-600">
                        {causa.materia}
                      </td>
                      <td className="px-4 py-3.5">
                        <span
                          className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${estado.color}`}
                        >
                          {estado.label}
                        </span>
                      </td>
                      <td className="px-4 py-3.5 hidden lg:table-cell text-gray-600 max-w-[200px] truncate">
                        {causa.tribunal}
                      </td>
                      <td className="px-4 py-3.5 hidden md:table-cell text-gray-500">
                        {formatFechaCorta(causa.createdAt)}
                      </td>
                      <td className="px-4 py-3.5">
                        <div className="flex items-center justify-end gap-1">
                          <Link
                            href={`/causas/${causa.id}`}
                            className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                            title="Ver detalle"
                          >
                            <Eye className="w-4 h-4" />
                          </Link>
                          <button
                            className="p-1.5 text-gray-400 hover:text-amber-600 hover:bg-amber-50 rounded-md transition-colors"
                            title="Editar"
                          >
                            <Pencil className="w-4 h-4" />
                          </button>
                          <button
                            className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
                            title="Eliminar"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-gray-200">
            <p className="text-sm text-gray-500">
              Mostrando{" "}
              <span className="font-medium">
                {(currentPage - 1) * ITEMS_PER_PAGE + 1}
              </span>{" "}
              a{" "}
              <span className="font-medium">
                {Math.min(currentPage * ITEMS_PER_PAGE, total)}
              </span>{" "}
              de <span className="font-medium">{total}</span>{" "}
              resultados
            </p>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="p-2 rounded-md border border-gray-300 text-gray-500 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (page) => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                      page === currentPage
                        ? "bg-blue-600 text-white"
                        : "text-gray-600 hover:bg-gray-100"
                    }`}
                  >
                    {page}
                  </button>
                )
              )}
              <button
                onClick={() =>
                  setCurrentPage((p) => Math.min(totalPages, p + 1))
                }
                disabled={currentPage === totalPages}
                className="p-2 rounded-md border border-gray-300 text-gray-500 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
