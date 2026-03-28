"use client";

import { useState, useMemo, useEffect, useCallback } from "react";
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Plus,
  Clock,
  MapPin,
  Scale,
  X,
  Loader2,
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
  descripcion: string | null;
  tipo: TipoEvento;
  fechaInicio: string;
  fechaFin?: string | null;
  todoElDia?: boolean;
  color?: string;
  causa?: { id: string; rol: string; caratulado: string } | null;
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

interface CausaOption {
  id: string;
  rol: string;
  caratulado: string;
}

export default function CalendarioPage() {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDay, setSelectedDay] = useState<Date | null>(null);
  const [showNewEvent, setShowNewEvent] = useState(false);

  const [eventos, setEventos] = useState<Evento[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // New event form state
  const [newEvento, setNewEvento] = useState({
    titulo: "",
    tipo: "audiencia" as TipoEvento,
    fecha: "",
    horaInicio: "",
    horaFin: "",
    descripcion: "",
    causaId: "",
    lugar: "",
  });
  const [savingEvento, setSavingEvento] = useState(false);
  const [causasOptions, setCausasOptions] = useState<CausaOption[]>([]);
  const [session, setSession] = useState<{ user?: { id: string } } | null>(null);

  const fetchEventos = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/eventos");
      if (!res.ok) throw new Error("Error al cargar eventos");
      const json = await res.json();
      setEventos(json.data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error desconocido");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchEventos();
    // Load causas for the form selector and session
    Promise.all([
      fetch("/api/causas?limit=100").then((r) => r.json()),
      fetch("/api/auth/session").then((r) => r.json()),
    ]).then(([causasJson, sess]) => {
      setCausasOptions(
        (causasJson.data || []).map((c: CausaOption) => ({
          id: c.id,
          rol: c.rol,
          caratulado: c.caratulado,
        }))
      );
      setSession(sess);
    }).catch(() => {});
  }, [fetchEventos]);

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
    eventos.filter((e) => isSameDay(parseISO(e.fechaInicio), day));

  const selectedDayEvents = selectedDay ? getEventsForDay(selectedDay) : [];

  const upcomingEvents = useMemo(() => {
    const today = new Date();
    return eventos
      .filter((e) => parseISO(e.fechaInicio) >= today)
      .sort(
        (a, b) =>
          parseISO(a.fechaInicio).getTime() - parseISO(b.fechaInicio).getTime()
      )
      .slice(0, 5);
  }, [eventos]);

  const diasSemana = ["Lun", "Mar", "Mie", "Jue", "Vie", "Sab", "Dom"];

  function getEventHora(evento: Evento): string | undefined {
    try {
      const d = parseISO(evento.fechaInicio);
      const h = d.getHours();
      const m = d.getMinutes();
      if (h === 0 && m === 0) return undefined;
      return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
    } catch {
      return undefined;
    }
  }

  function getEventCausaLabel(evento: Evento): string | undefined {
    if (evento.causa) {
      return `${evento.causa.rol} - ${evento.causa.caratulado}`;
    }
    return undefined;
  }

  async function handleSaveEvento() {
    if (!newEvento.titulo || !newEvento.tipo || !newEvento.fecha) return;
    setSavingEvento(true);
    try {
      const fechaInicio = newEvento.horaInicio
        ? `${newEvento.fecha}T${newEvento.horaInicio}:00`
        : `${newEvento.fecha}T00:00:00`;
      const fechaFin =
        newEvento.horaFin
          ? `${newEvento.fecha}T${newEvento.horaFin}:00`
          : undefined;

      const res = await fetch("/api/eventos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          titulo: newEvento.titulo,
          descripcion: newEvento.descripcion || undefined,
          tipo: newEvento.tipo,
          fechaInicio,
          fechaFin,
          todoElDia: !newEvento.horaInicio,
          causaId: newEvento.causaId || undefined,
          usuarioId: session?.user?.id || "",
        }),
      });

      if (!res.ok) throw new Error("Error al crear evento");

      setShowNewEvent(false);
      setNewEvento({
        titulo: "",
        tipo: "audiencia",
        fecha: "",
        horaInicio: "",
        horaFin: "",
        descripcion: "",
        causaId: "",
        lugar: "",
      });
      fetchEventos();
    } catch {
      alert("Error al guardar el evento");
    } finally {
      setSavingEvento(false);
    }
  }

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

      {/* Error */}
      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
          {error}
        </div>
      )}

      {/* Loading */}
      {loading ? (
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-gray-200 dark:border-slate-800 shadow-sm p-12 text-center">
          <Loader2 className="w-8 h-8 text-blue-500 mx-auto mb-3 animate-spin" />
          <p className="text-gray-500 text-sm">Cargando eventos...</p>
        </div>
      ) : (
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
                          const config = tipoConfig[event.tipo] || tipoConfig.reunion;
                          const hora = getEventHora(event);
                          return (
                            <div
                              key={event.id}
                              className={`
                                text-[10px] font-medium px-1.5 py-0.5 rounded truncate
                                ${config.bg} ${config.text}
                              `}
                              title={event.titulo}
                            >
                              {hora && (
                                <span className="font-semibold">
                                  {hora}{" "}
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
                        const config = tipoConfig[event.tipo] || tipoConfig.reunion;
                        const hora = getEventHora(event);
                        const causaLabel = getEventCausaLabel(event);
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
                                {event.descripcion && (
                                  <p className="text-xs text-gray-500 dark:text-slate-400 mt-0.5">
                                    {event.descripcion}
                                  </p>
                                )}
                                {hora && (
                                  <div className="flex items-center gap-1 mt-1.5">
                                    <Clock className="w-3 h-3 text-gray-400" />
                                    <span className="text-xs text-gray-600 dark:text-slate-300">
                                      {hora}
                                    </span>
                                  </div>
                                )}
                                {causaLabel && (
                                  <div className="flex items-center gap-1 mt-1">
                                    <Scale className="w-3 h-3 text-gray-400" />
                                    <span className="text-xs text-gray-600 dark:text-slate-300">
                                      {causaLabel}
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
                {upcomingEvents.length === 0 ? (
                  <p className="text-sm text-gray-400 text-center py-6">Sin eventos próximos</p>
                ) : (
                  upcomingEvents.map((event) => {
                    const config = tipoConfig[event.tipo] || tipoConfig.reunion;
                    const hora = getEventHora(event);
                    const causaLabel = getEventCausaLabel(event);
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
                              {hora && ` - ${hora}`}
                            </p>
                            {causaLabel && (
                              <p className="text-xs text-gray-400 dark:text-slate-500 mt-0.5 truncate">
                                {causaLabel}
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
                  })
                )}
              </div>
            </div>
          </div>
        </div>
      )}

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
                  value={newEvento.titulo}
                  onChange={(e) => setNewEvento((p) => ({ ...p, titulo: e.target.value }))}
                  placeholder="Ej: Audiencia Preparatoria"
                  className="w-full px-3.5 py-2.5 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl text-sm text-gray-900 dark:text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1.5">
                    Tipo
                  </label>
                  <select
                    value={newEvento.tipo}
                    onChange={(e) => setNewEvento((p) => ({ ...p, tipo: e.target.value as TipoEvento }))}
                    className="w-full px-3.5 py-2.5 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
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
                    value={newEvento.fecha}
                    onChange={(e) => setNewEvento((p) => ({ ...p, fecha: e.target.value }))}
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
                    value={newEvento.horaInicio}
                    onChange={(e) => setNewEvento((p) => ({ ...p, horaInicio: e.target.value }))}
                    className="w-full px-3.5 py-2.5 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1.5">
                    Hora fin
                  </label>
                  <input
                    type="time"
                    value={newEvento.horaFin}
                    onChange={(e) => setNewEvento((p) => ({ ...p, horaFin: e.target.value }))}
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
                  value={newEvento.descripcion}
                  onChange={(e) => setNewEvento((p) => ({ ...p, descripcion: e.target.value }))}
                  placeholder="Detalles del evento..."
                  className="w-full px-3.5 py-2.5 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl text-sm text-gray-900 dark:text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1.5">
                  Causa asociada
                </label>
                <select
                  value={newEvento.causaId}
                  onChange={(e) => setNewEvento((p) => ({ ...p, causaId: e.target.value }))}
                  className="w-full px-3.5 py-2.5 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Sin causa asociada</option>
                  {causasOptions.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.rol} - {c.caratulado}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1.5">
                  Lugar
                </label>
                <input
                  type="text"
                  value={newEvento.lugar}
                  onChange={(e) => setNewEvento((p) => ({ ...p, lugar: e.target.value }))}
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
                onClick={handleSaveEvento}
                disabled={savingEvento || !newEvento.titulo || !newEvento.fecha}
                className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white text-sm font-semibold rounded-xl shadow-sm shadow-blue-600/20 transition-colors inline-flex items-center gap-2"
              >
                {savingEvento && <Loader2 className="w-4 h-4 animate-spin" />}
                {savingEvento ? "Guardando..." : "Guardar Evento"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
