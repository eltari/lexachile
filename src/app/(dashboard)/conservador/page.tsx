"use client";

import { useState } from "react";
import {
  Building2,
  Search,
  MapPin,
  User,
  FileText,
  ChevronDown,
  ChevronRight,
  Shield,
  AlertTriangle,
  Landmark,
  Store,
  Download,
  Loader2,
  Hash,
  Calendar,
} from "lucide-react";

// ─── Tipos ──────────────────────────────────────────────────────────────────

interface Hipoteca {
  acreedor: string;
  monto: string;
  fechaInscripcion: string;
  foja: string;
  numero: string;
  anno: number;
  estado: "Vigente" | "Alzada";
}

interface Prohibicion {
  tipo: string;
  beneficiario: string;
  fechaInscripcion: string;
  foja: string;
  numero: string;
  anno: number;
  estado: "Vigente" | "Cancelada";
}

interface RegistroComercio {
  tipo: string;
  descripcion: string;
  fechaInscripcion: string;
  foja: string;
  numero: string;
  anno: number;
}

interface Propiedad {
  id: string;
  propietario: string;
  rut: string;
  direccion: string;
  comuna: string;
  rolAvaluo: string;
  superficieTerreno: string;
  superficieConstruida: string;
  inscripcion: {
    foja: string;
    numero: string;
    anno: number;
    registro: string;
  };
  hipotecas: Hipoteca[];
  prohibiciones: Prohibicion[];
  comercio: RegistroComercio[];
  avaluoFiscal: string;
  destino: string;
}

// ─── Mock Data ──────────────────────────────────────────────────────────────

const mockPropiedades: Propiedad[] = [
  {
    id: "prop-001",
    propietario: "María Isabel González Fuentes",
    rut: "12.345.678-5",
    direccion: "Av. Providencia 1234, Depto. 501",
    comuna: "Providencia",
    rolAvaluo: "1234-56",
    superficieTerreno: "85,5 m²",
    superficieConstruida: "72,3 m²",
    inscripcion: { foja: "2456", numero: "1890", anno: 2018, registro: "Propiedad" },
    hipotecas: [
      {
        acreedor: "Banco de Chile",
        monto: "UF 3.500",
        fechaInscripcion: "2018-05-15",
        foja: "8921",
        numero: "6543",
        anno: 2018,
        estado: "Vigente",
      },
    ],
    prohibiciones: [
      {
        tipo: "Prohibición de Gravar y Enajenar",
        beneficiario: "Banco de Chile",
        fechaInscripcion: "2018-05-15",
        foja: "3421",
        numero: "2109",
        anno: 2018,
        estado: "Vigente",
      },
    ],
    comercio: [],
    avaluoFiscal: "$98.500.000",
    destino: "Habitacional",
  },
  {
    id: "prop-002",
    propietario: "Carlos Alberto Muñoz Reyes",
    rut: "9.876.543-2",
    direccion: "Calle Los Leones 456",
    comuna: "Providencia",
    rolAvaluo: "5678-90",
    superficieTerreno: "320 m²",
    superficieConstruida: "185 m²",
    inscripcion: { foja: "1234", numero: "987", anno: 2015, registro: "Propiedad" },
    hipotecas: [
      {
        acreedor: "BancoEstado",
        monto: "UF 5.200",
        fechaInscripcion: "2015-11-20",
        foja: "6789",
        numero: "4321",
        anno: 2015,
        estado: "Vigente",
      },
      {
        acreedor: "Banco Santander",
        monto: "UF 1.800",
        fechaInscripcion: "2020-03-10",
        foja: "2345",
        numero: "1567",
        anno: 2020,
        estado: "Alzada",
      },
    ],
    prohibiciones: [
      {
        tipo: "Prohibición de Gravar y Enajenar",
        beneficiario: "BancoEstado",
        fechaInscripcion: "2015-11-20",
        foja: "4567",
        numero: "3210",
        anno: 2015,
        estado: "Vigente",
      },
    ],
    comercio: [],
    avaluoFiscal: "$245.000.000",
    destino: "Habitacional",
  },
  {
    id: "prop-003",
    propietario: "Pedro Antonio Soto Vargas",
    rut: "15.678.901-3",
    direccion: "Pasaje Los Aromos 32",
    comuna: "Ñuñoa",
    rolAvaluo: "3456-78",
    superficieTerreno: "150 m²",
    superficieConstruida: "95 m²",
    inscripcion: { foja: "7890", numero: "5678", anno: 2019, registro: "Propiedad" },
    hipotecas: [
      {
        acreedor: "Banco Itaú",
        monto: "UF 2.800",
        fechaInscripcion: "2019-08-22",
        foja: "3456",
        numero: "2345",
        anno: 2019,
        estado: "Vigente",
      },
    ],
    prohibiciones: [
      {
        tipo: "Prohibición de Gravar y Enajenar",
        beneficiario: "Banco Itaú",
        fechaInscripcion: "2019-08-22",
        foja: "6789",
        numero: "4567",
        anno: 2019,
        estado: "Vigente",
      },
      {
        tipo: "Embargo",
        beneficiario: "Tesorería General de la República",
        fechaInscripcion: "2023-06-14",
        foja: "1234",
        numero: "890",
        anno: 2023,
        estado: "Vigente",
      },
    ],
    comercio: [],
    avaluoFiscal: "$125.000.000",
    destino: "Habitacional",
  },
];

const comunas = [
  "Santiago",
  "Providencia",
  "Las Condes",
  "Ñuñoa",
  "Vitacura",
  "La Reina",
  "Macul",
  "San Miguel",
  "La Florida",
  "Maipú",
  "Puente Alto",
  "Peñalolén",
];

// ─── Componente de Sección Expandible ───────────────────────────────────────

function SeccionExpandible({
  titulo,
  icono: Icono,
  cantidad,
  color,
  children,
}: {
  titulo: string;
  icono: React.ElementType;
  cantidad: number;
  color: string;
  children: React.ReactNode;
}) {
  const [abierta, setAbierta] = useState(false);

  const colorMap: Record<string, { bg: string; text: string; badge: string }> = {
    blue: { bg: "bg-blue-50 dark:bg-blue-900/20", text: "text-blue-700 dark:text-blue-300", badge: "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300" },
    red: { bg: "bg-red-50 dark:bg-red-900/20", text: "text-red-700 dark:text-red-300", badge: "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300" },
    amber: { bg: "bg-amber-50 dark:bg-amber-900/20", text: "text-amber-700 dark:text-amber-300", badge: "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300" },
    purple: { bg: "bg-purple-50 dark:bg-purple-900/20", text: "text-purple-700 dark:text-purple-300", badge: "bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300" },
  };

  const c = colorMap[color] || colorMap.blue;

  return (
    <div className="border border-gray-200 dark:border-slate-700 rounded-xl overflow-hidden">
      <button
        onClick={() => setAbierta(!abierta)}
        className={`w-full flex items-center justify-between p-4 transition-colors hover:bg-gray-50 dark:hover:bg-slate-800/50 ${abierta ? c.bg : ""}`}
      >
        <div className="flex items-center gap-3">
          <Icono className={`w-5 h-5 ${c.text}`} />
          <span className="font-semibold text-gray-900 dark:text-white">{titulo}</span>
          <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${c.badge}`}>
            {cantidad}
          </span>
        </div>
        {abierta ? (
          <ChevronDown className="w-4 h-4 text-gray-400" />
        ) : (
          <ChevronRight className="w-4 h-4 text-gray-400" />
        )}
      </button>
      {abierta && <div className="p-4 border-t border-gray-200 dark:border-slate-700">{children}</div>}
    </div>
  );
}

// ─── Componente Tarjeta de Propiedad ────────────────────────────────────────

function TarjetaPropiedad({ propiedad }: { propiedad: Propiedad }) {
  return (
    <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-2xl overflow-hidden shadow-sm">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-5">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-blue-100 text-xs font-medium uppercase tracking-wider mb-1">Propietario</p>
            <h3 className="text-white text-lg font-bold">{propiedad.propietario}</h3>
            <p className="text-blue-200 text-sm mt-0.5">RUT: {propiedad.rut}</p>
          </div>
          <span className="px-3 py-1 bg-white/20 rounded-full text-white text-xs font-semibold backdrop-blur-sm">
            {propiedad.destino}
          </span>
        </div>
      </div>

      {/* Info */}
      <div className="p-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-5">
          <div className="flex items-start gap-3">
            <MapPin className="w-4 h-4 text-gray-400 mt-0.5 shrink-0" />
            <div>
              <p className="text-xs text-gray-500 dark:text-slate-400">Dirección</p>
              <p className="text-sm font-medium text-gray-900 dark:text-white">{propiedad.direccion}</p>
              <p className="text-xs text-gray-500 dark:text-slate-400">{propiedad.comuna}</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <FileText className="w-4 h-4 text-gray-400 mt-0.5 shrink-0" />
            <div>
              <p className="text-xs text-gray-500 dark:text-slate-400">Inscripción</p>
              <p className="text-sm font-medium text-gray-900 dark:text-white">
                Foja {propiedad.inscripcion.foja} N° {propiedad.inscripcion.numero} Año {propiedad.inscripcion.anno}
              </p>
              <p className="text-xs text-gray-500 dark:text-slate-400">Rol: {propiedad.rolAvaluo}</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Building2 className="w-4 h-4 text-gray-400 mt-0.5 shrink-0" />
            <div>
              <p className="text-xs text-gray-500 dark:text-slate-400">Superficie</p>
              <p className="text-sm text-gray-900 dark:text-white">
                Terreno: {propiedad.superficieTerreno}
              </p>
              <p className="text-sm text-gray-900 dark:text-white">
                Construida: {propiedad.superficieConstruida}
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Landmark className="w-4 h-4 text-gray-400 mt-0.5 shrink-0" />
            <div>
              <p className="text-xs text-gray-500 dark:text-slate-400">Avalúo Fiscal</p>
              <p className="text-sm font-semibold text-gray-900 dark:text-white">{propiedad.avaluoFiscal}</p>
            </div>
          </div>
        </div>

        {/* Registros */}
        <div className="space-y-3">
          {/* Propiedad */}
          <SeccionExpandible titulo="Registro de Propiedad" icono={Shield} cantidad={1} color="blue">
            <div className="bg-blue-50 dark:bg-blue-900/10 rounded-lg p-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                <div>
                  <p className="text-gray-500 dark:text-slate-400 text-xs">Foja</p>
                  <p className="font-semibold text-gray-900 dark:text-white">{propiedad.inscripcion.foja}</p>
                </div>
                <div>
                  <p className="text-gray-500 dark:text-slate-400 text-xs">Número</p>
                  <p className="font-semibold text-gray-900 dark:text-white">{propiedad.inscripcion.numero}</p>
                </div>
                <div>
                  <p className="text-gray-500 dark:text-slate-400 text-xs">Año</p>
                  <p className="font-semibold text-gray-900 dark:text-white">{propiedad.inscripcion.anno}</p>
                </div>
                <div>
                  <p className="text-gray-500 dark:text-slate-400 text-xs">Registro</p>
                  <p className="font-semibold text-gray-900 dark:text-white">{propiedad.inscripcion.registro}</p>
                </div>
              </div>
            </div>
          </SeccionExpandible>

          {/* Hipotecas */}
          <SeccionExpandible titulo="Hipotecas y Gravámenes" icono={Landmark} cantidad={propiedad.hipotecas.length} color="amber">
            {propiedad.hipotecas.length === 0 ? (
              <p className="text-sm text-gray-500 dark:text-slate-400 italic">Sin hipotecas registradas</p>
            ) : (
              <div className="space-y-3">
                {propiedad.hipotecas.map((h, i) => (
                  <div key={i} className="bg-gray-50 dark:bg-slate-800/50 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-semibold text-gray-900 dark:text-white text-sm">{h.acreedor}</span>
                      <span
                        className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                          h.estado === "Vigente"
                            ? "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300"
                            : "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300"
                        }`}
                      >
                        {h.estado}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs">
                      <div>
                        <span className="text-gray-500 dark:text-slate-400">Monto:</span>{" "}
                        <span className="font-medium text-gray-900 dark:text-white">{h.monto}</span>
                      </div>
                      <div>
                        <span className="text-gray-500 dark:text-slate-400">Foja:</span>{" "}
                        <span className="font-medium text-gray-900 dark:text-white">{h.foja}</span>
                      </div>
                      <div>
                        <span className="text-gray-500 dark:text-slate-400">N°:</span>{" "}
                        <span className="font-medium text-gray-900 dark:text-white">{h.numero}</span>
                      </div>
                      <div>
                        <span className="text-gray-500 dark:text-slate-400">Fecha:</span>{" "}
                        <span className="font-medium text-gray-900 dark:text-white">{h.fechaInscripcion}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </SeccionExpandible>

          {/* Prohibiciones */}
          <SeccionExpandible titulo="Prohibiciones e Interdicciones" icono={AlertTriangle} cantidad={propiedad.prohibiciones.length} color="red">
            {propiedad.prohibiciones.length === 0 ? (
              <p className="text-sm text-gray-500 dark:text-slate-400 italic">Sin prohibiciones registradas</p>
            ) : (
              <div className="space-y-3">
                {propiedad.prohibiciones.map((p, i) => (
                  <div key={i} className="bg-gray-50 dark:bg-slate-800/50 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-semibold text-gray-900 dark:text-white text-sm">{p.tipo}</span>
                      <span
                        className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                          p.estado === "Vigente"
                            ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300"
                            : "bg-gray-100 text-gray-600 dark:bg-slate-700 dark:text-slate-300"
                        }`}
                      >
                        {p.estado}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs">
                      <div>
                        <span className="text-gray-500 dark:text-slate-400">Beneficiario:</span>{" "}
                        <span className="font-medium text-gray-900 dark:text-white">{p.beneficiario}</span>
                      </div>
                      <div>
                        <span className="text-gray-500 dark:text-slate-400">Foja:</span>{" "}
                        <span className="font-medium text-gray-900 dark:text-white">{p.foja}</span>
                      </div>
                      <div>
                        <span className="text-gray-500 dark:text-slate-400">N°:</span>{" "}
                        <span className="font-medium text-gray-900 dark:text-white">{p.numero}</span>
                      </div>
                      <div>
                        <span className="text-gray-500 dark:text-slate-400">Fecha:</span>{" "}
                        <span className="font-medium text-gray-900 dark:text-white">{p.fechaInscripcion}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </SeccionExpandible>

          {/* Comercio */}
          <SeccionExpandible titulo="Registro de Comercio" icono={Store} cantidad={propiedad.comercio.length} color="purple">
            {propiedad.comercio.length === 0 ? (
              <p className="text-sm text-gray-500 dark:text-slate-400 italic">Sin inscripciones de comercio</p>
            ) : (
              <div className="space-y-3">
                {propiedad.comercio.map((c, i) => (
                  <div key={i} className="bg-gray-50 dark:bg-slate-800/50 rounded-lg p-4">
                    <p className="font-semibold text-gray-900 dark:text-white text-sm mb-1">{c.tipo}</p>
                    <p className="text-xs text-gray-600 dark:text-slate-300 mb-2">{c.descripcion}</p>
                    <div className="flex gap-4 text-xs text-gray-500 dark:text-slate-400">
                      <span>Foja: {c.foja}</span>
                      <span>N°: {c.numero}</span>
                      <span>Año: {c.anno}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </SeccionExpandible>
        </div>

        {/* Botón Certificado */}
        <div className="mt-5 flex justify-end">
          <button className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl text-sm font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all shadow-md shadow-blue-500/20">
            <Download className="w-4 h-4" />
            Solicitar Certificado
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Tabs ───────────────────────────────────────────────────────────────────

type TabId = "inscripcion" | "rut" | "direccion";

const tabs: { id: TabId; label: string; icono: React.ElementType }[] = [
  { id: "inscripcion", label: "Por Inscripción", icono: Hash },
  { id: "rut", label: "Por RUT", icono: User },
  { id: "direccion", label: "Por Dirección", icono: MapPin },
];

// ─── Página Principal ───────────────────────────────────────────────────────

export default function ConservadorPage() {
  const [tabActiva, setTabActiva] = useState<TabId>("inscripcion");
  const [buscando, setBuscando] = useState(false);
  const [resultados, setResultados] = useState<Propiedad[] | null>(null);

  // Formulario inscripción
  const [foja, setFoja] = useState("");
  const [numero, setNumero] = useState("");
  const [anno, setAnno] = useState("");
  const [comuna, setComuna] = useState("");

  // Formulario RUT
  const [rut, setRut] = useState("");

  // Formulario dirección
  const [direccion, setDireccion] = useState("");
  const [comunaDireccion, setComunaDireccion] = useState("");

  const handleBuscar = () => {
    setBuscando(true);
    // Simular búsqueda
    setTimeout(() => {
      if (tabActiva === "rut") {
        setResultados(mockPropiedades.filter((_, i) => i < 2));
      } else if (tabActiva === "direccion") {
        setResultados([mockPropiedades[0]]);
      } else {
        setResultados(mockPropiedades);
      }
      setBuscando(false);
    }, 800);
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div>
        <div className="flex items-center gap-3 mb-1">
          <div className="p-2.5 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl shadow-lg shadow-blue-500/20">
            <Building2 className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Conservador de Bienes Raíces
            </h1>
            <p className="text-sm text-gray-500 dark:text-slate-400">
              Consulta de inscripciones, hipotecas, prohibiciones y certificados
            </p>
          </div>
        </div>
      </div>

      {/* Search Card */}
      <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-2xl shadow-sm overflow-hidden">
        {/* Tabs */}
        <div className="border-b border-gray-200 dark:border-slate-700">
          <div className="flex">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => {
                  setTabActiva(tab.id);
                  setResultados(null);
                }}
                className={`flex items-center gap-2 px-5 py-3.5 text-sm font-medium border-b-2 transition-colors ${
                  tabActiva === tab.id
                    ? "border-blue-600 text-blue-600 dark:text-blue-400 dark:border-blue-400"
                    : "border-transparent text-gray-500 hover:text-gray-700 dark:text-slate-400 dark:hover:text-slate-300"
                }`}
              >
                <tab.icono className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Form */}
        <div className="p-5">
          {tabActiva === "inscripcion" && (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-600 dark:text-slate-400 mb-1.5">
                  Foja
                </label>
                <input
                  type="text"
                  placeholder="Ej: 2456"
                  value={foja}
                  onChange={(e) => setFoja(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 dark:text-slate-400 mb-1.5">
                  Número
                </label>
                <input
                  type="text"
                  placeholder="Ej: 1890"
                  value={numero}
                  onChange={(e) => setNumero(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 dark:text-slate-400 mb-1.5">
                  Año
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Ej: 2018"
                    value={anno}
                    onChange={(e) => setAnno(e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 dark:text-slate-400 mb-1.5">
                  Comuna
                </label>
                <select
                  value={comuna}
                  onChange={(e) => setComuna(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                >
                  <option value="">Todas</option>
                  {comunas.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )}

          {tabActiva === "rut" && (
            <div className="max-w-md">
              <label className="block text-xs font-medium text-gray-600 dark:text-slate-400 mb-1.5">
                RUT del Propietario
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Ej: 12.345.678-5"
                  value={rut}
                  onChange={(e) => setRut(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                />
              </div>
            </div>
          )}

          {tabActiva === "direccion" && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-2">
                <label className="block text-xs font-medium text-gray-600 dark:text-slate-400 mb-1.5">
                  Dirección
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Ej: Av. Providencia 1234"
                    value={direccion}
                    onChange={(e) => setDireccion(e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 dark:text-slate-400 mb-1.5">
                  Comuna
                </label>
                <select
                  value={comunaDireccion}
                  onChange={(e) => setComunaDireccion(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                >
                  <option value="">Todas</option>
                  {comunas.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )}

          <div className="mt-4">
            <button
              onClick={handleBuscar}
              disabled={buscando}
              className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl text-sm font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all shadow-md shadow-blue-500/20 disabled:opacity-50"
            >
              {buscando ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Search className="w-4 h-4" />
              )}
              {buscando ? "Buscando..." : "Buscar"}
            </button>
          </div>
        </div>
      </div>

      {/* Resultados */}
      {buscando && (
        <div className="flex items-center justify-center py-16">
          <div className="text-center">
            <Loader2 className="w-8 h-8 text-blue-500 animate-spin mx-auto mb-3" />
            <p className="text-sm text-gray-500 dark:text-slate-400">Consultando Conservador de Bienes Raíces...</p>
          </div>
        </div>
      )}

      {resultados && !buscando && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">
              Resultados ({resultados.length})
            </h2>
          </div>
          <div className="space-y-6">
            {resultados.map((prop) => (
              <TarjetaPropiedad key={prop.id} propiedad={prop} />
            ))}
          </div>
        </div>
      )}

      {!resultados && !buscando && (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="p-4 bg-gray-100 dark:bg-slate-800 rounded-2xl mb-4">
            <Building2 className="w-10 h-10 text-gray-400 dark:text-slate-500" />
          </div>
          <h3 className="text-lg font-semibold text-gray-700 dark:text-slate-300 mb-1">
            Buscar en el Conservador
          </h3>
          <p className="text-sm text-gray-500 dark:text-slate-400 max-w-md">
            Ingrese los datos de inscripción, RUT del propietario o dirección del inmueble para consultar los registros del Conservador de Bienes Raíces.
          </p>
        </div>
      )}
    </div>
  );
}
