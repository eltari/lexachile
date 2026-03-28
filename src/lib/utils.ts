import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Validar RUT chileno
export function validarRut(rut: string): boolean {
  const clean = rut.replace(/[^0-9kK]/g, "");
  if (clean.length < 2) return false;

  const body = clean.slice(0, -1);
  const dv = clean.slice(-1).toUpperCase();

  let sum = 0;
  let multiplier = 2;

  for (let i = body.length - 1; i >= 0; i--) {
    sum += parseInt(body[i]) * multiplier;
    multiplier = multiplier === 7 ? 2 : multiplier + 1;
  }

  const expectedDv = 11 - (sum % 11);
  const dvChar = expectedDv === 11 ? "0" : expectedDv === 10 ? "K" : String(expectedDv);

  return dv === dvChar;
}

// Formatear RUT
export function formatRut(rut: string): string {
  const clean = rut.replace(/[^0-9kK]/g, "");
  if (clean.length < 2) return rut;

  const body = clean.slice(0, -1);
  const dv = clean.slice(-1);

  const formatted = body.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  return `${formatted}-${dv}`;
}

// Formatear moneda chilena
export function formatCLP(amount: number): string {
  return new Intl.NumberFormat("es-CL", {
    style: "currency",
    currency: "CLP",
    minimumFractionDigits: 0,
  }).format(amount);
}

// Formatear fecha en español
export function formatFecha(date: Date | string): string {
  const d = new Date(date);
  return d.toLocaleDateString("es-CL", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

// Formatear fecha corta
export function formatFechaCorta(date: Date | string): string {
  const d = new Date(date);
  return d.toLocaleDateString("es-CL", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

// Estados de causa con colores
export const estadosCausa = {
  ingresada: { label: "Ingresada", color: "bg-blue-100 text-blue-800" },
  en_tramitacion: { label: "En Tramitación", color: "bg-yellow-100 text-yellow-800" },
  sentenciada: { label: "Sentenciada", color: "bg-green-100 text-green-800" },
  archivada: { label: "Archivada", color: "bg-gray-100 text-gray-800" },
} as const;

// Materias
export const materias = [
  "Civil",
  "Penal",
  "Familia",
  "Laboral",
  "Cobranza",
  "Tributario",
  "Constitucional",
  "Administrativo",
] as const;

// Tribunales de Santiago (ejemplo)
export const tribunales = [
  "1° Juzgado Civil de Santiago",
  "2° Juzgado Civil de Santiago",
  "3° Juzgado Civil de Santiago",
  "1° Juzgado de Letras del Trabajo de Santiago",
  "2° Juzgado de Letras del Trabajo de Santiago",
  "Juzgado de Familia de Santiago",
  "4° Tribunal de Juicio Oral en lo Penal de Santiago",
  "Juzgado de Garantía de Santiago",
  "Corte de Apelaciones de Santiago",
  "Corte Suprema",
] as const;

// Regiones de Chile
export const regiones = [
  "Arica y Parinacota",
  "Tarapacá",
  "Antofagasta",
  "Atacama",
  "Coquimbo",
  "Valparaíso",
  "Metropolitana",
  "O'Higgins",
  "Maule",
  "Ñuble",
  "Biobío",
  "Araucanía",
  "Los Ríos",
  "Los Lagos",
  "Aysén",
  "Magallanes",
] as const;
