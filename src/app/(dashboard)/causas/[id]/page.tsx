"use client";

import { use } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Scale,
  Calendar,
  User,
  FileText,
  Clock,
  MapPin,
  DollarSign,
  ExternalLink,
  Download,
  ChevronRight,
} from "lucide-react";
import { estadosCausa, formatFecha, formatFechaCorta, formatCLP } from "@/lib/utils";

type EstadoCausa = keyof typeof estadosCausa;

interface Movimiento {
  id: string;
  tipo: string;
  descripcion: string;
  fecha: string;
  folio: string | null;
}

interface Documento {
  id: string;
  nombre: string;
  tipo: string;
  fecha: string;
}

interface Evento {
  id: string;
  titulo: string;
  fecha: string;
  tipo: string;
}

const mockCausa = {
  id: "1",
  rol: "C-1234-2024",
  rit: "C-1234-2024",
  ruc: null,
  caratulado: "González con Pérez",
  materia: "Civil",
  tipo: "Ordinario",
  estado: "en_tramitacion" as EstadoCausa,
  tribunal: "1° Juzgado Civil de Santiago",
  juez: "Sra. Patricia Morales Fuentes",
  fechaIngreso: "2024-03-15",
  fechaTermino: null,
  cuantia: 45000000,
  moneda: "CLP",
  observaciones: "Demanda por incumplimiento contractual. Cliente demandante.",
  cliente: {
    id: "1",
    nombre: "María González Soto",
    rut: "12.345.678-9",
  },
};

const mockMovimientos: Movimiento[] = [
  {
    id: "1",
    tipo: "Ingreso",
    descripcion: "Ingreso de demanda civil ordinaria",
    fecha: "2024-03-15",
    folio: "001",
  },
  {
    id: "2",
    tipo: "Resolución",
    descripcion: "Resolución: Téngase por interpuesta la demanda. Traslado.",
    fecha: "2024-03-22",
    folio: "005",
  },
  {
    id: "3",
    tipo: "Notificación",
    descripcion: "Notificación personal al demandado en domicilio registrado",
    fecha: "2024-04-05",
    folio: "012",
  },
  {
    id: "4",
    tipo: "Escrito",
    descripcion: "Contestación de la demanda por parte del demandado",
    fecha: "2024-04-20",
    folio: "018",
  },
  {
    id: "5",
    tipo: "Resolución",
    descripcion:
      "Resolución: Recíbase la causa a prueba. Fíjanse puntos de prueba.",
    fecha: "2024-05-10",
    folio: "025",
  },
];

const mockDocumentos: Documento[] = [
  {
    id: "1",
    nombre: "Demanda Civil Ordinaria",
    tipo: "Demanda",
    fecha: "2024-03-14",
  },
  {
    id: "2",
    nombre: "Poder Simple",
    tipo: "Poder",
    fecha: "2024-03-14",
  },
  {
    id: "3",
    nombre: "Contrato de Arriendo",
    tipo: "Prueba documental",
    fecha: "2024-03-14",
  },
  {
    id: "4",
    nombre: "Contestación Demanda",
    tipo: "Escrito",
    fecha: "2024-04-20",
  },
];

const mockEventos: Evento[] = [
  {
    id: "1",
    titulo: "Audiencia de Conciliación",
    fecha: "2024-06-15T09:00:00",
    tipo: "Audiencia",
  },
  {
    id: "2",
    titulo: "Vencimiento término probatorio",
    fecha: "2024-07-10T23:59:00",
    tipo: "Plazo",
  },
];

const tipoMovimientoColor: Record<string, string> = {
  Ingreso: "bg-blue-500",
  Resolución: "bg-purple-500",
  Notificación: "bg-amber-500",
  Escrito: "bg-green-500",
};

export default function CausaDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const causa = mockCausa;
  const estado = estadosCausa[causa.estado];

  return (
    <div className="space-y-6">
      {/* Back link */}
      <Link
        href="/causas"
        className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Volver a Causas
      </Link>

      {/* Header */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-2xl font-bold text-gray-900">
                {causa.rol}
              </h1>
              <span
                className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${estado.color}`}
              >
                {estado.label}
              </span>
            </div>
            <p className="text-lg text-gray-700">{causa.caratulado}</p>
            <div className="flex items-center gap-2 mt-2 text-sm text-gray-500">
              <User className="w-4 h-4" />
              <Link
                href={`/clientes/${causa.cliente.id}`}
                className="text-blue-600 hover:underline"
              >
                {causa.cliente.nombre}
              </Link>
              <span className="text-gray-300">|</span>
              <span>{causa.cliente.rut}</span>
            </div>
          </div>
          <div className="flex gap-2">
            <button className="inline-flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
              <ExternalLink className="w-4 h-4" />
              Consultar PJUD
            </button>
          </div>
        </div>
      </div>

      {/* Info Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Info */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
            <h2 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">
              Información de la Causa
            </h2>
            <dl className="space-y-4">
              <div>
                <dt className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                  Materia
                </dt>
                <dd className="mt-1 text-sm font-medium text-gray-900 flex items-center gap-2">
                  <Scale className="w-4 h-4 text-gray-400" />
                  {causa.materia}
                </dd>
              </div>
              <div>
                <dt className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                  Tipo
                </dt>
                <dd className="mt-1 text-sm text-gray-900">{causa.tipo}</dd>
              </div>
              <div>
                <dt className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                  Tribunal
                </dt>
                <dd className="mt-1 text-sm text-gray-900 flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-gray-400" />
                  {causa.tribunal}
                </dd>
              </div>
              <div>
                <dt className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                  Juez
                </dt>
                <dd className="mt-1 text-sm text-gray-900">
                  {causa.juez || "No asignado"}
                </dd>
              </div>
              <div>
                <dt className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                  Fecha de Ingreso
                </dt>
                <dd className="mt-1 text-sm text-gray-900 flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-gray-400" />
                  {formatFecha(causa.fechaIngreso)}
                </dd>
              </div>
              <div>
                <dt className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                  Cuantía
                </dt>
                <dd className="mt-1 text-sm font-semibold text-gray-900 flex items-center gap-2">
                  <DollarSign className="w-4 h-4 text-gray-400" />
                  {causa.cuantia ? formatCLP(causa.cuantia) : "No determinada"}
                </dd>
              </div>
            </dl>
            {causa.observaciones && (
              <div className="mt-5 pt-4 border-t border-gray-100">
                <dt className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                  Observaciones
                </dt>
                <dd className="mt-1 text-sm text-gray-600">
                  {causa.observaciones}
                </dd>
              </div>
            )}
          </div>

          {/* Upcoming Events */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
            <h2 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">
              Próximos Eventos
            </h2>
            {mockEventos.length === 0 ? (
              <p className="text-sm text-gray-400">Sin eventos programados</p>
            ) : (
              <div className="space-y-3">
                {mockEventos.map((evento) => (
                  <div
                    key={evento.id}
                    className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg border border-blue-100"
                  >
                    <div className="mt-0.5">
                      <Clock className="w-4 h-4 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {evento.titulo}
                      </p>
                      <p className="text-xs text-gray-500 mt-0.5">
                        {formatFecha(evento.fecha)}
                      </p>
                      <span className="inline-block mt-1 text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">
                        {evento.tipo}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Timeline & Documents */}
        <div className="lg:col-span-2 space-y-6">
          {/* Timeline */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
            <h2 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-6">
              Movimientos
            </h2>
            <div className="relative">
              <div className="absolute left-[15px] top-2 bottom-2 w-0.5 bg-gray-200" />
              <div className="space-y-6">
                {mockMovimientos.map((mov, index) => (
                  <div key={mov.id} className="relative flex gap-4">
                    <div
                      className={`relative z-10 w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                        tipoMovimientoColor[mov.tipo] || "bg-gray-500"
                      }`}
                    >
                      <div className="w-2 h-2 rounded-full bg-white" />
                    </div>
                    <div className="flex-1 pb-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm font-semibold text-gray-900">
                          {mov.tipo}
                        </span>
                        {mov.folio && (
                          <span className="text-xs text-gray-400 font-mono">
                            Folio {mov.folio}
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-600">
                        {mov.descripcion}
                      </p>
                      <p className="text-xs text-gray-400 mt-1">
                        {formatFecha(mov.fecha)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Documents */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-semibold text-gray-900 uppercase tracking-wider">
                Documentos Asociados
              </h2>
              <button className="text-sm text-blue-600 hover:text-blue-800 font-medium">
                Ver todos
              </button>
            </div>
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
                  <button className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors opacity-0 group-hover:opacity-100">
                    <Download className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
