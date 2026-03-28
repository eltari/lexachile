"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  FileSignature,
  ScrollText,
  Scale,
  Shield,
  FileText,
  Building2,
  Briefcase,
  Home,
  Search,
} from "lucide-react";

interface Plantilla {
  id: string;
  nombre: string;
  descripcion: string;
  icon: typeof FileText;
  color: string;
  iconBg: string;
  campos: string[];
  contenidoPreview: string;
}

const plantillas: Plantilla[] = [
  {
    id: "demanda_civil",
    nombre: "Demanda Civil Ordinaria",
    descripcion:
      "Plantilla completa para demanda civil ordinaria con todos los requisitos del art. 253 CPC. Incluye secciones de hechos, derecho y petitorio.",
    icon: FileSignature,
    color: "text-blue-600 dark:text-blue-400",
    iconBg: "bg-blue-50 dark:bg-blue-900/20",
    campos: [
      "{{nombre_cliente}}",
      "{{rut_cliente}}",
      "{{domicilio_cliente}}",
      "{{nombre_demandado}}",
      "{{rut_demandado}}",
      "{{hechos}}",
      "{{monto}}",
    ],
    contenidoPreview:
      "EN LO PRINCIPAL: Demanda en juicio ordinario de cobro de pesos. PRIMER OTROSI: Acompana documentos...",
  },
  {
    id: "contestacion_demanda",
    nombre: "Contestacion de Demanda",
    descripcion:
      "Modelo de contestacion de demanda con estructura profesional. Incluye negacion de hechos, excepciones y defensa.",
    icon: Shield,
    color: "text-red-600 dark:text-red-400",
    iconBg: "bg-red-50 dark:bg-red-900/20",
    campos: [
      "{{nombre_cliente}}",
      "{{rut_cliente}}",
      "{{rol_causa}}",
      "{{caratulado}}",
      "{{argumentos_defensa}}",
    ],
    contenidoPreview:
      "EN LO PRINCIPAL: Contesta demanda. PRIMER OTROSI: Opone excepciones...",
  },
  {
    id: "recurso_apelacion",
    nombre: "Recurso de Apelacion",
    descripcion:
      "Plantilla para interponer recurso de apelacion conforme al art. 186 y siguientes del CPC. Incluye agravios y peticiones concretas.",
    icon: Scale,
    color: "text-purple-600 dark:text-purple-400",
    iconBg: "bg-purple-50 dark:bg-purple-900/20",
    campos: [
      "{{nombre_cliente}}",
      "{{rol_causa}}",
      "{{caratulado}}",
      "{{fecha_resolucion}}",
      "{{agravios}}",
      "{{peticiones}}",
    ],
    contenidoPreview:
      "EN LO PRINCIPAL: Recurso de apelacion. OTROSI: Se tenga presente...",
  },
  {
    id: "contrato_arrendamiento",
    nombre: "Contrato de Arrendamiento",
    descripcion:
      "Contrato de arrendamiento de inmueble conforme a la Ley 18.101. Incluye clausulas de renta, garantia, duracion y obligaciones.",
    icon: Home,
    color: "text-emerald-600 dark:text-emerald-400",
    iconBg: "bg-emerald-50 dark:bg-emerald-900/20",
    campos: [
      "{{nombre_arrendador}}",
      "{{rut_arrendador}}",
      "{{nombre_arrendatario}}",
      "{{rut_arrendatario}}",
      "{{direccion_inmueble}}",
      "{{monto_renta}}",
      "{{duracion}}",
    ],
    contenidoPreview:
      "CONTRATO DE ARRENDAMIENTO. En Santiago, comparecen: ARRENDADOR y ARRENDATARIO...",
  },
  {
    id: "poder_simple",
    nombre: "Poder Simple",
    descripcion:
      "Poder simple para representacion en diversas gestiones legales y administrativas. Incluye facultades especificas.",
    icon: FileText,
    color: "text-amber-600 dark:text-amber-400",
    iconBg: "bg-amber-50 dark:bg-amber-900/20",
    campos: [
      "{{nombre_poderdante}}",
      "{{rut_poderdante}}",
      "{{nombre_apoderado}}",
      "{{rut_apoderado}}",
      "{{facultades}}",
      "{{vigencia}}",
    ],
    contenidoPreview:
      "PODER. Yo, [nombre], confiero poder especial a [apoderado] para que en mi nombre...",
  },
  {
    id: "compraventa",
    nombre: "Escritura de Compraventa",
    descripcion:
      "Escritura publica de compraventa de bien raiz. Incluye individualizacion del inmueble, precio, forma de pago y clausulas.",
    icon: Building2,
    color: "text-teal-600 dark:text-teal-400",
    iconBg: "bg-teal-50 dark:bg-teal-900/20",
    campos: [
      "{{nombre_vendedor}}",
      "{{rut_vendedor}}",
      "{{nombre_comprador}}",
      "{{rut_comprador}}",
      "{{direccion_inmueble}}",
      "{{precio}}",
      "{{forma_pago}}",
    ],
    contenidoPreview:
      "ESCRITURA PUBLICA DE COMPRAVENTA. Ante mi, Notario Publico, comparecen...",
  },
  {
    id: "recurso_proteccion",
    nombre: "Recurso de Proteccion",
    descripcion:
      "Recurso de proteccion conforme al art. 20 de la Constitucion. Incluye hechos, garantias vulneradas y orden de no innovar.",
    icon: Shield,
    color: "text-rose-600 dark:text-rose-400",
    iconBg: "bg-rose-50 dark:bg-rose-900/20",
    campos: [
      "{{nombre_cliente}}",
      "{{rut_cliente}}",
      "{{nombre_recurrido}}",
      "{{hechos}}",
      "{{garantias_vulneradas}}",
      "{{ciudad_corte}}",
    ],
    contenidoPreview:
      "EN LO PRINCIPAL: Recurso de proteccion. PRIMER OTROSI: Orden de no innovar...",
  },
  {
    id: "contrato_trabajo",
    nombre: "Contrato de Trabajo",
    descripcion:
      "Contrato individual de trabajo conforme al Codigo del Trabajo. Incluye todas las clausulas minimas obligatorias.",
    icon: Briefcase,
    color: "text-indigo-600 dark:text-indigo-400",
    iconBg: "bg-indigo-50 dark:bg-indigo-900/20",
    campos: [
      "{{nombre_empleador}}",
      "{{rut_empleador}}",
      "{{nombre_trabajador}}",
      "{{rut_trabajador}}",
      "{{cargo}}",
      "{{remuneracion}}",
      "{{horas_semanales}}",
    ],
    contenidoPreview:
      "CONTRATO INDIVIDUAL DE TRABAJO. Entre EMPLEADOR y TRABAJADOR se ha convenido...",
  },
];

export default function PlantillasPage() {
  const [searchQuery, setSearchQuery] = useState("");

  const filtered = plantillas.filter(
    (p) =>
      p.nombre.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.descripcion.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
              Plantillas Legales
            </h1>
            <p className="text-sm text-gray-500 dark:text-slate-400 mt-0.5">
              Documentos juridicos chilenos pre-formateados listos para usar
            </p>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          type="text"
          placeholder="Buscar plantilla..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-xl text-sm text-gray-900 dark:text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm"
        />
      </div>

      {/* Templates Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        {filtered.map((plantilla) => {
          const Icon = plantilla.icon;
          return (
            <div
              key={plantilla.id}
              className="group bg-white dark:bg-slate-900 rounded-xl border border-gray-200 dark:border-slate-800 shadow-sm hover:shadow-lg hover:border-blue-300 dark:hover:border-blue-700 transition-all"
            >
              <div className="p-5">
                <div className="flex items-start gap-4 mb-4">
                  <div
                    className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${plantilla.iconBg}`}
                  >
                    <Icon className={`w-6 h-6 ${plantilla.color}`} />
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-base font-bold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      {plantilla.nombre}
                    </h3>
                  </div>
                </div>

                <p className="text-sm text-gray-500 dark:text-slate-400 mb-4 line-clamp-3">
                  {plantilla.descripcion}
                </p>

                {/* Preview */}
                <div className="bg-gray-50 dark:bg-slate-800/50 rounded-lg p-3 mb-4">
                  <p className="text-xs text-gray-400 dark:text-slate-500 font-mono line-clamp-2">
                    {plantilla.contenidoPreview}
                  </p>
                </div>

                {/* Campos */}
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {plantilla.campos.slice(0, 4).map((campo) => (
                    <span
                      key={campo}
                      className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-mono bg-gray-100 dark:bg-slate-800 text-gray-500 dark:text-slate-400"
                    >
                      {campo}
                    </span>
                  ))}
                  {plantilla.campos.length > 4 && (
                    <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] text-gray-400 dark:text-slate-500">
                      +{plantilla.campos.length - 4} mas
                    </span>
                  )}
                </div>
              </div>

              {/* Action */}
              <div className="px-5 py-3.5 border-t border-gray-100 dark:border-slate-800">
                <Link
                  href={`/documentos/nuevo?plantilla=${plantilla.id}`}
                  className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-semibold shadow-sm shadow-blue-600/20 transition-colors"
                >
                  <ScrollText className="w-4 h-4" />
                  Usar Plantilla
                </Link>
              </div>
            </div>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-16">
          <FileText className="w-12 h-12 text-gray-300 dark:text-slate-600 mx-auto mb-3" />
          <p className="text-sm text-gray-500 dark:text-slate-400">
            No se encontraron plantillas que coincidan con tu busqueda
          </p>
        </div>
      )}
    </div>
  );
}
