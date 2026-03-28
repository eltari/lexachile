import {
  Scale,
  Users,
  Calendar,
  FileText,
  TrendingUp,
  TrendingDown,
  Clock,
  ArrowRight,
} from "lucide-react";

const stats = [
  {
    label: "Causas Activas",
    value: 24,
    icon: Scale,
    trend: "+3 este mes",
    trendUp: true,
    color: "blue",
  },
  {
    label: "Clientes",
    value: 156,
    icon: Users,
    trend: "+12 este mes",
    trendUp: true,
    color: "emerald",
  },
  {
    label: "Audiencias Pendientes",
    value: 8,
    icon: Calendar,
    trend: "3 esta semana",
    trendUp: false,
    color: "amber",
  },
  {
    label: "Documentos",
    value: 342,
    icon: FileText,
    trend: "+28 este mes",
    trendUp: true,
    color: "violet",
  },
];

const colorMap: Record<string, { bg: string; iconBg: string; iconText: string; trendText: string }> = {
  blue: {
    bg: "bg-blue-50 dark:bg-blue-900/20",
    iconBg: "bg-blue-100 dark:bg-blue-900/40",
    iconText: "text-blue-600 dark:text-blue-400",
    trendText: "text-blue-600 dark:text-blue-400",
  },
  emerald: {
    bg: "bg-emerald-50 dark:bg-emerald-900/20",
    iconBg: "bg-emerald-100 dark:bg-emerald-900/40",
    iconText: "text-emerald-600 dark:text-emerald-400",
    trendText: "text-emerald-600 dark:text-emerald-400",
  },
  amber: {
    bg: "bg-amber-50 dark:bg-amber-900/20",
    iconBg: "bg-amber-100 dark:bg-amber-900/40",
    iconText: "text-amber-600 dark:text-amber-400",
    trendText: "text-amber-600 dark:text-amber-400",
  },
  violet: {
    bg: "bg-violet-50 dark:bg-violet-900/20",
    iconBg: "bg-violet-100 dark:bg-violet-900/40",
    iconText: "text-violet-600 dark:text-violet-400",
    trendText: "text-violet-600 dark:text-violet-400",
  },
};

const recentCausas = [
  {
    rol: "C-1234-2026",
    caratulado: "González con Muñoz",
    materia: "Civil - Cobro de pesos",
    estado: "En tramitación",
    estadoColor: "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300",
    fecha: "25/03/2026",
  },
  {
    rol: "C-892-2025",
    caratulado: "Pérez con Inversiones SpA",
    materia: "Civil - Indemnización",
    estado: "Sentencia",
    estadoColor: "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300",
    fecha: "22/03/2026",
  },
  {
    rol: "L-456-2026",
    caratulado: "Soto con Empresa Ltda.",
    materia: "Laboral - Despido injustificado",
    estado: "En tramitación",
    estadoColor: "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300",
    fecha: "20/03/2026",
  },
  {
    rol: "F-789-2026",
    caratulado: "Rodríguez con Rodríguez",
    materia: "Familia - Alimentos",
    estado: "Mediación",
    estadoColor: "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300",
    fecha: "18/03/2026",
  },
  {
    rol: "C-321-2026",
    caratulado: "López con Banco Nacional",
    materia: "Civil - Nulidad contrato",
    estado: "Autos para fallo",
    estadoColor: "bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300",
    fecha: "15/03/2026",
  },
];

const upcomingEvents = [
  {
    title: "Audiencia Preparatoria",
    causa: "C-1234-2026 - González con Muñoz",
    date: "Lun 30 Mar, 09:00",
    tribunal: "1er Juzgado Civil de Santiago",
    urgent: true,
  },
  {
    title: "Audiencia de Juicio",
    causa: "L-456-2026 - Soto con Empresa Ltda.",
    date: "Mar 31 Mar, 11:00",
    tribunal: "2do Juzgado de Letras del Trabajo",
    urgent: false,
  },
  {
    title: "Mediación Familiar",
    causa: "F-789-2026 - Rodríguez con Rodríguez",
    date: "Mié 01 Abr, 10:00",
    tribunal: "Centro de Mediación Familiar",
    urgent: false,
  },
  {
    title: "Vencimiento Plazo - Contestación",
    causa: "C-321-2026 - López con Banco Nacional",
    date: "Jue 02 Abr, 23:59",
    tribunal: "5to Juzgado Civil de Santiago",
    urgent: true,
  },
];

export default function DashboardPage() {
  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Welcome */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Bienvenido, Alejandro
        </h1>
        <p className="text-sm text-gray-500 dark:text-slate-400 mt-1">
          Aquí tienes un resumen de tu actividad jurídica.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => {
          const colors = colorMap[stat.color];
          return (
            <div
              key={stat.label}
              className="bg-white dark:bg-slate-900 rounded-xl border border-gray-200 dark:border-slate-800 p-5 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between">
                <div
                  className={`w-10 h-10 rounded-lg flex items-center justify-center ${colors.iconBg}`}
                >
                  <stat.icon className={`w-5 h-5 ${colors.iconText}`} />
                </div>
                {stat.trendUp ? (
                  <TrendingUp className="w-4 h-4 text-green-500" />
                ) : (
                  <TrendingDown className="w-4 h-4 text-amber-500" />
                )}
              </div>
              <div className="mt-3">
                <p className="text-3xl font-bold text-gray-900 dark:text-white">
                  {stat.value}
                </p>
                <p className="text-sm text-gray-500 dark:text-slate-400 mt-0.5">
                  {stat.label}
                </p>
              </div>
              <p className={`text-xs mt-2 font-medium ${colors.trendText}`}>
                {stat.trend}
              </p>
            </div>
          );
        })}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Causas */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-xl border border-gray-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 dark:border-slate-800">
            <h2 className="text-base font-semibold text-gray-900 dark:text-white">
              Causas Recientes
            </h2>
            <button className="flex items-center gap-1 text-xs font-medium text-blue-600 dark:text-blue-400 hover:underline">
              Ver todas <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 dark:border-slate-800">
                  <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 dark:text-slate-400 uppercase tracking-wider">
                    ROL
                  </th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 dark:text-slate-400 uppercase tracking-wider">
                    Caratulado
                  </th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 dark:text-slate-400 uppercase tracking-wider hidden md:table-cell">
                    Materia
                  </th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 dark:text-slate-400 uppercase tracking-wider">
                    Estado
                  </th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 dark:text-slate-400 uppercase tracking-wider hidden sm:table-cell">
                    Fecha
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 dark:divide-slate-800/50">
                {recentCausas.map((causa) => (
                  <tr
                    key={causa.rol}
                    className="hover:bg-gray-50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer"
                  >
                    <td className="px-5 py-3 font-mono text-xs font-medium text-gray-900 dark:text-white">
                      {causa.rol}
                    </td>
                    <td className="px-5 py-3 font-medium text-gray-900 dark:text-white">
                      {causa.caratulado}
                    </td>
                    <td className="px-5 py-3 text-gray-500 dark:text-slate-400 hidden md:table-cell">
                      {causa.materia}
                    </td>
                    <td className="px-5 py-3">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${causa.estadoColor}`}
                      >
                        {causa.estado}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-gray-500 dark:text-slate-400 hidden sm:table-cell">
                      {causa.fecha}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Upcoming Events */}
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-gray-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 dark:border-slate-800">
            <h2 className="text-base font-semibold text-gray-900 dark:text-white">
              Próximas Audiencias
            </h2>
            <button className="flex items-center gap-1 text-xs font-medium text-blue-600 dark:text-blue-400 hover:underline">
              Ver todas <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
          <div className="divide-y divide-gray-50 dark:divide-slate-800/50">
            {upcomingEvents.map((event, i) => (
              <div
                key={i}
                className="px-5 py-4 hover:bg-gray-50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer"
              >
                <div className="flex items-start gap-3">
                  <div
                    className={`mt-0.5 w-2 h-2 rounded-full shrink-0 ${
                      event.urgent ? "bg-red-500" : "bg-blue-500"
                    }`}
                  />
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-gray-900 dark:text-white">
                      {event.title}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-slate-400 mt-0.5 truncate">
                      {event.causa}
                    </p>
                    <div className="flex items-center gap-1 mt-1.5">
                      <Clock className="w-3 h-3 text-gray-400 dark:text-slate-500" />
                      <span className="text-xs font-medium text-gray-600 dark:text-slate-300">
                        {event.date}
                      </span>
                    </div>
                    <p className="text-xs text-gray-400 dark:text-slate-500 mt-0.5">
                      {event.tribunal}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
