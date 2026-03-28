/**
 * Scraper para el Diario Oficial de Chile
 * https://www.diariooficial.interior.gob.cl/
 *
 * Intenta hacer fetch real al sitio del Diario Oficial.
 * Si falla, retorna datos mock como fallback.
 */

import { cache } from "@/lib/cache";

// ─── Tipos ──────────────────────────────────────────────────────────────────

export interface PublicacionDO {
  id: string;
  titulo: string;
  seccion: "Leyes y Reglamentos" | "Avisos" | "Citaciones" | "Nombramientos" | "Varios";
  tipo: string;
  organismo: string;
  fecha: string;
  extracto: string;
  urlDiarioOficial: string;
  isReal: boolean;
}

export interface ResultadoBusquedaDO {
  publicaciones: PublicacionDO[];
  total: number;
  source: "real" | "mock";
}

// ─── Headers comunes ───────────────────────────────────────────────────────

const FETCH_HEADERS = {
  "User-Agent":
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
  Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
  "Accept-Language": "es-CL,es;q=0.9,en;q=0.5",
};

const FETCH_TIMEOUT = 10_000;

function createAbortController(): { controller: AbortController; timeout: ReturnType<typeof setTimeout> } {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), FETCH_TIMEOUT);
  return { controller, timeout };
}

// ─── Datos Mock ─────────────────────────────────────────────────────────────

const mockPublicaciones: PublicacionDO[] = [
  {
    id: "do-001",
    titulo: "Ley N° 21.680 — Modifica el Código del Trabajo en materia de trabajo a distancia",
    seccion: "Leyes y Reglamentos",
    tipo: "Ley",
    organismo: "Ministerio del Trabajo y Previsión Social",
    fecha: "2025-12-15",
    extracto:
      "Modifica los artículos 152 quáter G y siguientes del Código del Trabajo, estableciendo nuevas reglas sobre teletrabajo y derecho a desconexión digital.",
    urlDiarioOficial: "https://www.diariooficial.interior.gob.cl/publicaciones/2025/12/15/43876",
    isReal: false,
  },
  {
    id: "do-002",
    titulo: "DS N° 45 — Reglamento sobre Protección de Datos Personales",
    seccion: "Leyes y Reglamentos",
    tipo: "Decreto Supremo",
    organismo: "Ministerio de Economía, Fomento y Turismo",
    fecha: "2025-11-20",
    extracto:
      "Aprueba reglamento de la Ley N° 21.719 sobre Protección de Datos Personales, regulando las obligaciones de los responsables de tratamiento de datos.",
    urlDiarioOficial: "https://www.diariooficial.interior.gob.cl/publicaciones/2025/11/20/43801",
    isReal: false,
  },
  {
    id: "do-003",
    titulo: "Extracto de Constitución — Tech Solutions SpA",
    seccion: "Avisos",
    tipo: "Constitución de Sociedad",
    organismo: "Particular",
    fecha: "2026-01-10",
    extracto:
      "Constitución de sociedad por acciones Tech Solutions SpA. Capital: $10.000.000. Objeto: desarrollo de software. Administrador: Juan Pérez R.",
    urlDiarioOficial: "https://www.diariooficial.interior.gob.cl/publicaciones/2026/01/10/43920",
    isReal: false,
  },
  {
    id: "do-004",
    titulo: "Citación — Procedimiento de Liquidación Voluntaria Caso N° 2025-4567",
    seccion: "Citaciones",
    tipo: "Citación Judicial",
    organismo: "Superintendencia de Insolvencia y Reemprendimiento",
    fecha: "2026-02-05",
    extracto:
      "Se cita a los acreedores de Comercializadora del Pacífico Ltda., RUT 76.XXX.XXX-X, a junta de acreedores a celebrarse el día 15 de marzo de 2026.",
    urlDiarioOficial: "https://www.diariooficial.interior.gob.cl/publicaciones/2026/02/05/43985",
    isReal: false,
  },
  {
    id: "do-005",
    titulo: "Nombramiento — Juez Titular 30° Juzgado Civil de Santiago",
    seccion: "Nombramientos",
    tipo: "Nombramiento",
    organismo: "Poder Judicial",
    fecha: "2026-03-01",
    extracto:
      "Se nombra a doña Carolina Mendoza Araya como Juez Titular del 30° Juzgado Civil de Santiago, a contar del 1° de abril de 2026.",
    urlDiarioOficial: "https://www.diariooficial.interior.gob.cl/publicaciones/2026/03/01/44050",
    isReal: false,
  },
  {
    id: "do-006",
    titulo: "Resolución Exenta N° 1234 — Modifica Arancel Aduanero",
    seccion: "Leyes y Reglamentos",
    tipo: "Resolución",
    organismo: "Servicio Nacional de Aduanas",
    fecha: "2026-02-20",
    extracto:
      "Modifica las tasas arancelarias aplicables a la importación de productos tecnológicos clasificados en la partida 84.71 del Arancel Aduanero.",
    urlDiarioOficial: "https://www.diariooficial.interior.gob.cl/publicaciones/2026/02/20/44020",
    isReal: false,
  },
  {
    id: "do-007",
    titulo: "Extracto de Modificación — Constructora Andes S.A.",
    seccion: "Avisos",
    tipo: "Modificación de Sociedad",
    organismo: "Particular",
    fecha: "2026-03-10",
    extracto:
      "Modificación de sociedad Constructora Andes S.A. Se aumenta capital social a $500.000.000 y se modifica objeto social incorporando actividades inmobiliarias.",
    urlDiarioOficial: "https://www.diariooficial.interior.gob.cl/publicaciones/2026/03/10/44075",
    isReal: false,
  },
];

// ─── Parser de HTML del Diario Oficial ─────────────────────────────────────

function parseDiarioOficialResults(html: string): PublicacionDO[] {
  const results: PublicacionDO[] = [];

  try {
    // El Diario Oficial tiene un buscador que devuelve resultados en divs/tablas
    // Buscar bloques de publicaciones
    const itemRegex = /<div[^>]*class="[^"]*(?:resultado|publicacion|item)[^"]*"[^>]*>([\s\S]*?)<\/div>/gi;
    let match;
    let idx = 0;

    while ((match = itemRegex.exec(html)) !== null && idx < 30) {
      const block = match[1];

      // Extraer título
      const tituloMatch = block.match(/<(?:h[2-4]|a|strong)[^>]*>([^<]+)<\//);
      if (!tituloMatch) continue;
      const titulo = tituloMatch[1].trim();
      if (titulo.length < 5) continue;

      // Extraer fecha
      const fechaMatch = block.match(/(\d{2}[/-]\d{2}[/-]\d{4})/);
      let fecha = "";
      if (fechaMatch) {
        const parts = fechaMatch[1].split(/[/-]/);
        fecha = `${parts[2]}-${parts[1]}-${parts[0]}`;
      }

      // Extraer URL
      const urlMatch = block.match(/href="([^"]*diariooficial[^"]*)"/);
      const url = urlMatch ? urlMatch[1] : "";

      // Detectar sección
      let seccion: PublicacionDO["seccion"] = "Varios";
      const tituloLower = titulo.toLowerCase();
      if (/ley|decreto|reglamento|resolución/i.test(tituloLower)) seccion = "Leyes y Reglamentos";
      else if (/constitución|modificación|sociedad|extracto/i.test(tituloLower)) seccion = "Avisos";
      else if (/citación|cita|acreedores/i.test(tituloLower)) seccion = "Citaciones";
      else if (/nombramiento|designa/i.test(tituloLower)) seccion = "Nombramientos";

      // Extraer extracto/resumen
      const extractoMatch = block.match(/<p[^>]*>([^<]+)<\/p>/);
      const extracto = extractoMatch ? extractoMatch[1].trim() : titulo;

      idx++;
      results.push({
        id: `do-real-${idx}`,
        titulo,
        seccion,
        tipo: seccion === "Leyes y Reglamentos" ? "Norma" : seccion,
        organismo: "",
        fecha,
        extracto,
        urlDiarioOficial: url.startsWith("http") ? url : `https://www.diariooficial.interior.gob.cl${url}`,
        isReal: true,
      });
    }

    // Intentar también parsear links directos a publicaciones
    if (results.length === 0) {
      const linkRegex = /<a[^>]*href="([^"]*publicaciones[^"]*)"[^>]*>([^<]+)<\/a>/gi;
      let linkMatch;

      while ((linkMatch = linkRegex.exec(html)) !== null && idx < 30) {
        const url = linkMatch[1];
        const titulo = linkMatch[2].trim();
        if (titulo.length < 5) continue;

        idx++;
        results.push({
          id: `do-real-${idx}`,
          titulo,
          seccion: "Varios",
          tipo: "Publicación",
          organismo: "",
          fecha: "",
          extracto: titulo,
          urlDiarioOficial: url.startsWith("http") ? url : `https://www.diariooficial.interior.gob.cl${url}`,
          isReal: true,
        });
      }
    }
  } catch (err) {
    console.error("[DO] Error parseando resultados:", err);
  }

  return results;
}

// ─── Clase Scraper ──────────────────────────────────────────────────────────

export class DiarioOficialScraper {
  /**
   * Buscar publicaciones por texto y opcionalmente por fecha.
   * Intenta fetch real, cae a mock si falla.
   */
  async buscarPublicaciones(query: string, fecha?: string): Promise<ResultadoBusquedaDO> {
    const cacheKey = `do:buscar:${query}:${fecha || ""}`;
    const cached = cache.get<ResultadoBusquedaDO>(cacheKey);
    if (cached) return cached;

    try {
      const { controller, timeout } = createAbortController();

      // Intentar buscar en el Diario Oficial
      let url = `https://www.diariooficial.interior.gob.cl/publicaciones/`;
      if (fecha) {
        // Formato: YYYY/MM/DD
        const parts = fecha.split("-");
        if (parts.length === 3) {
          url += `${parts[0]}/${parts[1]}/${parts[2]}/`;
        }
      }

      const response = await fetch(url, {
        headers: FETCH_HEADERS,
        signal: controller.signal,
      });
      clearTimeout(timeout);

      if (response.ok) {
        const html = await response.text();
        let publicaciones = parseDiarioOficialResults(html);

        // Filtrar por query si hay resultados
        if (publicaciones.length > 0 && query) {
          const q = query.toLowerCase();
          const filtradas = publicaciones.filter(
            (p) =>
              p.titulo.toLowerCase().includes(q) ||
              p.extracto.toLowerCase().includes(q)
          );
          if (filtradas.length > 0) {
            publicaciones = filtradas;
          }
        }

        if (publicaciones.length > 0) {
          const resultado: ResultadoBusquedaDO = {
            publicaciones,
            total: publicaciones.length,
            source: "real",
          };
          cache.set(cacheKey, resultado);
          console.log(`[DO] Búsqueda real exitosa: "${query}" -> ${publicaciones.length} publicaciones`);
          return resultado;
        }
      }

      throw new Error("No se obtuvieron resultados del Diario Oficial");
    } catch (error) {
      console.warn("[DO] Fetch real falló, usando datos mock:", (error as Error).message);
      return this.buscarPublicacionesMock(query, fecha);
    }
  }

  /**
   * Obtener una publicación específica por ID.
   */
  async obtenerPublicacion(id: string): Promise<(PublicacionDO & { source: "real" | "mock" }) | null> {
    const cacheKey = `do:pub:${id}`;
    const cached = cache.get<PublicacionDO & { source: "real" | "mock" }>(cacheKey);
    if (cached) return cached;

    // Para publicaciones específicas, buscar en mock
    const pub = mockPublicaciones.find((p) => p.id === id);
    if (pub) {
      const result = { ...pub, source: "mock" as const };
      cache.set(cacheKey, result);
      return result;
    }

    return null;
  }

  // ─── Mock fallback ───────────────────────────────────────────────────────

  private buscarPublicacionesMock(query: string, fecha?: string): ResultadoBusquedaDO {
    const q = query.toLowerCase();
    let filtradas = mockPublicaciones.filter(
      (p) =>
        p.titulo.toLowerCase().includes(q) ||
        p.extracto.toLowerCase().includes(q) ||
        p.tipo.toLowerCase().includes(q) ||
        p.organismo.toLowerCase().includes(q)
    );

    if (fecha) {
      filtradas = filtradas.filter((p) => p.fecha === fecha);
    }

    return {
      publicaciones: filtradas.length > 0 ? filtradas : mockPublicaciones,
      total: filtradas.length > 0 ? filtradas.length : mockPublicaciones.length,
      source: "mock",
    };
  }
}

export const diarioOficialScraper = new DiarioOficialScraper();
