/**
 * Scraper para el Poder Judicial de Chile (PJUD)
 * https://oficinajudicialvirtual.pjud.cl/
 *
 * Intenta hacer fetch real a las páginas del PJUD.
 * Si falla (CORS, bloqueo, captcha), retorna datos mock como fallback.
 */

import { cache } from "@/lib/cache";

// ─── Tipos ──────────────────────────────────────────────────────────────────

export interface CausaPJUD {
  rol: string;
  rit?: string;
  ruc?: string;
  caratulado: string;
  materia: string;
  tribunal: string;
  estado: string;
  fechaIngreso: string;
  tipo: string;
  source: "real" | "mock";
}

export interface MovimientoPJUD {
  folio: number;
  etapa: string;
  tramite: string;
  descripcion: string;
  fecha: string;
  foja?: number;
}

export interface ResultadoBusquedaPJUD {
  causas: CausaPJUD[];
  total: number;
  source: "real" | "mock";
}

// ─── Headers comunes ───────────────────────────────────────────────────────

const FETCH_HEADERS = {
  "User-Agent":
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
  Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
  "Accept-Language": "es-CL,es;q=0.9,en;q=0.5",
  "Accept-Encoding": "gzip, deflate, br",
};

const FETCH_TIMEOUT = 10_000;

function createAbortController(): { controller: AbortController; timeout: ReturnType<typeof setTimeout> } {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), FETCH_TIMEOUT);
  return { controller, timeout };
}

// ─── Datos Mock ─────────────────────────────────────────────────────────────

const mockCausas: CausaPJUD[] = [
  {
    rol: "C-1234-2024",
    rit: "C-1234-2024",
    caratulado: "González con Pérez",
    materia: "Cobro de Pesos",
    tribunal: "1° Juzgado Civil de Santiago",
    estado: "En Tramitación",
    fechaIngreso: "2024-03-15",
    tipo: "Ordinario",
    source: "mock",
  },
  {
    rol: "C-5678-2024",
    rit: "C-5678-2024",
    caratulado: "Muñoz con Banco Estado",
    materia: "Indemnización de Perjuicios",
    tribunal: "2° Juzgado Civil de Santiago",
    estado: "En Tramitación",
    fechaIngreso: "2024-06-20",
    tipo: "Ordinario",
    source: "mock",
  },
  {
    rol: "T-892-2024",
    rit: "T-892-2024",
    ruc: "2410018000892-4",
    caratulado: "Soto con Empresa ABC Ltda.",
    materia: "Despido Injustificado",
    tribunal: "1° Juzgado de Letras del Trabajo de Santiago",
    estado: "Citación a Audiencia",
    fechaIngreso: "2024-01-10",
    tipo: "Laboral",
    source: "mock",
  },
  {
    rol: "F-2210-2024",
    rit: "F-2210-2024",
    caratulado: "López con Rodríguez",
    materia: "Alimentos Menores",
    tribunal: "Juzgado de Familia de Santiago",
    estado: "Sentencia Definitiva",
    fechaIngreso: "2024-02-28",
    tipo: "Familia",
    source: "mock",
  },
  {
    rol: "C-3456-2025",
    rit: "C-3456-2025",
    caratulado: "Inversiones XYZ con Constructora Delta S.A.",
    materia: "Resolución de Contrato",
    tribunal: "3° Juzgado Civil de Santiago",
    estado: "En Acuerdo",
    fechaIngreso: "2025-01-05",
    tipo: "Ordinario",
    source: "mock",
  },
];

const mockMovimientos: MovimientoPJUD[] = [
  {
    folio: 1,
    etapa: "Discusión",
    tramite: "Presentación de la demanda",
    descripcion: "Se tiene por interpuesta demanda en juicio ordinario de cobro de pesos.",
    fecha: "2024-03-15",
    foja: 1,
  },
  {
    folio: 2,
    etapa: "Discusión",
    tramite: "Resolución que provee la demanda",
    descripcion: "Traslado. Notifíquese.",
    fecha: "2024-03-18",
    foja: 15,
  },
  {
    folio: 3,
    etapa: "Discusión",
    tramite: "Notificación personal",
    descripcion: "Notificación personal al demandado practicada por receptor judicial.",
    fecha: "2024-04-02",
    foja: 16,
  },
  {
    folio: 4,
    etapa: "Discusión",
    tramite: "Contestación de la demanda",
    descripcion: "Se tiene por contestada la demanda. Traslado para réplica.",
    fecha: "2024-04-22",
    foja: 32,
  },
  {
    folio: 5,
    etapa: "Discusión",
    tramite: "Escrito de réplica",
    descripcion: "Se tiene por evacuado el trámite de réplica. Traslado para dúplica.",
    fecha: "2024-05-06",
    foja: 48,
  },
  {
    folio: 6,
    etapa: "Prueba",
    tramite: "Resolución que recibe la causa a prueba",
    descripcion: "Se recibe la causa a prueba fijándose los siguientes puntos de prueba: 1) Efectividad de la deuda...",
    fecha: "2024-06-01",
    foja: 65,
  },
  {
    folio: 7,
    etapa: "Prueba",
    tramite: "Presentación lista de testigos",
    descripcion: "Téngase por acompañada lista de testigos de la parte demandante.",
    fecha: "2024-06-08",
    foja: 70,
  },
  {
    folio: 8,
    etapa: "Prueba",
    tramite: "Audiencia de prueba testimonial",
    descripcion: "Se lleva a efecto audiencia de prueba testimonial. Declaran 2 testigos.",
    fecha: "2024-07-15",
    foja: 85,
  },
];

// ─── Parser de HTML del PJUD ───────────────────────────────────────────────

function parsePjudCausaResults(html: string): CausaPJUD[] {
  const results: CausaPJUD[] = [];

  try {
    // El PJUD devuelve tablas con datos de causas
    // Buscamos filas de tablas con datos de causa
    const rowRegex = /<tr[^>]*>([\s\S]*?)<\/tr>/gi;
    let rowMatch;
    const rows: string[] = [];

    while ((rowMatch = rowRegex.exec(html)) !== null) {
      rows.push(rowMatch[1]);
    }

    for (const row of rows) {
      // Extraer celdas
      const cellRegex = /<td[^>]*>([\s\S]*?)<\/td>/gi;
      let cellMatch;
      const cells: string[] = [];

      while ((cellMatch = cellRegex.exec(row)) !== null) {
        cells.push(
          cellMatch[1]
            .replace(/<[^>]+>/g, "")
            .replace(/&nbsp;/g, " ")
            .replace(/\s+/g, " ")
            .trim()
        );
      }

      // Necesitamos al menos 4 celdas para identificar una causa
      if (cells.length >= 4) {
        // Buscar patrón de ROL (ej: C-1234-2024, T-567-2023)
        const rolMatch = cells.find((c) => /^[A-Z]-\d+-\d{4}$/.test(c.trim()));
        if (rolMatch) {
          results.push({
            rol: rolMatch.trim(),
            caratulado: cells[1] || "Sin carátula",
            materia: cells[2] || "Sin materia",
            tribunal: cells[3] || "Sin tribunal",
            estado: cells[4] || "Sin estado",
            fechaIngreso: cells[5] || "",
            tipo: cells[6] || "Civil",
            source: "real",
          });
        }
      }
    }
  } catch (err) {
    console.error("[PJUD] Error parseando resultados:", err);
  }

  return results;
}

// ─── Clase Scraper ──────────────────────────────────────────────────────────

export class PJUDScraper {
  /**
   * Consultar una causa específica por ROL y tribunal.
   * Intenta fetch real, cae a mock si falla.
   */
  async consultarCausa(rol: string, tribunal: string): Promise<CausaPJUD | null> {
    const cacheKey = `pjud:causa:${rol}:${tribunal}`;
    const cached = cache.get<CausaPJUD>(cacheKey);
    if (cached) return cached;

    try {
      const { controller, timeout } = createAbortController();

      // Intentar consulta unificada del PJUD
      const url = `https://consultaunificada.pjud.cl/consultaunificada/consulta`;
      const response = await fetch(url, {
        method: "POST",
        headers: {
          ...FETCH_HEADERS,
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: `rol=${encodeURIComponent(rol)}&tribunal=${encodeURIComponent(tribunal)}`,
        signal: controller.signal,
      });
      clearTimeout(timeout);

      if (response.ok) {
        const html = await response.text();
        const causas = parsePjudCausaResults(html);
        if (causas.length > 0) {
          const causa = causas[0];
          cache.set(cacheKey, causa);
          console.log(`[PJUD] Causa encontrada vía fetch real: ${rol}`);
          return causa;
        }
      }

      throw new Error(`HTTP ${response.status}`);
    } catch (error) {
      console.warn("[PJUD] consultarCausa real falló, usando mock:", (error as Error).message);

      // Fallback a mock
      const causa = mockCausas.find(
        (c) =>
          c.rol.toLowerCase() === rol.toLowerCase() ||
          c.rol.toLowerCase().includes(rol.toLowerCase())
      );

      if (causa && tribunal) {
        const result = { ...causa, tribunal, source: "mock" as const };
        cache.set(cacheKey, result);
        return result;
      }

      return causa || null;
    }
  }

  /**
   * Buscar causas por RUT del litigante.
   */
  async buscarCausas(rut: string): Promise<ResultadoBusquedaPJUD> {
    const cacheKey = `pjud:rut:${rut}`;
    const cached = cache.get<ResultadoBusquedaPJUD>(cacheKey);
    if (cached) return cached;

    try {
      const { controller, timeout } = createAbortController();

      // Intentar búsqueda por RUT en consulta unificada
      const url = `https://consultaunificada.pjud.cl/consultaunificada/consulta`;
      const response = await fetch(url, {
        method: "POST",
        headers: {
          ...FETCH_HEADERS,
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: `rut=${encodeURIComponent(rut)}`,
        signal: controller.signal,
      });
      clearTimeout(timeout);

      if (response.ok) {
        const html = await response.text();
        const causas = parsePjudCausaResults(html);
        if (causas.length > 0) {
          const resultado: ResultadoBusquedaPJUD = {
            causas,
            total: causas.length,
            source: "real",
          };
          cache.set(cacheKey, resultado);
          console.log(`[PJUD] Búsqueda por RUT exitosa: ${rut} -> ${causas.length} causas`);
          return resultado;
        }
      }

      throw new Error("No se obtuvieron resultados reales");
    } catch (error) {
      console.warn("[PJUD] buscarCausas real falló, usando mock:", (error as Error).message);

      const causas = rut ? mockCausas.slice(0, 3) : [];
      const resultado: ResultadoBusquedaPJUD = {
        causas,
        total: causas.length,
        source: "mock",
      };
      cache.set(cacheKey, resultado);
      return resultado;
    }
  }

  /**
   * Obtener movimientos (historial de trámites) de una causa.
   */
  async obtenerMovimientos(rol: string): Promise<{ movimientos: MovimientoPJUD[]; source: "real" | "mock" }> {
    const cacheKey = `pjud:mov:${rol}`;
    const cached = cache.get<{ movimientos: MovimientoPJUD[]; source: "real" | "mock" }>(cacheKey);
    if (cached) return cached;

    try {
      const { controller, timeout } = createAbortController();

      // Intentar obtener movimientos
      const url = `https://consultaunificada.pjud.cl/consultaunificada/detalle`;
      const response = await fetch(url, {
        method: "POST",
        headers: {
          ...FETCH_HEADERS,
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: `rol=${encodeURIComponent(rol)}&tipo=movimientos`,
        signal: controller.signal,
      });
      clearTimeout(timeout);

      if (response.ok) {
        const html = await response.text();

        // Intentar parsear tabla de movimientos
        const movimientos: MovimientoPJUD[] = [];
        const rowRegex = /<tr[^>]*>([\s\S]*?)<\/tr>/gi;
        let rowMatch;

        while ((rowMatch = rowRegex.exec(html)) !== null) {
          const cellRegex = /<td[^>]*>([\s\S]*?)<\/td>/gi;
          let cellMatch;
          const cells: string[] = [];

          while ((cellMatch = cellRegex.exec(rowMatch[1])) !== null) {
            cells.push(cellMatch[1].replace(/<[^>]+>/g, "").replace(/\s+/g, " ").trim());
          }

          if (cells.length >= 4) {
            const folio = parseInt(cells[0]);
            if (!isNaN(folio)) {
              movimientos.push({
                folio,
                etapa: cells[1] || "",
                tramite: cells[2] || "",
                descripcion: cells[3] || "",
                fecha: cells[4] || "",
                foja: cells[5] ? parseInt(cells[5]) : undefined,
              });
            }
          }
        }

        if (movimientos.length > 0) {
          const result = { movimientos, source: "real" as const };
          cache.set(cacheKey, result);
          console.log(`[PJUD] Movimientos obtenidos: ${rol} -> ${movimientos.length}`);
          return result;
        }
      }

      throw new Error("No se obtuvieron movimientos reales");
    } catch (error) {
      console.warn("[PJUD] obtenerMovimientos real falló, usando mock:", (error as Error).message);

      if (!rol) return { movimientos: [], source: "mock" };
      const result = { movimientos: mockMovimientos, source: "mock" as const };
      cache.set(cacheKey, result);
      return result;
    }
  }
}

// Singleton
export const pjudScraper = new PJUDScraper();
