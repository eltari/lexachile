/**
 * Scraper para el Diario Oficial de Chile
 * https://www.diariooficial.interior.gob.cl/
 *
 * Módulo MOCK — en producción se usaría Playwright o la API del Diario Oficial.
 */

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
}

export interface ResultadoBusquedaDO {
  publicaciones: PublicacionDO[];
  total: number;
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
  },
];

// ─── Clase Scraper ──────────────────────────────────────────────────────────

export class DiarioOficialScraper {
  // En producción:
  // private browser: Browser | null = null;
  // async init() { this.browser = await chromium.launch({ headless: true }); }

  /**
   * Buscar publicaciones por texto y opcionalmente por fecha.
   *
   * En producción:
   *   await page.goto('https://www.diariooficial.interior.gob.cl/buscador/');
   *   await page.fill('#txtBusqueda', query);
   *   if (fecha) await page.fill('#fecha', fecha);
   *   await page.click('#btnBuscar');
   *   // Parsear resultados...
   */
  async buscarPublicaciones(query: string, fecha?: string): Promise<ResultadoBusquedaDO> {
    await this.delay(350);

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
    };
  }

  /**
   * Obtener una publicación específica por ID.
   */
  async obtenerPublicacion(id: string): Promise<PublicacionDO | null> {
    await this.delay(200);
    return mockPublicaciones.find((p) => p.id === id) || null;
  }

  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}

export const diarioOficialScraper = new DiarioOficialScraper();
