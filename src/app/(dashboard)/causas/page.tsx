"use client";

import { useState, useMemo } from "react";
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
} from "lucide-react";
import { estadosCausa, materias, tribunales, formatFechaCorta } from "@/lib/utils";

type EstadoCausa = keyof typeof estadosCausa;

interface Causa {
  id: string;
  rol: string;
  caratulado: string;
  materia: string;
  estado: EstadoCausa;
  tribunal: string;
  fechaIngreso: string;
  cliente: string;
}

const mockCausas: Causa[] = [
  {
    id: "1",
    rol: "C-1234-2024",
    caratulado: "González con Pérez",
    materia: "Civil",
    estado: "en_tramitacion",
    tribunal: "1° Juzgado Civil de Santiago",
    fechaIngreso: "2024-03-15",
    cliente: "María González Soto",
  },
  {
    id: "2",
    rol: "C-5678-2024",
    caratulado: "Muñoz con Banco Estado",
    materia: "Civil",
    estado: "ingresada",
    tribunal: "2° Juzgado Civil de Santiago",
    fechaIngreso: "2024-06-20",
    cliente: "Carlos Muñoz Reyes",
  },
  {
    id: "3",
    rol: "T-892-2024",
    caratulado: "Soto con Empresa ABC Ltda.",
    materia: "Laboral",
    estado: "en_tramitacion",
    tribunal: "1° Juzgado de Letras del Trabajo de Santiago",
    fechaIngreso: "2024-01-10",
    cliente: "Pedro Soto Vargas",
  },
  {
    id: "4",
    rol: "F-345-2023",
    caratulado: "Ramírez con Ramírez",
    materia: "Familia",
    estado: "sentenciada",
    tribunal: "Juzgado de Familia de Santiago",
    fechaIngreso: "2023-11-05",
    cliente: "Ana Ramírez López",
  },
  {
    id: "5",
    rol: "C-7890-2023",
    caratulado: "Inversiones Austral SpA con Lagos",
    materia: "Civil",
    estado: "archivada",
    tribunal: "3° Juzgado Civil de Santiago",
    fechaIngreso: "2023-05-18",
    cliente: "Inversiones Austral SpA",
  },
  {
    id: "6",
    rol: "P-2156-2024",
    caratulado: "Ministerio Público con Herrera",
    materia: "Penal",
    estado: "en_tramitacion",
    tribunal: "Juzgado de Garantía de Santiago",
    fechaIngreso: "2024-08-02",
    cliente: "Rodrigo Herrera Díaz",
  },
  {
    id: "7",
    rol: "L-432-2024",
    caratulado: "Constructora Pacífico S.A. con Serviu",
    materia: "Administrativo",
    estado: "ingresada",
    tribunal: "Corte de Apelaciones de Santiago",
    fechaIngreso: "2024-09-14",
    cliente: "Constructora Pacífico S.A.",
  },
  {
    id: "8",
    rol: "C-9012-2024",
    caratulado: "Transportes Andes Ltda. con SII",
    materia: "Tributario",
    estado: "en_tramitacion",
    tribunal: "Corte Suprema",
    fechaIngreso: "2024-04-25",
    cliente: "Transportes Andes Ltda.",
  },
];

const ITEMS_PER_PAGE = 5;

export default function CausasPage() {
  const [search, setSearch] = useState("");
  const [filtroMateria, setFiltroMateria] = useState("");
  const [filtroEstado, setFiltroEstado] = useState("");
  const [filtroTribunal, setFiltroTribunal] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);

  const filtered = useMemo(() => {
    return mockCausas.filter((c) => {
      const matchSearch =
        !search ||
        c.rol.toLowerCase().includes(search.toLowerCase()) ||
        c.caratulado.toLowerCase().includes(search.toLowerCase()) ||
        c.cliente.toLowerCase().includes(search.toLowerCase());
      const matchMateria = !filtroMateria || c.materia === filtroMateria;
      const matchEstado = !filtroEstado || c.estado === filtroEstado;
      const matchTribunal = !filtroTribunal || c.tribunal === filtroTribunal;
      return matchSearch && matchMateria && matchEstado && matchTribunal;
    });
  }, [search, filtroMateria, filtroEstado, filtroTribunal]);

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginated = filtered.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Gestión de Causas
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            {filtered.length} causa{filtered.length !== 1 ? "s" : ""}{" "}
            encontrada{filtered.length !== 1 ? "s" : ""}
          </p>
        </div>
        <Link
          href="/causas/nueva"
          className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors shadow-sm"
        >
          <Plus className="w-4 h-4" />
          Nueva Causa
        </Link>
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
              {paginated.length === 0 ? (
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
                paginated.map((causa) => {
                  const estado = estadosCausa[causa.estado];
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
                          {causa.cliente}
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
                        {formatFechaCorta(causa.fechaIngreso)}
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
                {Math.min(currentPage * ITEMS_PER_PAGE, filtered.length)}
              </span>{" "}
              de <span className="font-medium">{filtered.length}</span>{" "}
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
