import Link from "next/link";
import {
  Scale,
  Users,
  Calendar,
  FileText,
  Search,
  Building2,
  Brain,
  BarChart3,
  Check,
  X,
  ArrowRight,
  Sparkles,
  Shield,
  BookOpen,
  Gavel,
} from "lucide-react";

const features = [
  {
    icon: Scale,
    title: "Gestión de Causas",
    description:
      "Seguimiento completo de causas con ROL, RIT y RUC. Timeline visual de actuaciones, estados y resoluciones en tiempo real.",
    color: "from-blue-500 to-blue-600",
    bgLight: "bg-blue-50 dark:bg-blue-950/30",
  },
  {
    icon: Users,
    title: "CRM de Clientes",
    description:
      "Base de datos completa con validación de RUT chileno, historial de causas, documentos asociados y comunicaciones.",
    color: "from-emerald-500 to-emerald-600",
    bgLight: "bg-emerald-50 dark:bg-emerald-950/30",
  },
  {
    icon: Calendar,
    title: "Calendario Jurídico",
    description:
      "Gestión de audiencias, plazos fatales y vencimientos con alertas automáticas. Sincronización con Google Calendar.",
    color: "from-amber-500 to-amber-600",
    bgLight: "bg-amber-50 dark:bg-amber-950/30",
  },
  {
    icon: FileText,
    title: "Documentos Inteligentes",
    description:
      "Generación automática de escritos con IA, plantillas personalizables y firma electrónica avanzada integrada.",
    color: "from-violet-500 to-violet-600",
    bgLight: "bg-violet-50 dark:bg-violet-950/30",
  },
  {
    icon: Search,
    title: "Consulta PJUD",
    description:
      "Integración directa con el Poder Judicial de Chile. Consulta de causas, actuaciones y resoluciones sin salir de la plataforma.",
    color: "from-rose-500 to-rose-600",
    bgLight: "bg-rose-50 dark:bg-rose-950/30",
  },
  {
    icon: Building2,
    title: "Conservador de Bienes Raíces",
    description:
      "Consulta automatizada de inscripciones, certificados de dominio y gravámenes en conservadores de todo Chile.",
    color: "from-cyan-500 to-cyan-600",
    bgLight: "bg-cyan-50 dark:bg-cyan-950/30",
  },
  {
    icon: Brain,
    title: "IA Legal Avanzada",
    description:
      "Análisis inteligente de documentos legales, búsqueda de jurisprudencia relevante y asistente legal con IA generativa.",
    color: "from-pink-500 to-pink-600",
    bgLight: "bg-pink-50 dark:bg-pink-950/30",
  },
  {
    icon: BarChart3,
    title: "Reportes Detallados",
    description:
      "Informes personalizables de causas, productividad, cobranzas y gestión. Exportación a PDF, Excel y más.",
    color: "from-indigo-500 to-indigo-600",
    bgLight: "bg-indigo-50 dark:bg-indigo-950/30",
  },
];

const comparisonFeatures = [
  { name: "IA Legal Integrada", lexa: true, justice: false, lemon: false, others: false },
  { name: "Gestión de Causas", lexa: true, justice: true, lemon: true, others: true },
  { name: "Consulta PJUD", lexa: true, justice: false, lemon: true, others: false },
  { name: "Conservador CBR", lexa: true, justice: false, lemon: false, others: false },
  { name: "CRM de Clientes", lexa: true, justice: true, lemon: true, others: false },
  { name: "Calendario Jurídico", lexa: true, justice: true, lemon: true, others: true },
  { name: "Documentos con IA", lexa: true, justice: false, lemon: false, others: false },
  { name: "Reportes Avanzados", lexa: true, justice: true, lemon: true, others: false },
  { name: "Precio", lexa: "Gratis", justice: "$49.990/mes", lemon: "$89.990/mes", others: "Variable" },
];

const stats = [
  { value: "300,000+", label: "Leyes Indexadas", icon: BookOpen },
  { value: "100%", label: "Gratis", icon: Shield },
  { value: "10+", label: "Tribunales Integrados", icon: Gavel },
  { value: "IA", label: "de Última Generación", icon: Sparkles },
];

export default function LandingPage() {
  return (
    <main>
      {/* ============================================================
          HERO SECTION
          ============================================================ */}
      <section className="relative min-h-screen flex items-center overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-blue-950 to-indigo-950" />
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")",
          }}
        />
        {/* Glow orbs */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32 lg:py-40 w-full">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Left - Copy */}
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 mb-6">
                <Sparkles className="w-4 h-4 text-blue-400" />
                <span className="text-xs font-semibold text-blue-300 tracking-wide uppercase">
                  Potenciado con Inteligencia Artificial
                </span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white leading-[1.1] tracking-tight">
                La Plataforma Jurídica{" "}
                <span className="bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-400 bg-clip-text text-transparent">
                  Más Completa
                </span>{" "}
                de Chile
              </h1>

              <p className="mt-6 text-lg sm:text-xl text-slate-300 leading-relaxed max-w-xl">
                Gestiona causas, clientes, documentos y más con inteligencia
                artificial integrada.{" "}
                <span className="text-white font-semibold">
                  Gratis y lista para usar.
                </span>
              </p>

              <div className="mt-10 flex flex-col sm:flex-row gap-4">
                <Link
                  href="/register"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-xl transition-all shadow-xl shadow-blue-600/25 hover:shadow-blue-500/30 hover:-translate-y-0.5"
                >
                  Comenzar Gratis
                  <ArrowRight className="w-5 h-5" />
                </Link>
                <button className="inline-flex items-center justify-center gap-2 px-8 py-4 border-2 border-white/20 hover:border-white/40 text-white font-semibold rounded-xl transition-all hover:bg-white/5">
                  Ver Demo
                </button>
              </div>

              <div className="mt-8 flex items-center gap-6 text-sm text-slate-400">
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span>Sin tarjeta de crédito</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span>Setup en 2 minutos</span>
                </div>
              </div>
            </div>

            {/* Right - Mock Dashboard Preview */}
            <div className="relative hidden lg:block">
              <div className="relative rounded-2xl border border-white/10 bg-slate-900/80 backdrop-blur-sm shadow-2xl shadow-black/40 overflow-hidden">
                {/* Mock Titlebar */}
                <div className="flex items-center gap-2 px-4 py-3 border-b border-white/10 bg-slate-900/50">
                  <div className="w-3 h-3 rounded-full bg-red-500/80" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                  <div className="w-3 h-3 rounded-full bg-green-500/80" />
                  <div className="ml-4 flex-1 h-6 rounded-md bg-slate-800 flex items-center px-3">
                    <span className="text-xs text-slate-500">
                      app.lexachile.cl/dashboard
                    </span>
                  </div>
                </div>

                {/* Mock Dashboard Content */}
                <div className="p-6 space-y-4">
                  {/* Mock Stats Row */}
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { l: "Causas Activas", v: "24", c: "bg-blue-500" },
                      { l: "Clientes", v: "156", c: "bg-emerald-500" },
                      { l: "Audiencias", v: "8", c: "bg-amber-500" },
                    ].map((s) => (
                      <div
                        key={s.l}
                        className="rounded-lg bg-slate-800/50 border border-white/5 p-3"
                      >
                        <div
                          className={`w-2 h-2 rounded-full ${s.c} mb-2`}
                        />
                        <p className="text-white font-bold text-lg">
                          {s.v}
                        </p>
                        <p className="text-slate-500 text-xs">{s.l}</p>
                      </div>
                    ))}
                  </div>

                  {/* Mock Table */}
                  <div className="rounded-lg bg-slate-800/50 border border-white/5 overflow-hidden">
                    <div className="px-3 py-2 border-b border-white/5">
                      <p className="text-xs font-semibold text-slate-400">
                        Causas Recientes
                      </p>
                    </div>
                    {[
                      {
                        r: "C-1234-2026",
                        c: "González con Muñoz",
                        s: "Activa",
                        sc: "text-blue-400 bg-blue-500/10",
                      },
                      {
                        r: "C-892-2025",
                        c: "Pérez con Inv. SpA",
                        s: "Sentencia",
                        sc: "text-emerald-400 bg-emerald-500/10",
                      },
                      {
                        r: "L-456-2026",
                        c: "Soto con Empresa Ltda.",
                        s: "Activa",
                        sc: "text-blue-400 bg-blue-500/10",
                      },
                    ].map((row) => (
                      <div
                        key={row.r}
                        className="flex items-center justify-between px-3 py-2.5 border-b border-white/5 last:border-0"
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-xs font-mono text-slate-400">
                            {row.r}
                          </span>
                          <span className="text-xs text-slate-300">
                            {row.c}
                          </span>
                        </div>
                        <span
                          className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${row.sc}`}
                        >
                          {row.s}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Mock AI Banner */}
                  <div className="rounded-lg bg-gradient-to-r from-blue-600/20 to-indigo-600/20 border border-blue-500/20 p-3 flex items-center gap-3">
                    <Brain className="w-5 h-5 text-blue-400 shrink-0" />
                    <div>
                      <p className="text-xs font-semibold text-white">
                        IA Legal Activa
                      </p>
                      <p className="text-[10px] text-slate-400">
                        3 documentos analizados hoy
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating decorative elements */}
              <div className="absolute -top-4 -right-4 w-24 h-24 bg-blue-600/10 rounded-2xl blur-2xl" />
              <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-indigo-600/10 rounded-2xl blur-2xl" />
            </div>
          </div>
        </div>

        {/* Bottom wave divider */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg
            viewBox="0 0 1440 80"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-full"
          >
            <path
              d="M0 80L60 73.3C120 66.7 240 53.3 360 46.7C480 40 600 40 720 46.7C840 53.3 960 66.7 1080 70C1200 73.3 1320 66.7 1380 63.3L1440 60V80H1380C1320 80 1200 80 1080 80C960 80 840 80 720 80C600 80 480 80 360 80C240 80 120 80 60 80H0Z"
              fill="white"
              className="dark:fill-slate-950"
            />
          </svg>
        </div>
      </section>

      {/* ============================================================
          FEATURES SECTION
          ============================================================ */}
      <section
        id="caracteristicas"
        className="py-24 lg:py-32 bg-white dark:bg-slate-950"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16 lg:mb-20">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-50 dark:bg-blue-950/30 border border-blue-100 dark:border-blue-900/30 mb-4">
              <span className="text-xs font-semibold text-blue-600 dark:text-blue-400 tracking-wide uppercase">
                Funcionalidades
              </span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-gray-900 dark:text-white tracking-tight">
              Todo lo que necesitas en{" "}
              <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                un solo lugar
              </span>
            </h2>
            <p className="mt-4 text-lg text-gray-500 dark:text-slate-400">
              Herramientas diseñadas específicamente para el sistema jurídico
              chileno. Sin complicaciones, sin curva de aprendizaje.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="group relative rounded-2xl border border-gray-100 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 hover:shadow-xl hover:shadow-gray-200/50 dark:hover:shadow-black/20 transition-all duration-300 hover:-translate-y-1"
              >
                <div
                  className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-4 shadow-lg`}
                >
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                  {feature.title}
                </h3>
                <p className="text-sm text-gray-500 dark:text-slate-400 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================
          STATS SECTION
          ============================================================ */}
      <section className="py-20 bg-gradient-to-br from-slate-900 via-blue-950 to-indigo-950 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 left-1/3 w-72 h-72 bg-blue-600/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/3 w-72 h-72 bg-indigo-600/10 rounded-full blur-3xl" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Números que hablan por sí solos
            </h2>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center group">
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-white/5 border border-white/10 mb-4 group-hover:bg-white/10 transition-colors">
                  <stat.icon className="w-7 h-7 text-blue-400" />
                </div>
                <p className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                  {stat.value}
                </p>
                <p className="mt-1 text-sm font-medium text-slate-400">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================
          COMPARISON SECTION
          ============================================================ */}
      <section
        id="comparacion"
        className="py-24 lg:py-32 bg-gray-50 dark:bg-slate-900"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-50 dark:bg-blue-950/30 border border-blue-100 dark:border-blue-900/30 mb-4">
              <span className="text-xs font-semibold text-blue-600 dark:text-blue-400 tracking-wide uppercase">
                Comparativa
              </span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-gray-900 dark:text-white tracking-tight">
              ¿Por qué{" "}
              <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                LexaChile
              </span>
              ?
            </h2>
            <p className="mt-4 text-lg text-gray-500 dark:text-slate-400">
              Comparamos nuestra plataforma con las alternativas del mercado
              chileno.
            </p>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-gray-200 dark:border-slate-700 shadow-lg bg-white dark:bg-slate-800">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200 dark:border-slate-700">
                  <th className="text-left px-6 py-5 text-sm font-bold text-gray-900 dark:text-white">
                    Funcionalidad
                  </th>
                  <th className="px-6 py-5 text-center">
                    <div className="inline-flex items-center gap-2">
                      <div className="w-7 h-7 rounded-lg bg-blue-600 flex items-center justify-center">
                        <Scale className="w-4 h-4 text-white" />
                      </div>
                      <span className="font-bold text-blue-600 dark:text-blue-400">
                        LexaChile
                      </span>
                    </div>
                  </th>
                  <th className="px-6 py-5 text-center font-semibold text-gray-500 dark:text-slate-400">
                    JusticeNow
                  </th>
                  <th className="px-6 py-5 text-center font-semibold text-gray-500 dark:text-slate-400">
                    Lemontech
                  </th>
                  <th className="px-6 py-5 text-center font-semibold text-gray-500 dark:text-slate-400 hidden sm:table-cell">
                    Otros
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-slate-700">
                {comparisonFeatures.map((row) => (
                  <tr
                    key={row.name}
                    className="hover:bg-gray-50 dark:hover:bg-slate-700/50 transition-colors"
                  >
                    <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">
                      {row.name}
                    </td>
                    <td className="px-6 py-4 text-center">
                      {typeof row.lexa === "boolean" ? (
                        row.lexa ? (
                          <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-emerald-100 dark:bg-emerald-900/30">
                            <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                          </span>
                        ) : (
                          <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-red-100 dark:bg-red-900/30">
                            <X className="w-4 h-4 text-red-500 dark:text-red-400" />
                          </span>
                        )
                      ) : (
                        <span className="inline-flex px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 font-bold text-xs">
                          {row.lexa}
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-center">
                      {typeof row.justice === "boolean" ? (
                        row.justice ? (
                          <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-emerald-100 dark:bg-emerald-900/30">
                            <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                          </span>
                        ) : (
                          <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-red-100 dark:bg-red-900/30">
                            <X className="w-4 h-4 text-red-500 dark:text-red-400" />
                          </span>
                        )
                      ) : (
                        <span className="text-xs font-medium text-gray-500 dark:text-slate-400">
                          {row.justice}
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-center">
                      {typeof row.lemon === "boolean" ? (
                        row.lemon ? (
                          <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-emerald-100 dark:bg-emerald-900/30">
                            <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                          </span>
                        ) : (
                          <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-red-100 dark:bg-red-900/30">
                            <X className="w-4 h-4 text-red-500 dark:text-red-400" />
                          </span>
                        )
                      ) : (
                        <span className="text-xs font-medium text-gray-500 dark:text-slate-400">
                          {row.lemon}
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-center hidden sm:table-cell">
                      {typeof row.others === "boolean" ? (
                        row.others ? (
                          <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-emerald-100 dark:bg-emerald-900/30">
                            <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                          </span>
                        ) : (
                          <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-red-100 dark:bg-red-900/30">
                            <X className="w-4 h-4 text-red-500 dark:text-red-400" />
                          </span>
                        )
                      ) : (
                        <span className="text-xs font-medium text-gray-500 dark:text-slate-400">
                          {row.others}
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* ============================================================
          CTA SECTION
          ============================================================ */}
      <section
        id="contacto"
        className="py-24 lg:py-32 bg-white dark:bg-slate-950"
      >
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-gray-900 dark:text-white tracking-tight">
            Comienza a usar{" "}
            <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              LexaChile
            </span>{" "}
            hoy
          </h2>
          <p className="mt-4 text-lg text-gray-500 dark:text-slate-400">
            Únete a la plataforma jurídica que está transformando la práctica
            legal en Chile.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-3 max-w-lg mx-auto">
            <input
              type="email"
              placeholder="Tu correo electrónico"
              className="w-full sm:flex-1 px-5 py-4 rounded-xl border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
            />
            <Link
              href="/register"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-xl transition-all shadow-lg shadow-blue-600/25 hover:shadow-blue-500/30 text-sm whitespace-nowrap"
            >
              Comenzar Gratis
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <p className="mt-4 text-sm text-gray-400 dark:text-slate-500">
            Sin tarjeta de crédito. Sin compromisos. Cancela cuando quieras.
          </p>
        </div>
      </section>

      {/* ============================================================
          FOOTER
          ============================================================ */}
      <footer className="bg-slate-900 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 lg:gap-16">
            {/* Brand */}
            <div className="col-span-2 md:col-span-1">
              <div className="flex items-center gap-2.5 mb-4">
                <div className="w-9 h-9 rounded-lg bg-blue-600 flex items-center justify-center">
                  <Scale className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold text-white tracking-tight">
                  Lexa<span className="text-blue-400">Chile</span>
                </span>
              </div>
              <p className="text-sm text-slate-400 leading-relaxed max-w-xs">
                La plataforma jurídica más completa de Chile. Gestiona tu
                práctica legal con inteligencia artificial.
              </p>
            </div>

            {/* Producto */}
            <div>
              <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4">
                Producto
              </h4>
              <ul className="space-y-3">
                {[
                  "Gestión de Causas",
                  "CRM de Clientes",
                  "Calendario",
                  "Documentos IA",
                  "Consulta PJUD",
                ].map((item) => (
                  <li key={item}>
                    <a
                      href="#"
                      className="text-sm text-slate-400 hover:text-white transition-colors"
                    >
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Legal */}
            <div>
              <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4">
                Legal
              </h4>
              <ul className="space-y-3">
                {[
                  "Términos de Servicio",
                  "Política de Privacidad",
                  "Cookies",
                  "Licencias",
                ].map((item) => (
                  <li key={item}>
                    <a
                      href="#"
                      className="text-sm text-slate-400 hover:text-white transition-colors"
                    >
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Soporte */}
            <div>
              <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4">
                Soporte
              </h4>
              <ul className="space-y-3">
                {[
                  "Centro de Ayuda",
                  "Documentación",
                  "Estado del Sistema",
                  "Contacto",
                ].map((item) => (
                  <li key={item}>
                    <a
                      href="#"
                      className="text-sm text-slate-400 hover:text-white transition-colors"
                    >
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="mt-12 pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-sm text-slate-500">
              © 2024 LexaChile. Todos los derechos reservados.
            </p>
            <p className="text-sm text-slate-500">
              Hecho con <span className="text-red-500">&#10084;</span> en Chile
            </p>
          </div>
        </div>
      </footer>
    </main>
  );
}
