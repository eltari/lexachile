"use client";

import { use, useState } from "react";
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
  Plus,
  Send,
} from "lucide-react";
import { formatRut, formatFechaCorta, estadosCausa } from "@/lib/utils";

type EstadoCausa = keyof typeof estadosCausa;

const mockCliente = {
  id: "1",
  tipo: "natural" as string,
  nombre: "María González Soto",
  rut: "12345678-9",
  email: "m.gonzalez@gmail.com",
  telefono: "+56 9 8765 4321",
  direccion: "Av. Providencia 1234, Oficina 501",
  comuna: "Providencia",
  ciudad: "Santiago",
  region: "Metropolitana",
  giro: null,
  representante: null,
};

const mockCausas = [
  {
    id: "1",
    rol: "C-1234-2024",
    caratulado: "González con Pérez",
    materia: "Civil",
    estado: "en_tramitacion" as EstadoCausa,
    tribunal: "1° Juzgado Civil de Santiago",
    fechaIngreso: "2024-03-15",
  },
  {
    id: "2",
    rol: "F-567-2023",
    caratulado: "González con López",
    materia: "Familia",
    estado: "sentenciada" as EstadoCausa,
    tribunal: "Juzgado de Familia de Santiago",
    fechaIngreso: "2023-08-20",
  },
];

const mockDocumentos = [
  {
    id: "1",
    nombre: "Cédula de Identidad",
    tipo: "Identificación",
    fecha: "2024-01-10",
  },
  {
    id: "2",
    nombre: "Poder Simple",
    tipo: "Poder",
    fecha: "2024-03-14",
  },
  {
    id: "3",
    nombre: "Contrato de Prestación de Servicios",
    tipo: "Contrato",
    fecha: "2024-03-10",
  },
];

const mockNotas = [
  {
    id: "1",
    contenido:
      "Cliente solicita reunión urgente para revisar estado de causa civil. Disponible martes y jueves en la tarde.",
    autor: "Juan Tarifeno",
    fecha: "2024-09-10T14:30:00",
  },
  {
    id: "2",
    contenido:
      "Se envió informe de avance de causa por correo electrónico. Cliente conforme con el avance.",
    autor: "Juan Tarifeno",
    fecha: "2024-08-25T10:15:00",
  },
];

type Tab = "causas" | "documentos" | "notas";

export default function ClienteDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const cliente = mockCliente;
  const [activeTab, setActiveTab] = useState<Tab>("causas");
  const [nuevaNota, setNuevaNota] = useState("");

  const tabs: { key: Tab; label: string; icon: React.ReactNode; count: number }[] = [
    {
      key: "causas",
      label: "Causas",
      icon: <Scale className="w-4 h-4" />,
      count: mockCausas.length,
    },
    {
      key: "documentos",
      label: "Documentos",
      icon: <FileText className="w-4 h-4" />,
      count: mockDocumentos.length,
    },
    {
      key: "notas",
      label: "Notas",
      icon: <StickyNote className="w-4 h-4" />,
      count: mockNotas.length,
    },
  ];

  function handleAddNote(e: React.FormEvent) {
    e.preventDefault();
    if (!nuevaNota.trim()) return;
    alert("Nota agregada (demo)");
    setNuevaNota("");
  }

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
                  <p className="text-sm text-gray-900">{cliente.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                  <Phone className="w-4 h-4 text-gray-500" />
                </div>
                <div>
                  <p className="text-xs text-gray-500">Teléfono</p>
                  <p className="text-sm text-gray-900">{cliente.telefono}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center mt-0.5">
                  <MapPin className="w-4 h-4 text-gray-500" />
                </div>
                <div>
                  <p className="text-xs text-gray-500">Dirección</p>
                  <p className="text-sm text-gray-900">{cliente.direccion}</p>
                  <p className="text-xs text-gray-500 mt-0.5">
                    {cliente.comuna}, {cliente.ciudad} - Región{" "}
                    {cliente.region}
                  </p>
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
                  {mockCausas.map((causa) => {
                    const estado = estadosCausa[causa.estado];
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
                          {formatFechaCorta(causa.fechaIngreso)}
                        </span>
                      </Link>
                    );
                  })}
                </div>
              )}

              {activeTab === "documentos" && (
                <div className="divide-y divide-gray-100">
                  {mockDocumentos.map((doc) => (
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
                            {doc.tipo} &middot; {formatFechaCorta(doc.fecha)}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
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
                      disabled={!nuevaNota.trim()}
                      className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      <Send className="w-4 h-4" />
                    </button>
                  </form>

                  {/* Notes list */}
                  <div className="space-y-3">
                    {mockNotas.map((nota) => (
                      <div
                        key={nota.id}
                        className="p-4 bg-amber-50 rounded-lg border border-amber-100"
                      >
                        <p className="text-sm text-gray-800">
                          {nota.contenido}
                        </p>
                        <div className="flex items-center gap-2 mt-2 text-xs text-gray-500">
                          <span className="font-medium">{nota.autor}</span>
                          <span>&middot;</span>
                          <span>{formatFechaCorta(nota.fecha)}</span>
                        </div>
                      </div>
                    ))}
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
