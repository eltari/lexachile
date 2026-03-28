"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import {
  Search,
  Plus,
  LayoutGrid,
  List,
  Phone,
  Mail,
  Scale,
  Building2,
  User,
  Loader2,
} from "lucide-react";
import { formatRut } from "@/lib/utils";

interface ClienteAPI {
  id: string;
  tipo: "natural" | "juridica";
  nombre: string;
  rut: string;
  email: string | null;
  telefono: string | null;
  ciudad: string | null;
  _count: { causas: number };
}

export default function ClientesPage() {
  const [search, setSearch] = useState("");
  const [filtroTipo, setFiltroTipo] = useState<"" | "natural" | "juridica">("");
  const [viewMode, setViewMode] = useState<"grid" | "table">("grid");

  const [clientes, setClientes] = useState<ClienteAPI[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchClientes = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const params = new URLSearchParams();
      if (search) params.set("search", search);
      if (filtroTipo) params.set("tipo", filtroTipo);
      params.set("limit", "100");

      const res = await fetch(`/api/clientes?${params.toString()}`);
      if (!res.ok) throw new Error("Error al cargar los clientes");
      const json = await res.json();
      setClientes(json.data || []);
      setTotal(json.pagination?.total || 0);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error desconocido");
    } finally {
      setLoading(false);
    }
  }, [search, filtroTipo]);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchClientes();
    }, search ? 300 : 0);
    return () => clearTimeout(timer);
  }, [fetchClientes, search]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Clientes</h1>
          <p className="mt-1 text-sm text-gray-500">
            {total} cliente{total !== 1 ? "s" : ""}{" "}
            registrado{total !== 1 ? "s" : ""}
          </p>
        </div>
        <Link
          href="/clientes/nuevo"
          className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors shadow-sm"
        >
          <Plus className="w-4 h-4" />
          Nuevo Cliente
        </Link>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar por nombre, RUT o email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white transition-shadow"
          />
        </div>
        <select
          value={filtroTipo}
          onChange={(e) =>
            setFiltroTipo(e.target.value as "" | "natural" | "juridica")
          }
          className="px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white"
        >
          <option value="">Todos los tipos</option>
          <option value="natural">Persona Natural</option>
          <option value="juridica">Persona Jurídica</option>
        </select>
        <div className="flex border border-gray-300 rounded-lg overflow-hidden">
          <button
            onClick={() => setViewMode("grid")}
            className={`p-2.5 transition-colors ${
              viewMode === "grid"
                ? "bg-blue-600 text-white"
                : "bg-white text-gray-500 hover:bg-gray-50"
            }`}
          >
            <LayoutGrid className="w-4 h-4" />
          </button>
          <button
            onClick={() => setViewMode("table")}
            className={`p-2.5 transition-colors border-l border-gray-300 ${
              viewMode === "table"
                ? "bg-blue-600 text-white"
                : "bg-white text-gray-500 hover:bg-gray-50"
            }`}
          >
            <List className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
          {error}
        </div>
      )}

      {/* Content */}
      {loading ? (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-12 text-center">
          <Loader2 className="w-8 h-8 text-blue-500 mx-auto mb-3 animate-spin" />
          <p className="text-gray-500 text-sm">Cargando clientes...</p>
        </div>
      ) : clientes.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-12 text-center">
          <User className="w-10 h-10 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500 font-medium">
            No se encontraron clientes
          </p>
          <p className="text-gray-400 text-xs mt-1">
            Intenta con otros criterios de búsqueda
          </p>
        </div>
      ) : viewMode === "grid" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {clientes.map((cliente) => (
            <Link
              key={cliente.id}
              href={`/clientes/${cliente.id}`}
              className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 hover:border-blue-300 hover:shadow-md transition-all group"
            >
              <div className="flex items-start gap-4">
                <div
                  className={`w-11 h-11 rounded-full flex items-center justify-center flex-shrink-0 ${
                    cliente.tipo === "juridica"
                      ? "bg-purple-100"
                      : "bg-blue-100"
                  }`}
                >
                  {cliente.tipo === "juridica" ? (
                    <Building2
                      className={`w-5 h-5 ${
                        cliente.tipo === "juridica"
                          ? "text-purple-600"
                          : "text-blue-600"
                      }`}
                    />
                  ) : (
                    <User className="w-5 h-5 text-blue-600" />
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="text-sm font-semibold text-gray-900 group-hover:text-blue-600 transition-colors truncate">
                    {cliente.nombre}
                  </h3>
                  <p className="text-xs text-gray-500 mt-0.5 font-mono">
                    {formatRut(cliente.rut)}
                  </p>
                  <span
                    className={`inline-block mt-1.5 text-xs px-2 py-0.5 rounded-full font-medium ${
                      cliente.tipo === "juridica"
                        ? "bg-purple-50 text-purple-700"
                        : "bg-blue-50 text-blue-700"
                    }`}
                  >
                    {cliente.tipo === "juridica"
                      ? "Persona Jurídica"
                      : "Persona Natural"}
                  </span>
                </div>
              </div>
              <div className="mt-4 pt-3 border-t border-gray-100 space-y-2">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Mail className="w-3.5 h-3.5 text-gray-400" />
                  <span className="truncate">{cliente.email || "Sin email"}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Phone className="w-3.5 h-3.5 text-gray-400" />
                  <span>{cliente.telefono || "Sin teléfono"}</span>
                </div>
              </div>
              <div className="mt-3 pt-3 border-t border-gray-100 flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-sm text-gray-500">
                  <Scale className="w-3.5 h-3.5" />
                  <span>
                    {cliente._count.causas} causa{cliente._count.causas !== 1 ? "s" : ""}
                  </span>
                </div>
                <span className="text-xs text-gray-400">{cliente.ciudad || ""}</span>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="px-4 py-3 text-left font-semibold text-gray-600">
                  Nombre
                </th>
                <th className="px-4 py-3 text-left font-semibold text-gray-600">
                  RUT
                </th>
                <th className="px-4 py-3 text-left font-semibold text-gray-600 hidden md:table-cell">
                  Tipo
                </th>
                <th className="px-4 py-3 text-left font-semibold text-gray-600 hidden md:table-cell">
                  Email
                </th>
                <th className="px-4 py-3 text-left font-semibold text-gray-600 hidden lg:table-cell">
                  Teléfono
                </th>
                <th className="px-4 py-3 text-center font-semibold text-gray-600">
                  Causas
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {clientes.map((cliente) => (
                <tr
                  key={cliente.id}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="px-4 py-3.5">
                    <Link
                      href={`/clientes/${cliente.id}`}
                      className="font-medium text-gray-900 hover:text-blue-600"
                    >
                      {cliente.nombre}
                    </Link>
                  </td>
                  <td className="px-4 py-3.5 font-mono text-gray-600">
                    {formatRut(cliente.rut)}
                  </td>
                  <td className="px-4 py-3.5 hidden md:table-cell">
                    <span
                      className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                        cliente.tipo === "juridica"
                          ? "bg-purple-50 text-purple-700"
                          : "bg-blue-50 text-blue-700"
                      }`}
                    >
                      {cliente.tipo === "juridica" ? "Jurídica" : "Natural"}
                    </span>
                  </td>
                  <td className="px-4 py-3.5 hidden md:table-cell text-gray-600">
                    {cliente.email || "-"}
                  </td>
                  <td className="px-4 py-3.5 hidden lg:table-cell text-gray-600">
                    {cliente.telefono || "-"}
                  </td>
                  <td className="px-4 py-3.5 text-center">
                    <span className="inline-flex items-center justify-center w-7 h-7 bg-gray-100 rounded-full text-xs font-semibold text-gray-700">
                      {cliente._count.causas}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
