"use client";

import { useState, useMemo } from "react";
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Plus,
  Clock,
  MapPin,
  Scale,
  X,
} from "lucide-react";
import {
  format,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  addDays,
  addMonths,
  subMonths,
  isSameMonth,
  isSameDay,
  isToday,
  parseISO,
} from "date-fns";
import { es } from "date-fns/locale";

type TipoEvento = "audiencia" | "plazo" | "vencimiento" | "reunion";

interface Evento {
  id: string;
  titulo: string;
  descripcion: string;
  tipo: TipoEvento;
  fechaInicio: string;
  fechaFin?: string;
  hora?: string;
  lugar?: string;
  causa?: string;
  completado: boolean;
}

const tipoConfig: Record<
  TipoEvento,
  { label: string; bg: string; text: string; dot: string; border: string }
> = {
  audiencia: {
    label: "Audiencia",
    bg: "bg-red-50 dark:bg-red-900/20",
    text: "text-red-700 dark:text-red-300",
    dot: "bg-red-500",
    border: "border-red-200 dark:border-red-800",
  },
  plazo: {
    label: "Plazo",
    bg: "bg-blue-50 dark:bg-blue-900/20",
    text: "text-blue-700 dark:text-blue-300",
    dot: "bg-blue-500",
    border: "border-blue-200 dark:border-blue-800",
  },
  vencimiento: {
    label: "Vencimiento",
    bg: "bg-amber-50 dark:bg-amber-900/20",
    text: "text-amber-700 dark:text-amber-300",
    dot: "bg-amber-500",
    border: "border-amber-200 dark:border-amber-800",
  },
  reunion: {
    label: "Reunion",
    bg: "bg-emerald-50 dark:bg-emerald-900/20",
    text: "text-emerald-700 dark:text-emerald-300",
    dot: "bg-emerald-500",
    border: "border-emerald-200 dark:border-emerald-800",
  },
};

// Mock data: 12 events across current and next month
const now = new Date();
const y = now.getFullYear();
const m = now.getMonth();

const mockEventos: Evento[] = [
  {
    id: "1",
    titulo: "Audiencia Preparatoria",
    descripcion: "Audiencia preparatoria causa Gonzalez con Munoz",
    tipo: "audiencia",
    fechaInicio: new Date(y, m, 5, 9, 0).toISOString(),
    hora: "09:00",
    lugar: "1er Juzgado Civil de Santiago, Sala 3",
    causa: "C-1234-2026 - Gonzalez con Munoz",
    completado: false,
  },
  {
    id: "2",
    titulo: "Vencimiento Plazo Contestacion",
    descripcion: "Ultimo dia para presentar contestacion de demanda",
    tipo: "vencimiento",
    fechaInicio: new Date(y, m, 8).toISOString(),
    causa: "C-321-2026 - Lopez con Banco Nacional",
    completado: false,
  },
  {
    id: "3",
    titulo: "Reunion con Cliente",
    descripcion: "Revision de estrategia procesal con cliente Perez",
    tipo: "reunion",
    fechaInicio: new Date(y, m, 10, 15, 0).toISOString(),
    hora: "15:00",
    lugar: "Oficina Principal",
    causa: "C-892-2025 - Perez con Inversiones SpA",
    completado: false,
  },
  {
    id: "4",
    titulo: "Plazo Prueba Documental",
    descripcion: "Presentar documentos en periodo probatorio",
    tipo: "plazo",
    fechaInicio: new Date(y, m, 12).toISOString(),
    causa: "C-1234-2026 - Gonzalez con Munoz",
    completado: false,
  },
  {
    id: "5",
    titulo: "Audiencia de Juicio Oral",
    descripcion: "Audiencia de juicio oral laboral",
    tipo: "audiencia",
    fechaInicio: new Date(y, m, 15, 11, 0).toISOString(),
    hora: "11:00",
    lugar: "2do Juzgado de Letras del Trabajo, Sala 1",
    causa: "L-456-2026 - Soto con Empresa Ltda.",
    completado: false,
  },
  {
    id: "6",
    titulo: "Mediacion Familiar",
    descripcion: "Sesion de mediacion por causa de alimentos",
    tipo: "reunion",
    fechaInicio: new Date(y, m, 18, 10, 0).toISOString(),
    hora: "10:00",
    lugar: "Centro de Mediacion Familiar",
    causa: "F-789-2026 - Rodriguez con Rodriguez",
    completado: false,
  },
  {
    id: "7",
    titulo: "Vencimiento Recurso Apelacion",
    descripcion: "Ultimo dia para interponer recurso de apelacion",
    tipo: "vencimiento",
    fechaInicio: new Date(y, m, 20).toISOString(),
    causa: "C-892-2025 - Perez con Inversiones SpA",
    completado: false,
  },
  {
    id: "8",
    titulo: "Plazo Observaciones a la Prueba",
    descripcion: "Presentar observaciones a la prueba rendida",
    tipo: "plazo",
    fechaInicio: new Date(y, m, 22).toISOString(),
    causa: "C-1234-2026 - Gonzalez con Munoz",
    completado: false,
  },
  {
    id: "9",
    titulo: "Audiencia Conciliacion",
    descripcion: "Audiencia obligatoria de conciliacion",
    tipo: "audiencia",
    fechaInicio: new Date(y, m + 1, 3, 9, 30).toISOString(),
    hora: "09:30",
    lugar: "5to Juzgado Civil de Santiago, Sala 2",
    causa: "C-321-2026 - Lopez con Banco Nacional",
    completado: false,
  },
  {
    id: "10",
    titulo: "Reunion Equipo Legal",
    descripcion: "Revision semanal de causas activas",
    tipo: "reunion",
    fechaInicio: new Date(y, m + 1, 7, 14, 0).toISOString(),
    hora: "14:00",
    lugar: "Sala de Reuniones",
    completado: false,
  },
  {
    id: "11",
    titulo: "Vencimiento Inscripcion CBR",
    descripcion: "Plazo para inscribir compraventa en Conservador",
    tipo: "vencimiento",
    fechaInicio: new Date(y, m + 1, 12).toISOString(),
    completado: false,
  },
  {
    id: "12",
    titulo: "Audiencia de Lectura de Sentencia",
    descripcion: "Lectura de sentencia definitiva",
    tipo: "audiencia",
    fechaInicio: new Date(y, m + 1, 15, 10, 0).toISOString(),
    hora: "10:00",
    lugar: "1er Juzgado Civil de Santiago, Sala 1",
    causa: "C-1234-2026 - Gonzalez con Munoz",
    completado: false,
  },
];

export default function CalendarioPage() {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDay, setSelectedDay] = useState<Date | null>(null);
  const [showNewEvent, setShowNewEvent] = useState(false);

  const calendarDays = useMemo(() => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(currentMonth);
    const calStart = startOfWeek(monthStart, { weekStartsOn: 1 });
    const calEnd = endOfWeek(monthEnd, { weekStartsOn: 1 });

    const days: Date[] = [];
    let day = calStart;
    while (day <= calEnd) {
      days.push(day);
      day = addDays(day, 1);
    }
    return days;
  }, [currentMonth]);

  const getEventsForDay = (day: Date) =>
    mockEventos.filter((e) => isSameDay(parseISO(e.fechaInicio), day));

  const selectedDayEvents = selectedDay ? getEventsForDay(selectedDay) : [];

  const upcomingEvents = useMemo(() => {
    const today = new Date();
    return mockEventos
      .filter((e) => parseISO(e.fechaInicio) >= today)
      .sort(
        (a, b) =>
          parseISO(a.fechaInicio).getTime() - parseISO(b.fechaInicio).getTime()
      )
      .slice(0, 5);
  }, []);

  const diasSemana = ["Lun", "Mar", "Mie", "Jue", "Vie", "Sab", "Dom"];

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Calendario Juridico
          </h1>
          <p className="text-sm text-gray-500 dark:text-slate-400 mt-1">
            Gestiona tus audiencias, plazos y reuniones
          </p>
        </div>
        <button
          onClick={() => setShowNewEvent(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-semibold shadow-sm shadow-blue-600/20 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Nuevo Evento
        </button>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
        {/* Main Calendar */}
        <div className="xl:col-span-3 bg-white dark:bg-slate-900 rounded-xl border border-gray-200 dark:border-slate-800 shadow-sm">
          {/* Month Navigation */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-slate-800">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white capitalize">
              {format(currentMonth, "MMMM yyyy", { locale: es })}
            </h2>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
                className="p-2 rounded-lg text-gray-500 hover:text-gray-900 hover:bg-gray-100 dark:text-slate-400 dark:hover:text-white dark:hover:bg-slate-800 transition-colors"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={() => setCurrentMonth(new Date())}
                className="px-3 py-1.5 rounded-lg text-sm font-medium text-blue-600 hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-blue-900/20 transition-colors"
              >
                Hoy
              </button>
              <button
                onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
                className="p-2 rounded-lg text-gray-500 hover:text-gray-900 hover:bg-gray-100 dark:text-slate-400 dark:hover:text-white dark:hover:bg-slate-800 transition-colors"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Tipo Legend */}
          <div className="flex flex-wrap gap-4 px-6 py-3 border-b border-gray-50 dark:border-slate-800/50">
            {(Object.entries(tipoConfig) as [TipoEvento, typeof tipoConfig.audiencia][]).map(
              ([key, config]) => (
                <div key={key} className="flex items-center gap-1.5">
                  <div className={`w-2.5 h-2.5 rounded-full ${config.dot}`} />
                  <span className="text-xs text-gray-500 dark:text-slate-400">
                    {config.label}
                  </span>
                </div>
              )
            )}
          </div>

          {/* Calendar Grid */}
          <div className="p-4">
            {/* Day Headers */}
            <div className="grid grid-cols-7 mb-2">
              {diasSemana.map((dia) => (
                <div
                  key={dia}
                  className="text-center text-xs font-semibold text-gray-400 dark:text-slate-500 uppercase tracking-wider py-2"
                >
                  {dia}
                </div>
              ))}
            </div>

            {/* Day Cells */}
            <div className="grid grid-cols-7 gap-px bg-gray-100 dark:bg-slate-800 rounded-lg overflow-hidden">
              {calendarDays.map((day, idx) => {
                const dayEvents = getEventsForDay(day);
                const isCurrentMonth = isSameMonth(day, currentMonth);
                const isTodayDate = isToday(day);
                const isSelected =
                  selectedDay !== null && isSameDay(day, selectedDay);

                return (
                  <button
                    key={idx}
                    onClick={() => setSelectedDay(day)}
                    className={`
                      min-h-[90px] p-1.5 text-left flex flex-col transition-colors
                      ${isCurrentMonth ? "bg-white dark:bg-slate-900" : "bg-gray-50 dark:bg-slate-950"}
                      ${isSelected ? "ring-2 ring-blue-500 ring-inset" : ""}
                      hover:bg-blue-50 dark:hover:bg-slate-800/80
                    `}
                  >
                    <span
                      className={`
                        inline-flex items-center justify-center w-7 h-7 rounded-full text-sm font-medium mb-0.5
                        ${isTodayDate ? "bg-blue-600 text-white" : ""}
                        ${!isTodayDate && isCurrentMonth ? "text-gray-900 dark:text-white" : ""}
                        ${!isTodayDate && !isCurrentMonth ? "text-gray-300 dark:text-slate-600" : ""}
                      `}
                    >
                      {format(day, "d")}
                    </span>
                    <div className="flex flex-col gap-0.5 overflow-hidden flex-1">
                      {dayEvents.slice(0, 3).map((event) => {
                        const config = tipoConfig[event.tipo];
                        return (
                          <div
                            key={event.id}
                            className={`
                              text-[10px] font-medium px-1.5 py-0.5 rounded truncate
                              ${config.bg} ${config.text}
                            `}
                            title={event.titulo}
                          >
                            {event.hora && (
                              <span className="font-semibold">
                                {event.hora}{" "}
                              </span>
                            )}
                            {event.titulo}
                          </div>
                        );
                      })}
                      {dayEvents.length > 3 && (
                        <span className="text-[10px] text-gray-400 dark:text-slate-500 px-1">
                          +{dayEvents.length - 3} mas
                        </span>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Selected Day Events */}
          {selectedDay && (
            <div className="bg-white dark:bg-slate-900 rounded-xl border border-gray-200 dark:border-slate-800 shadow-sm">
              <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 dark:border-slate-800">
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white capitalize">
                  {format(selectedDay, "EEEE d MMMM", { locale: es })}
                </h3>
                <button
                  onClick={() => setSelectedDay(null)}
                  className="p-1 rounded text-gray-400 hover:text-gray-600 dark:hover:text-slate-300"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="p-4">
                {selectedDayEvents.length === 0 ? (
                  <p className="text-sm text-gray-400 dark:text-slate-500 text-center py-4">
                    Sin eventos para este dia
                  </p>
                ) : (
                  <div className="space-y-3">
                    {selectedDayEvents.map((event) => {
                      const config = tipoConfig[event.tipo];
                      return (
                        <div
                          key={event.id}
                          className={`p-3 rounded-lg border ${config.bg} ${config.border}`}
                        >
                          <div className="flex items-start gap-2">
                            <div
                              className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${config.dot}`}
                            />
                            <div className="min-w-0 flex-1">
                              <p
                                className={`text-sm font-semibold ${config.text}`}
                              >
                                {event.titulo}
                              </p>
                              <p className="text-xs text-gray-500 dark:text-slate-400 mt-0.5">
                                {event.descripcion}
                              </p>
                              {event.hora && (
                                <div className="flex items-center gap-1 mt-1.5">
                                  <Clock className="w-3 h-3 text-gray-400" />
                                  <span className="text-xs text-gray-600 dark:text-slate-300">
                                    {event.hora}
                                  </span>
                                </div>
                              )}
                              {event.lugar && (
                                <div className="flex items-center gap-1 mt-1">
                                  <MapPin className="w-3 h-3 text-gray-400" />
                                  <span className="text-xs text-gray-600 dark:text-slate-300">
                                    {event.lugar}
                                  </span>
                                </div>
                              )}
                              {event.causa && (
                                <div className="flex items-center gap-1 mt-1">
                                  <Scale className="w-3 h-3 text-gray-400" />
                                  <span className="text-xs text-gray-600 dark:text-slate-300">
                                    {event.causa}
                                  </span>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Upcoming Events */}
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-gray-200 dark:border-slate-800 shadow-sm">
            <div className="px-5 py-4 border-b border-gray-100 dark:border-slate-800">
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
                Proximos Eventos
              </h3>
            </div>
            <div className="divide-y divide-gray-50 dark:divide-slate-800/50">
              {upcomingEvents.map((event) => {
                const config = tipoConfig[event.tipo];
                return (
                  <div
                    key={event.id}
                    className="px-5 py-3.5 hover:bg-gray-50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer"
                  >
                    <div className="flex items-start gap-2.5">
                      <div
                        className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${config.dot}`}
                      />
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                          {event.titulo}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-slate-400 mt-0.5">
                          {format(parseISO(event.fechaInicio), "EEE d MMM", {
                            locale: es,
                          })}
                          {event.hora && ` - ${event.hora}`}
                        </p>
                        {event.causa && (
                          <p className="text-xs text-gray-400 dark:text-slate-500 mt-0.5 truncate">
                            {event.causa}
                          </p>
                        )}
                      </div>
                      <span
                        className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${config.bg} ${config.text}`}
                      >
                        {config.label}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* New Event Modal */}
      {showNewEvent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setShowNewEvent(false)}
          />
          <div className="relative bg-white dark:bg-slate-900 rounded-2xl border border-gray-200 dark:border-slate-800 shadow-2xl w-full max-w-lg">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-slate-800">
              <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                Nuevo Evento
              </h2>
              <button
                onClick={() => setShowNewEvent(false)}
                className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 dark:hover:text-slate-300 dark:hover:bg-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1.5">
                  Titulo
                </label>
                <input
                  type="text"
                  placeholder="Ej: Audiencia Preparatoria"
                  className="w-full px-3.5 py-2.5 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl text-sm text-gray-900 dark:text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1.5">
                    Tipo
                  </label>
                  <select className="w-full px-3.5 py-2.5 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                    <option value="audiencia">Audiencia</option>
                    <option value="plazo">Plazo</option>
                    <option value="vencimiento">Vencimiento</option>
                    <option value="reunion">Reunion</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1.5">
                    Fecha
                  </label>
                  <input
                    type="date"
                    className="w-full px-3.5 py-2.5 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1.5">
                    Hora inicio
                  </label>
                  <input
                    type="time"
                    className="w-full px-3.5 py-2.5 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1.5">
                    Hora fin
                  </label>
                  <input
                    type="time"
                    className="w-full px-3.5 py-2.5 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1.5">
                  Descripcion
                </label>
                <textarea
                  rows={3}
                  placeholder="Detalles del evento..."
                  className="w-full px-3.5 py-2.5 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl text-sm text-gray-900 dark:text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1.5">
                  Causa asociada
                </label>
                <select className="w-full px-3.5 py-2.5 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                  <option value="">Sin causa asociada</option>
                  <option value="1">C-1234-2026 - Gonzalez con Munoz</option>
                  <option value="2">C-892-2025 - Perez con Inversiones SpA</option>
                  <option value="3">L-456-2026 - Soto con Empresa Ltda.</option>
                  <option value="4">F-789-2026 - Rodriguez con Rodriguez</option>
                  <option value="5">C-321-2026 - Lopez con Banco Nacional</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1.5">
                  Lugar
                </label>
                <input
                  type="text"
                  placeholder="Ej: 1er Juzgado Civil, Sala 3"
                  className="w-full px-3.5 py-2.5 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl text-sm text-gray-900 dark:text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-100 dark:border-slate-800">
              <button
                onClick={() => setShowNewEvent(false)}
                className="px-4 py-2.5 text-sm font-medium text-gray-700 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={() => setShowNewEvent(false)}
                className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-xl shadow-sm shadow-blue-600/20 transition-colors"
              >
                Guardar Evento
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
