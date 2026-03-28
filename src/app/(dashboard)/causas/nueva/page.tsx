"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Save, X } from "lucide-react";
import { materias, tribunales } from "@/lib/utils";

const mockClientes = [
  { id: "1", nombre: "María González Soto", rut: "12.345.678-9" },
  { id: "2", nombre: "Carlos Muñoz Reyes", rut: "15.678.901-2" },
  { id: "3", nombre: "Pedro Soto Vargas", rut: "10.234.567-K" },
  { id: "4", nombre: "Ana Ramírez López", rut: "18.765.432-1" },
  { id: "5", nombre: "Inversiones Austral SpA", rut: "76.543.210-5" },
  { id: "6", nombre: "Constructora Pacífico S.A.", rut: "96.789.012-3" },
];

export default function NuevaCausaPage() {
  const [form, setForm] = useState({
    rol: "",
    rit: "",
    ruc: "",
    caratulado: "",
    materia: "",
    tipo: "",
    tribunal: "",
    juez: "",
    cuantia: "",
    clienteId: "",
    observaciones: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);

  function handleChange(
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
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

  function validate(): boolean {
    const newErrors: Record<string, string> = {};
    if (!form.rol.trim()) newErrors.rol = "El ROL es obligatorio";
    if (!form.caratulado.trim())
      newErrors.caratulado = "El caratulado es obligatorio";
    if (!form.materia) newErrors.materia = "Seleccione una materia";
    if (!form.tribunal) newErrors.tribunal = "Seleccione un tribunal";
    if (!form.clienteId) newErrors.clienteId = "Seleccione un cliente";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;
    setSaving(true);
    // Simulate save
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setSaving(false);
    alert("Causa guardada correctamente (demo)");
  }

  const fieldClass = (name: string) =>
    `w-full px-3 py-2.5 border rounded-lg text-sm outline-none transition-shadow ${
      errors[name]
        ? "border-red-300 focus:ring-2 focus:ring-red-500 focus:border-red-500"
        : "border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
    }`;

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Back link */}
      <Link
        href="/causas"
        className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Volver a Causas
      </Link>

      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Nueva Causa</h1>
        <p className="mt-1 text-sm text-gray-500">
          Complete los datos para registrar una nueva causa judicial
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Identification */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
          <h2 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">
            Identificación
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                ROL <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="rol"
                value={form.rol}
                onChange={handleChange}
                placeholder="Ej: C-1234-2024"
                className={fieldClass("rol")}
              />
              {errors.rol && (
                <p className="mt-1 text-xs text-red-600">{errors.rol}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                RIT
              </label>
              <input
                type="text"
                name="rit"
                value={form.rit}
                onChange={handleChange}
                placeholder="Ej: C-1234-2024"
                className={fieldClass("rit")}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                RUC
              </label>
              <input
                type="text"
                name="ruc"
                value={form.ruc}
                onChange={handleChange}
                placeholder="Ej: 2400123456-7"
                className={fieldClass("ruc")}
              />
            </div>
          </div>
        </div>

        {/* Details */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
          <h2 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">
            Detalle de la Causa
          </h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Caratulado <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="caratulado"
                value={form.caratulado}
                onChange={handleChange}
                placeholder="Ej: González con Pérez"
                className={fieldClass("caratulado")}
              />
              {errors.caratulado && (
                <p className="mt-1 text-xs text-red-600">
                  {errors.caratulado}
                </p>
              )}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Materia <span className="text-red-500">*</span>
                </label>
                <select
                  name="materia"
                  value={form.materia}
                  onChange={handleChange}
                  className={fieldClass("materia")}
                >
                  <option value="">Seleccionar materia</option>
                  {materias.map((m) => (
                    <option key={m} value={m}>
                      {m}
                    </option>
                  ))}
                </select>
                {errors.materia && (
                  <p className="mt-1 text-xs text-red-600">{errors.materia}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tipo de Procedimiento
                </label>
                <input
                  type="text"
                  name="tipo"
                  value={form.tipo}
                  onChange={handleChange}
                  placeholder="Ej: Ordinario, Sumario, Ejecutivo"
                  className={fieldClass("tipo")}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Tribunal */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
          <h2 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">
            Tribunal
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tribunal <span className="text-red-500">*</span>
              </label>
              <select
                name="tribunal"
                value={form.tribunal}
                onChange={handleChange}
                className={fieldClass("tribunal")}
              >
                <option value="">Seleccionar tribunal</option>
                {tribunales.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
              {errors.tribunal && (
                <p className="mt-1 text-xs text-red-600">{errors.tribunal}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Juez
              </label>
              <input
                type="text"
                name="juez"
                value={form.juez}
                onChange={handleChange}
                placeholder="Nombre del juez"
                className={fieldClass("juez")}
              />
            </div>
          </div>
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Cuantía (CLP)
            </label>
            <input
              type="number"
              name="cuantia"
              value={form.cuantia}
              onChange={handleChange}
              placeholder="0"
              className={fieldClass("cuantia")}
            />
          </div>
        </div>

        {/* Client */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
          <h2 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">
            Cliente
          </h2>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Seleccionar Cliente <span className="text-red-500">*</span>
            </label>
            <select
              name="clienteId"
              value={form.clienteId}
              onChange={handleChange}
              className={fieldClass("clienteId")}
            >
              <option value="">Seleccionar cliente</option>
              {mockClientes.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.nombre} - {c.rut}
                </option>
              ))}
            </select>
            {errors.clienteId && (
              <p className="mt-1 text-xs text-red-600">{errors.clienteId}</p>
            )}
            <Link
              href="/clientes/nuevo"
              className="inline-block mt-2 text-sm text-blue-600 hover:text-blue-800"
            >
              + Crear nuevo cliente
            </Link>
          </div>
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Observaciones
            </label>
            <textarea
              name="observaciones"
              value={form.observaciones}
              onChange={handleChange}
              rows={3}
              placeholder="Notas adicionales sobre la causa..."
              className={fieldClass("observaciones")}
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <Link
            href="/causas"
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
            <Save className="w-4 h-4" />
            {saving ? "Guardando..." : "Guardar Causa"}
          </button>
        </div>
      </form>
    </div>
  );
}
