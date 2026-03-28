"use client";

import { use, useState, useEffect } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  User,
  Building2,
  Mail,
  Phone,
  MapPin,
  FileText,
  Scale,
  StickyNote,
  Send,
  Loader2,
} from "lucide-react";
import { formatRut, formatFechaCorta, estadosCausa } from "@/lib/utils";

type EstadoCausa = keyof typeof estadosCausa;

interface ClienteDetail {
  id: string;
  tipo: string;
  nombre: string;
  rut: string;
  email: string | null;
  telefono: string | null;
  direccion: string | null;
  comuna: string | null;
  ciudad: string | null;
  region: string | null;
  giro: string | null;
  representante: string | null;
  causas: Array<{
    id: string;
    rol: string;
    caratulado: string;
    materia: string;
    estado: EstadoCausa;
    tribunal: string;
    createdAt: string;
  }>;
  documentos: Array<{
    id: string;
    nombre: string;
    tipo: string;
    createdAt: string;
  }>;
  notas: Array<{
    id: string;
    contenido: string;
    createdAt: string;
    autor: { id: string; name: string };
  }>;
  _count: { causas: number; documentos: number; notas: number };
}

type Tab = "causas" | "documentos" | "notas";

export default function ClienteDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const [cliente, setCliente] = useState<ClienteDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState<Tab>("causas");
  const [nuevaNota, setNuevaNota] = useState("");
  const [savingNota, setSavingNota] = useState(false);
  const [session, setSession] = useState<{ user?: { id: string } } | null>(null);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      setError("");
      try {
        const [clienteRes, sessionRes] = await Promise.all([
          fetch(`/api/clientes/${id}`),
          fetch("/api/auth/session"),
        ]);
        if (!clienteRes.ok) {
          if (clienteRes.status === 404) throw new Error("Cliente no encontrado");
          throw new Error("Error al cargar el cliente");
        }
        const json = await clienteRes.json();
        setCliente(json.data);
        if (sessionRes.ok) {
          setSession(await sessionRes.json());
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Error desconocido");
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [id]);

  async function handleAddNote(e: React.FormEvent) {
    e.preventDefault();
    if (!nuevaNota.trim() || !session?.user?.id) return;
    setSavingNota(true);
    try {
      const res = await fetch("/api/notas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contenido: nuevaNota.trim(),
          clienteId: id,
          autorId: session.user.id,
        }),
      });
      if (!res.ok) throw new Error("Error al guardar la nota");
      const json = await res.json();
      setCliente((prev) =>
        prev
          ? {
              ...prev,
              notas: [json.data, ...prev.notas],
              _count: { ...prev._count, notas: prev._count.notas + 1 },
            }
          : prev
      );
      setNuevaNota("");
    } catch {
      alert("Error al guardar la nota");
    } finally {
      setSavingNota(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <Loader2 className="w-8 h-8 text-blue-500 mx-auto mb-3 animate-spin" />
          <p className="text-gray-500 text-sm">Cargando cliente...</p>
        </div>
      </div>
    );
  }

  if (error || !cliente) {
    return (
      <div className="space-y-6">
        <Link
          href="/clientes"
          className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Volver a Clientes
        </Link>
        <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
          <p className="text-red-700 font-medium">{error || "Cliente no encontrado"}</p>
        </div>
      </div>
    );
  }

  const tabs: { key: Tab; label: string; icon: React.ReactNode; count: number }[] = [
    {
      key: "causas",
      label: "Causas",
      icon: <Scale className="w-4 h-4" />,
      count: cliente._count.causas,
    },
    {
      key: "documentos",
      label: "Documentos",
      icon: <FileText className="w-4 h-4" />,
      count: cliente._count.documentos,
    },
    {
      key: "notas",
      label: "Notas",
      icon: <StickyNote className="w-4 h-4" />,
      count: cliente._count.notas,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Back */}
      <Link
        href="/clientes"
        className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Volver a Clientes
      </Link>

      {/* Client Header */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
        <div className="flex items-start gap-5">
          <div
            className={`w-14 h-14 rounded-full flex items-center justify-center flex-shrink-0 ${
              cliente.tipo === "juridica" ? "bg-purple-100" : "bg-blue-100"
            }`}
          >
            {cliente.tipo === "juridica" ? (
              <Building2 className="w-7 h-7 text-purple-600" />
            ) : (
              <User className="w-7 h-7 text-blue-600" />
            )}
          </div>
          <div className="flex-1">
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
              <h1 className="text-2xl font-bold text-gray-900">
                {cliente.nombre}
              </h1>
              <span
                className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${
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
            <p className="text-sm text-gray-500 font-mono mt-1">
              RUT: {formatRut(cliente.rut)}
            </p>
          </div>
        </div>
      </div>

      {/* Info + Tabs */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Contact Info */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 space-y-4">
            <h2 className="text-sm font-semibold text-gray-900 uppercase tracking-wider">
              Información de Contacto
            </h2>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                  <Mail className="w-4 h-4 text-gray-500" />
                </div>
                <div>
                  <p className="text-xs text-gray-500">Email</p>
                  <p className="text-sm text-gray-900">{cliente.email || "No registrado"}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                  <Phone className="w-4 h-4 text-gray-500" />
                </div>
                <div>
                  <p className="text-xs text-gray-500">Teléfono</p>
                  <p className="text-sm text-gray-900">{cliente.telefono || "No registrado"}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center mt-0.5">
                  <MapPin className="w-4 h-4 text-gray-500" />
                </div>
                <div>
                  <p className="text-xs text-gray-500">Dirección</p>
                  <p className="text-sm text-gray-900">{cliente.direccion || "No registrada"}</p>
                  {(cliente.comuna || cliente.ciudad || cliente.region) && (
                    <p className="text-xs text-gray-500 mt-0.5">
                      {[cliente.comuna, cliente.ciudad, cliente.region ? `Región ${cliente.region}` : null]
                        .filter(Boolean)
                        .join(", ")}
                    </p>
                  )}
                </div>
              </div>
            </div>
            {cliente.tipo === "juridica" && (
              <div className="pt-3 border-t border-gray-100 space-y-2">
                {cliente.giro && (
                  <div>
                    <p className="text-xs text-gray-500">Giro</p>
                    <p className="text-sm text-gray-900">{cliente.giro}</p>
                  </div>
                )}
                {cliente.representante && (
                  <div>
                    <p className="text-xs text-gray-500">Representante Legal</p>
                    <p className="text-sm text-gray-900">
                      {cliente.representante}
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Tabs */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            {/* Tab headers */}
            <div className="flex border-b border-gray-200">
              {tabs.map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`flex items-center gap-2 px-5 py-3.5 text-sm font-medium border-b-2 transition-colors ${
                    activeTab === tab.key
                      ? "border-blue-600 text-blue-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  {tab.icon}
                  {tab.label}
                  <span
                    className={`ml-1 text-xs px-1.5 py-0.5 rounded-full ${
                      activeTab === tab.key
                        ? "bg-blue-100 text-blue-600"
                        : "bg-gray-100 text-gray-500"
                    }`}
                  >
                    {tab.count}
                  </span>
                </button>
              ))}
            </div>

            {/* Tab content */}
            <div className="p-5">
              {activeTab === "causas" && (
                <div className="space-y-3">
                  {cliente.causas.length === 0 ? (
                    <p className="text-sm text-gray-400 text-center py-4">Sin causas asociadas</p>
                  ) : (
                    cliente.causas.map((causa) => {
                      const estado = estadosCausa[causa.estado] || { label: causa.estado, color: "bg-gray-100 text-gray-800" };
                      return (
                        <Link
                          key={causa.id}
                          href={`/causas/${causa.id}`}
                          className="flex items-center justify-between p-4 rounded-lg border border-gray-100 hover:border-blue-200 hover:bg-blue-50/30 transition-all group"
                        >
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-mono font-semibold text-sm text-blue-600 group-hover:text-blue-800">
                                {causa.rol}
                              </span>
                              <span
                                className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${estado.color}`}
                              >
                                {estado.label}
                              </span>
                            </div>
                            <p className="text-sm text-gray-700 mt-1">
                              {causa.caratulado}
                            </p>
                            <p className="text-xs text-gray-500 mt-0.5">
                              {causa.materia} &middot; {causa.tribunal}
                            </p>
                          </div>
                          <span className="text-xs text-gray-400">
                            {formatFechaCorta(causa.createdAt)}
                          </span>
                        </Link>
                      );
                    })
                  )}
                </div>
              )}

              {activeTab === "documentos" && (
                <div className="divide-y divide-gray-100">
                  {cliente.documentos.length === 0 ? (
                    <p className="text-sm text-gray-400 text-center py-4">Sin documentos asociados</p>
                  ) : (
                    cliente.documentos.map((doc) => (
                      <div
                        key={doc.id}
                        className="flex items-center justify-between py-3 group"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 bg-gray-100 rounded-lg flex items-center justify-center group-hover:bg-blue-50 transition-colors">
                            <FileText className="w-4 h-4 text-gray-500 group-hover:text-blue-600 transition-colors" />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-900">
                              {doc.nombre}
                            </p>
                            <p className="text-xs text-gray-500">
                              {doc.tipo} &middot; {formatFechaCorta(doc.createdAt)}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}

              {activeTab === "notas" && (
                <div className="space-y-4">
                  {/* Add note form */}
                  <form
                    onSubmit={handleAddNote}
                    className="flex gap-2"
                  >
                    <input
                      type="text"
                      value={nuevaNota}
                      onChange={(e) => setNuevaNota(e.target.value)}
                      placeholder="Agregar una nota..."
                      className="flex-1 px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-shadow"
                    />
                    <button
                      type="submit"
                      disabled={!nuevaNota.trim() || savingNota}
                      className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      {savingNota ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                    </button>
                  </form>

                  {/* Notes list */}
                  <div className="space-y-3">
                    {cliente.notas.length === 0 ? (
                      <p className="text-sm text-gray-400 text-center py-4">Sin notas</p>
                    ) : (
                      cliente.notas.map((nota) => (
                        <div
                          key={nota.id}
                          className="p-4 bg-amber-50 rounded-lg border border-amber-100"
                        >
                          <p className="text-sm text-gray-800">
                            {nota.contenido}
                          </p>
                          <div className="flex items-center gap-2 mt-2 text-xs text-gray-500">
                            <span className="font-medium">{nota.autor?.name || "Usuario"}</span>
                            <span>&middot;</span>
                            <span>{formatFechaCorta(nota.createdAt)}</span>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
