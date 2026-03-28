/**
 * Scraper para la Biblioteca del Congreso Nacional (BCN) / LeyChile
 * https://www.bcn.cl/leychile
 *
 * Intenta hacer fetch real a LeyChile. Si falla, retorna datos mock como fallback.
 */

import { cache } from "@/lib/cache";

// ─── Tipos ──────────────────────────────────────────────────────────────────

export interface LeyBCN {
  id: string;
  numero: string;
  titulo: string;
  tipo: "Ley" | "Decreto" | "DFL" | "DS" | "DL";
  fechaPublicacion: string;
  fechaPromulgacion: string;
  estado: "Vigente" | "Derogada" | "Modificada";
  organismo: string;
  urlBCN: string;
  resumen?: string;
  contenido?: string;
}

export interface JurisprudenciaBCN {
  id: string;
  titulo: string;
  tribunal: string;
  fecha: string;
  rol: string;
  materia: string;
  resumen: string;
  urlFuente: string;
}

export interface ResultadoBusquedaLeyes {
  leyes: LeyBCN[];
  total: number;
  source: "real" | "mock";
}

export interface ResultadoBusquedaJurisprudencia {
  resultados: JurisprudenciaBCN[];
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

const FETCH_TIMEOUT = 10_000; // 10 segundos

// ─── Utilidades de fetch ───────────────────────────────────────────────────

function createAbortController(): { controller: AbortController; timeout: ReturnType<typeof setTimeout> } {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), FETCH_TIMEOUT);
  return { controller, timeout };
}

// ─── Datos Mock ─────────────────────────────────────────────────────────────

const mockLeyes: LeyBCN[] = [
  {
    id: "1",
    numero: "20.720",
    titulo: "Ley de Reorganización y Liquidación de Empresas y Personas",
    tipo: "Ley",
    fechaPublicacion: "2014-01-09",
    fechaPromulgacion: "2013-12-30",
    estado: "Vigente",
    organismo: "Ministerio de Economía",
    urlBCN: "https://www.bcn.cl/leychile/navegar?idNorma=1058072",
    resumen:
      "Sustituye el régimen concursal vigente por una ley de reorganización y liquidación de activos de empresas y personas, y perfecciona el rol de la superintendencia del ramo.",
  },
  {
    id: "2",
    numero: "21.595",
    titulo: "Ley de Delitos Económicos",
    tipo: "Ley",
    fechaPublicacion: "2023-08-17",
    fechaPromulgacion: "2023-08-11",
    estado: "Vigente",
    organismo: "Ministerio de Justicia",
    urlBCN: "https://www.bcn.cl/leychile/navegar?idNorma=1197185",
    resumen:
      "Sistematiza los delitos económicos y atentados contra el medio ambiente, regula las penas accesorias, modifica diversos cuerpos legales.",
  },
  {
    id: "3",
    numero: "19.968",
    titulo: "Ley que crea los Tribunales de Familia",
    tipo: "Ley",
    fechaPublicacion: "2004-08-30",
    fechaPromulgacion: "2004-08-25",
    estado: "Vigente",
    organismo: "Ministerio de Justicia",
    urlBCN: "https://www.bcn.cl/leychile/navegar?idNorma=229557",
    resumen:
      "Crea los tribunales de familia, establece su competencia, organización y procedimientos aplicables.",
  },
  {
    id: "4",
    numero: "20.393",
    titulo: "Responsabilidad Penal de las Personas Jurídicas",
    tipo: "Ley",
    fechaPublicacion: "2009-12-02",
    fechaPromulgacion: "2009-11-25",
    estado: "Vigente",
    organismo: "Ministerio de Justicia",
    urlBCN: "https://www.bcn.cl/leychile/navegar?idNorma=1008668",
    resumen:
      "Establece la responsabilidad penal de las personas jurídicas en los delitos de lavado de activos, financiamiento del terrorismo y cohecho.",
  },
  {
    id: "5",
    numero: "18.010",
    titulo: "Ley sobre Operaciones de Crédito de Dinero",
    tipo: "Ley",
    fechaPublicacion: "1981-06-27",
    fechaPromulgacion: "1981-06-23",
    estado: "Vigente",
    organismo: "Ministerio de Hacienda",
    urlBCN: "https://www.bcn.cl/leychile/navegar?idNorma=29528",
    resumen:
      "Regula las operaciones de crédito de dinero, establece los intereses máximos convencionales y las sanciones por usura.",
  },
  {
    id: "6",
    numero: "20.285",
    titulo: "Ley de Transparencia y Acceso a la Información Pública",
    tipo: "Ley",
    fechaPublicacion: "2008-08-20",
    fechaPromulgacion: "2008-08-11",
    estado: "Vigente",
    organismo: "Ministerio Secretaría General de la Presidencia",
    urlBCN: "https://www.bcn.cl/leychile/navegar?idNorma=276363",
    resumen:
      "Regula el principio de transparencia de la función pública y el derecho de acceso a la información de los órganos de la Administración del Estado.",
  },
  {
    id: "7",
    numero: "19.496",
    titulo: "Ley de Protección de los Derechos de los Consumidores",
    tipo: "Ley",
    fechaPublicacion: "1997-03-07",
    fechaPromulgacion: "1997-02-28",
    estado: "Vigente",
    organismo: "Ministerio de Economía",
    urlBCN: "https://www.bcn.cl/leychile/navegar?idNorma=61438",
    resumen:
      "Establece normas sobre protección de los derechos de los consumidores, regulando las relaciones entre proveedores y consumidores.",
  },
  {
    id: "8",
    numero: "20.609",
    titulo: "Ley Zamudio - Establece Medidas contra la Discriminación",
    tipo: "Ley",
    fechaPublicacion: "2012-07-24",
    fechaPromulgacion: "2012-07-12",
    estado: "Vigente",
    organismo: "Ministerio Secretaría General de Gobierno",
    urlBCN: "https://www.bcn.cl/leychile/navegar?idNorma=1042092",
    resumen:
      "Establece medidas contra la discriminación arbitraria, define la acción de no discriminación y establece un procedimiento especial.",
  },
  {
    id: "9",
    numero: "19.947",
    titulo: "Ley de Matrimonio Civil",
    tipo: "Ley",
    fechaPublicacion: "2004-05-17",
    fechaPromulgacion: "2004-05-07",
    estado: "Vigente",
    organismo: "Ministerio de Justicia",
    urlBCN: "https://www.bcn.cl/leychile/navegar?idNorma=225128",
    resumen:
      "Establece nueva ley de matrimonio civil, regulando la celebración del matrimonio, la separación judicial y el divorcio.",
  },
  {
    id: "10",
    numero: "21.430",
    titulo: "Ley sobre Garantías y Protección Integral de los Derechos de la Niñez y Adolescencia",
    tipo: "Ley",
    fechaPublicacion: "2022-03-15",
    fechaPromulgacion: "2022-03-10",
    estado: "Vigente",
    organismo: "Ministerio de Desarrollo Social",
    urlBCN: "https://www.bcn.cl/leychile/navegar?idNorma=1173643",
    resumen:
      "Tiene por objeto la garantía y protección integral de los derechos de los niños, niñas y adolescentes.",
  },
];

const mockJurisprudencia: JurisprudenciaBCN[] = [
  {
    id: "j1",
    titulo: "Recurso de Protección — Derecho a la Salud",
    tribunal: "Corte de Apelaciones de Santiago",
    fecha: "2024-08-15",
    rol: "RP-12345-2024",
    materia: "Derechos Fundamentales",
    resumen:
      "Se acoge recurso de protección interpuesto contra Isapre por alza unilateral de plan de salud, ordenando mantener el plan vigente.",
    urlFuente: "https://www.pjud.cl/jurisprudencia/12345",
  },
  {
    id: "j2",
    titulo: "Casación en el Fondo — Despido Injustificado",
    tribunal: "Corte Suprema",
    fecha: "2024-06-20",
    rol: "CS-8765-2024",
    materia: "Laboral",
    resumen:
      "Se rechaza recurso de casación en el fondo interpuesto por empleador. Se confirma sentencia que declara injustificado el despido.",
    urlFuente: "https://www.pjud.cl/jurisprudencia/8765",
  },
  {
    id: "j3",
    titulo: "Nulidad de Derecho Público — Acto Administrativo",
    tribunal: "Corte Suprema",
    fecha: "2024-04-10",
    rol: "CS-4321-2024",
    materia: "Administrativo",
    resumen:
      "Se declara la nulidad de derecho público de resolución exenta que otorgó concesión sin cumplir los requisitos legales.",
    urlFuente: "https://www.pjud.cl/jurisprudencia/4321",
  },
];

// ─── Parser de HTML de LeyChile ────────────────────────────────────────────

function parseLeyChileSearchResults(html: string): LeyBCN[] {
  const results: LeyBCN[] = [];

  try {
    // Buscar bloques de resultados en el HTML de LeyChile
    // El patrón busca links a normas con idNorma
    const normaRegex = /idNorma=(\d+)[^>]*>([^<]+)</g;
    let match;
    let idx = 0;

    while ((match = normaRegex.exec(html)) !== null && idx < 20) {
      const idNorma = match[1];
      const textoRaw = match[2].trim();

      if (!textoRaw || textoRaw.length < 5) continue;

      // Intentar extraer número de ley del texto
      const numMatch = textoRaw.match(/(?:Ley|LEY|Decreto|DFL|DS|DL)\s*(?:N[°º]?\s*)?(\d[\d.]*)/i);
      const numero = numMatch ? numMatch[1] : "";

      // Detectar tipo de norma
      let tipo: LeyBCN["tipo"] = "Ley";
      if (/decreto\s+(?:con\s+fuerza\s+de\s+ley|fuerza\s+ley)/i.test(textoRaw)) tipo = "DFL";
      else if (/decreto\s+supremo|^DS\b/i.test(textoRaw)) tipo = "DS";
      else if (/decreto\s+ley|^DL\b/i.test(textoRaw)) tipo = "DL";
      else if (/decreto/i.test(textoRaw) && !/ley/i.test(textoRaw)) tipo = "Decreto";

      idx++;
      results.push({
        id: `bcn-${idNorma}`,
        numero: numero || idNorma,
        titulo: textoRaw.substring(0, 200),
        tipo,
        fechaPublicacion: "",
        fechaPromulgacion: "",
        estado: "Vigente",
        organismo: "",
        urlBCN: `https://www.bcn.cl/leychile/navegar?idNorma=${idNorma}`,
        resumen: textoRaw,
      });
    }
  } catch (err) {
    console.error("[BCN] Error parseando resultados HTML:", err);
  }

  return results;
}

function parseLeyChileNormaPage(html: string, idNorma: string): LeyBCN | null {
  try {
    // Extraer título
    const tituloMatch = html.match(/<h[12][^>]*class="[^"]*titulo[^"]*"[^>]*>([^<]+)</i)
      || html.match(/<title>([^<]+)</i);
    const titulo = tituloMatch ? tituloMatch[1].trim().replace(/\s+/g, " ") : "";

    // Extraer fecha de publicación
    const fechaPubMatch = html.match(/(?:Fecha\s+(?:de\s+)?[Pp]ublicaci[oó]n|FECHA PUBLICACION)[:\s]*(\d{2}[/-]\d{2}[/-]\d{4})/);
    let fechaPublicacion = "";
    if (fechaPubMatch) {
      const parts = fechaPubMatch[1].split(/[/-]/);
      fechaPublicacion = `${parts[2]}-${parts[1]}-${parts[0]}`;
    }

    // Extraer fecha de promulgación
    const fechaPromMatch = html.match(/(?:Fecha\s+(?:de\s+)?[Pp]romulgaci[oó]n|FECHA PROMULGACION)[:\s]*(\d{2}[/-]\d{2}[/-]\d{4})/);
    let fechaPromulgacion = "";
    if (fechaPromMatch) {
      const parts = fechaPromMatch[1].split(/[/-]/);
      fechaPromulgacion = `${parts[2]}-${parts[1]}-${parts[0]}`;
    }

    // Extraer organismo
    const orgMatch = html.match(/(?:Organismo|ORGANISMO)[:\s]*([^<\n]+)/);
    const organismo = orgMatch ? orgMatch[1].trim() : "";

    // Extraer estado (vigente, derogada, etc.)
    let estado: LeyBCN["estado"] = "Vigente";
    if (/derogad[ao]/i.test(html)) estado = "Derogada";
    else if (/modificad[ao]/i.test(html)) estado = "Modificada";

    // Extraer número
    const numMatch = titulo.match(/(?:LEY|Ley|DECRETO|DFL|DS|DL)\s*(?:N[Uú°º]M(?:ERO)?\.?\s*)?(\d[\d.]*)/i)
      || html.match(/(?:Número|NUMERO)\s*[:\s]*(\d[\d.]*)/);
    const numero = numMatch ? numMatch[1] : idNorma;

    // Tipo de norma
    let tipo: LeyBCN["tipo"] = "Ley";
    if (/DFL|decreto\s+(?:con\s+)?fuerza\s+(?:de\s+)?ley/i.test(titulo)) tipo = "DFL";
    else if (/decreto\s+supremo|^DS\b/i.test(titulo)) tipo = "DS";
    else if (/decreto\s+ley|^DL\b/i.test(titulo)) tipo = "DL";
    else if (/decreto/i.test(titulo) && !/ley/i.test(titulo)) tipo = "Decreto";

    // Extraer resumen/contenido parcial
    const contenidoMatch = html.match(/<div[^>]*class="[^"]*texto[^"]*"[^>]*>([\s\S]{0,1000})/i);
    let resumen = "";
    if (contenidoMatch) {
      resumen = contenidoMatch[1]
        .replace(/<[^>]+>/g, " ")
        .replace(/&nbsp;/g, " ")
        .replace(/&[a-z]+;/gi, " ")
        .replace(/\s+/g, " ")
        .trim()
        .substring(0, 500);
    }

    if (!titulo && !numero) return null;

    return {
      id: `bcn-${idNorma}`,
      numero,
      titulo: titulo || `Norma ${numero}`,
      tipo,
      fechaPublicacion,
      fechaPromulgacion,
      estado,
      organismo,
      urlBCN: `https://www.bcn.cl/leychile/navegar?idNorma=${idNorma}`,
      resumen,
    };
  } catch (err) {
    console.error("[BCN] Error parseando norma:", err);
    return null;
  }
}

// ─── Clase Scraper ──────────────────────────────────────────────────────────

export class BCNScraper {
  /**
   * Buscar leyes por texto libre.
   * Intenta fetch real a LeyChile, cae a mock si falla.
   */
  async buscarLey(query: string): Promise<ResultadoBusquedaLeyes> {
    const cacheKey = `bcn:buscar:${query.toLowerCase().trim()}`;
    const cached = cache.get<ResultadoBusquedaLeyes>(cacheKey);
    if (cached) return cached;

    try {
      const { controller, timeout } = createAbortController();

      // Intentar la búsqueda en LeyChile
      const url = `https://www.leychile.cl/Consulta/listaresultadosimple?cadena=${encodeURIComponent(query)}`;
      const response = await fetch(url, {
        headers: FETCH_HEADERS,
        signal: controller.signal,
      });
      clearTimeout(timeout);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const html = await response.text();
      const leyes = parseLeyChileSearchResults(html);

      if (leyes.length > 0) {
        const resultado: ResultadoBusquedaLeyes = {
          leyes,
          total: leyes.length,
          source: "real",
        };
        cache.set(cacheKey, resultado);
        console.log(`[BCN] Búsqueda real exitosa: "${query}" -> ${leyes.length} resultados`);
        return resultado;
      }

      // Si no se encontraron resultados parseables, intentar URL alternativa
      const url2 = `https://www.bcn.cl/leychile/consulta/busqueda?q=${encodeURIComponent(query)}`;
      const { controller: ctrl2, timeout: t2 } = createAbortController();
      const resp2 = await fetch(url2, {
        headers: FETCH_HEADERS,
        signal: ctrl2.signal,
      });
      clearTimeout(t2);

      if (resp2.ok) {
        const html2 = await resp2.text();
        const leyes2 = parseLeyChileSearchResults(html2);
        if (leyes2.length > 0) {
          const resultado: ResultadoBusquedaLeyes = {
            leyes: leyes2,
            total: leyes2.length,
            source: "real",
          };
          cache.set(cacheKey, resultado);
          console.log(`[BCN] Búsqueda real (alt) exitosa: "${query}" -> ${leyes2.length} resultados`);
          return resultado;
        }
      }

      // Sin resultados reales, caer a mock
      throw new Error("No se pudieron parsear resultados de LeyChile");
    } catch (error) {
      console.warn("[BCN] Fetch real falló, usando datos mock:", (error as Error).message);
      return this.buscarLeyMock(query);
    }
  }

  /**
   * Obtener una ley específica por número o idNorma.
   */
  async obtenerLey(numero: string): Promise<(LeyBCN & { source: "real" | "mock" }) | null> {
    const cacheKey = `bcn:norma:${numero}`;
    const cached = cache.get<LeyBCN & { source: "real" | "mock" }>(cacheKey);
    if (cached) return cached;

    try {
      // Primero intentar si es un idNorma directo
      const idNorma = numero.replace(/\./g, "");
      const { controller, timeout } = createAbortController();

      const url = `https://www.leychile.cl/Navegar?idNorma=${idNorma}`;
      const response = await fetch(url, {
        headers: FETCH_HEADERS,
        signal: controller.signal,
      });
      clearTimeout(timeout);

      if (response.ok) {
        const html = await response.text();
        const ley = parseLeyChileNormaPage(html, idNorma);
        if (ley) {
          const result = { ...ley, source: "real" as const };
          cache.set(cacheKey, result);
          console.log(`[BCN] Norma obtenida: ${numero}`);
          return result;
        }
      }

      throw new Error("No se pudo obtener la norma");
    } catch (error) {
      console.warn("[BCN] obtenerLey real falló, usando mock:", (error as Error).message);
      const mockLey = mockLeyes.find((l) => l.numero === numero);
      return mockLey ? { ...mockLey, source: "mock" as const } : null;
    }
  }

  /**
   * Buscar jurisprudencia por texto.
   * PJUD no tiene API pública fácil para jurisprudencia, usamos mock con fallback informativo.
   */
  async buscarJurisprudencia(query: string): Promise<ResultadoBusquedaJurisprudencia> {
    const cacheKey = `bcn:juris:${query.toLowerCase().trim()}`;
    const cached = cache.get<ResultadoBusquedaJurisprudencia>(cacheKey);
    if (cached) return cached;

    // La búsqueda de jurisprudencia en BCN requiere interacción compleja.
    // Usamos datos mock pero lo indicamos claramente.
    const resultado = this.buscarJurisprudenciaMock(query);
    cache.set(cacheKey, resultado);
    return resultado;
  }

  // ─── Métodos Mock (fallback) ─────────────────────────────────────────────

  private buscarLeyMock(query: string): ResultadoBusquedaLeyes {
    const q = query.toLowerCase();
    const filtradas = mockLeyes.filter(
      (l) =>
        l.titulo.toLowerCase().includes(q) ||
        l.numero.includes(q) ||
        l.resumen?.toLowerCase().includes(q)
    );

    return {
      leyes: filtradas.length > 0 ? filtradas : mockLeyes,
      total: filtradas.length > 0 ? filtradas.length : mockLeyes.length,
      source: "mock",
    };
  }

  private buscarJurisprudenciaMock(query: string): ResultadoBusquedaJurisprudencia {
    const q = query.toLowerCase();
    const filtrados = mockJurisprudencia.filter(
      (j) =>
        j.titulo.toLowerCase().includes(q) ||
        j.materia.toLowerCase().includes(q) ||
        j.resumen.toLowerCase().includes(q)
    );

    return {
      resultados: filtrados.length > 0 ? filtrados : mockJurisprudencia,
      total: filtrados.length > 0 ? filtrados.length : mockJurisprudencia.length,
      source: "mock",
    };
  }
}

export const bcnScraper = new BCNScraper();
