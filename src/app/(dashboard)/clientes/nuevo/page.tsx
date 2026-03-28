"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Save, X, User, Building2, Loader2 } from "lucide-react";
import { validarRut, formatRut, regiones } from "@/lib/utils";

export default function NuevoClientePage() {
  const router = useRouter();
  const [tipo, setTipo] = useState<"natural" | "juridica">("natural");
  const [form, setForm] = useState({
    nombre: "",
    rut: "",
    email: "",
    telefono: "",
    direccion: "",
    comuna: "",
    ciudad: "",
    region: "",
    giro: "",
    representante: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);
  const [apiError, setApiError] = useState("");
  const [rutFormatted, setRutFormatted] = useState("");
  const [session, setSession] = useState<{ user?: { id: string } } | null>(null);

  useEffect(() => {
    fetch("/api/auth/session")
      .then((r) => r.json())
      .then(setSession)
      .catch(() => {});
  }, []);

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[name];
        return next;
      });
    }
  }

  function handleRutChange(e: React.ChangeEvent<HTMLInputElement>) {
    const raw = e.target.value.replace(/[^0-9kK]/g, "");
    setForm((prev) => ({ ...prev, rut: raw }));
    setRutFormatted(raw.length >= 2 ? formatRut(raw) : raw);
    if (errors.rut) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next.rut;
        return next;
      });
    }
  }

  function validate(): boolean {
    const newErrors: Record<string, string> = {};
    if (!form.nombre.trim()) newErrors.nombre = "El nombre es obligatorio";
    if (!form.rut.trim()) {
      newErrors.rut = "El RUT es obligatorio";
    } else if (!validarRut(form.rut)) {
      newErrors.rut = "El RUT ingresado no es válido";
    }
    if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      newErrors.email = "El email no tiene un formato válido";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;
    setSaving(true);
    setApiError("");

    try {
      const res = await fetch("/api/clientes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tipo,
          nombre: form.nombre,
          rut: formatRut(form.rut),
          email: form.email || undefined,
          telefono: form.telefono || undefined,
          direccion: form.direccion || undefined,
          comuna: form.comuna || undefined,
          ciudad: form.ciudad || undefined,
          region: form.region || undefined,
          giro: form.giro || undefined,
          representante: form.representante || undefined,
          abogadoId: session?.user?.id || "",
        }),
      });

      const json = await res.json();

      if (!res.ok) {
        setApiError(json.error || "Error al guardar el cliente");
        setSaving(false);
        return;
      }

      router.push("/clientes");
    } catch {
      setApiError("Error de conexión al guardar el cliente");
      setSaving(false);
    }
  }

  const fieldClass = (name: string) =>
    `w-full px-3 py-2.5 border rounded-lg text-sm outline-none transition-shadow ${
      errors[name]
        ? "border-red-300 focus:ring-2 focus:ring-red-500 focus:border-red-500"
        : "border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
    }`;

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Back */}
      <Link
        href="/clientes"
        className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Volver a Clientes
      </Link>

      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Nuevo Cliente</h1>
        <p className="mt-1 text-sm text-gray-500">
          Complete los datos para registrar un nuevo cliente
        </p>
      </div>

      {/* API Error */}
      {apiError && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
          {apiError}
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Type selector */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
          <h2 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">
            Tipo de Persona
          </h2>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setTipo("natural")}
              className={`flex items-center gap-3 p-4 rounded-lg border-2 transition-all ${
                tipo === "natural"
                  ? "border-blue-600 bg-blue-50"
                  : "border-gray-200 hover:border-gray-300 bg-white"
              }`}
            >
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  tipo === "natural" ? "bg-blue-100" : "bg-gray-100"
                }`}
              >
                <User
                  className={`w-5 h-5 ${
                    tipo === "natural" ? "text-blue-600" : "text-gray-400"
                  }`}
                />
              </div>
              <div className="text-left">
                <p
                  className={`text-sm font-semibold ${
                    tipo === "natural" ? "text-blue-900" : "text-gray-700"
                  }`}
                >
                  Persona Natural
                </p>
                <p className="text-xs text-gray-500">Persona física</p>
              </div>
            </button>
            <button
              type="button"
              onClick={() => setTipo("juridica")}
              className={`flex items-center gap-3 p-4 rounded-lg border-2 transition-all ${
                tipo === "juridica"
                  ? "border-purple-600 bg-purple-50"
                  : "border-gray-200 hover:border-gray-300 bg-white"
              }`}
            >
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  tipo === "juridica" ? "bg-purple-100" : "bg-gray-100"
                }`}
              >
                <Building2
                  className={`w-5 h-5 ${
                    tipo === "juridica" ? "text-purple-600" : "text-gray-400"
                  }`}
                />
              </div>
              <div className="text-left">
                <p
                  className={`text-sm font-semibold ${
                    tipo === "juridica" ? "text-purple-900" : "text-gray-700"
                  }`}
                >
                  Persona Jurídica
                </p>
                <p className="text-xs text-gray-500">Empresa / Sociedad</p>
              </div>
            </button>
          </div>
        </div>

        {/* Basic Info */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
          <h2 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">
            Información Básica
          </h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {tipo === "juridica" ? "Razón Social" : "Nombre Completo"}{" "}
                <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="nombre"
                value={form.nombre}
                onChange={handleChange}
                placeholder={
                  tipo === "juridica"
                    ? "Ej: Inversiones Austral SpA"
                    : "Ej: María González Soto"
                }
                className={fieldClass("nombre")}
              />
              {errors.nombre && (
                <p className="mt-1 text-xs text-red-600">{errors.nombre}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                RUT <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={rutFormatted}
                onChange={handleRutChange}
                placeholder="Ej: 12.345.678-9"
                className={fieldClass("rut")}
              />
              {errors.rut ? (
                <p className="mt-1 text-xs text-red-600">{errors.rut}</p>
              ) : (
                <p className="mt-1 text-xs text-gray-400">
                  Ingrese RUT sin puntos ni guión, se formateará automáticamente
                </p>
              )}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="correo@ejemplo.cl"
                  className={fieldClass("email")}
                />
                {errors.email && (
                  <p className="mt-1 text-xs text-red-600">{errors.email}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Teléfono
                </label>
                <input
                  type="tel"
                  name="telefono"
                  value={form.telefono}
                  onChange={handleChange}
                  placeholder="+56 9 1234 5678"
                  className={fieldClass("telefono")}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Address */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
          <h2 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">
            Dirección
          </h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Dirección
              </label>
              <input
                type="text"
                name="direccion"
                value={form.direccion}
                onChange={handleChange}
                placeholder="Calle, número, depto/oficina"
                className={fieldClass("direccion")}
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Comuna
                </label>
                <input
                  type="text"
                  name="comuna"
                  value={form.comuna}
                  onChange={handleChange}
                  placeholder="Ej: Providencia"
                  className={fieldClass("comuna")}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Ciudad
                </label>
                <input
                  type="text"
                  name="ciudad"
                  value={form.ciudad}
                  onChange={handleChange}
                  placeholder="Ej: Santiago"
                  className={fieldClass("ciudad")}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Región
                </label>
                <select
                  name="region"
                  value={form.region}
                  onChange={handleChange}
                  className={fieldClass("region")}
                >
                  <option value="">Seleccionar</option>
                  {regiones.map((r) => (
                    <option key={r} value={r}>
                      {r}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Juridica-specific */}
        {tipo === "juridica" && (
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
            <h2 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">
              Información Empresarial
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Giro
                </label>
                <input
                  type="text"
                  name="giro"
                  value={form.giro}
                  onChange={handleChange}
                  placeholder="Ej: Servicios de consultoría"
                  className={fieldClass("giro")}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Representante Legal
                </label>
                <input
                  type="text"
                  name="representante"
                  value={form.representante}
                  onChange={handleChange}
                  placeholder="Nombre completo del representante legal"
                  className={fieldClass("representante")}
                />
              </div>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <Link
            href="/clientes"
            className="inline-flex items-center gap-2 px-5 py-2.5 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
          >
            <X className="w-4 h-4" />
            Cancelar
          </Link>
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            {saving ? "Guardando..." : "Guardar Cliente"}
          </button>
        </div>
      </form>
    </div>
  );
}
