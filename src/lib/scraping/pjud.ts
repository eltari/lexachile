/**
 * Scraper para el Poder Judicial de Chile (PJUD)
 * https://oficinajudicialvirtual.pjud.cl/
 *
 * NOTA: Este módulo retorna datos MOCK mientras no se disponga de
 * Playwright para navegación real. Los comentarios indican dónde
 * se integraría el navegador headless.
 */

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

// ─── Clase Scraper ──────────────────────────────────────────────────────────

export class PJUDScraper {
  // En producción, aquí se inicializaría Playwright:
  // private browser: Browser | null = null;
  //
  // async init() {
  //   this.browser = await chromium.launch({ headless: true });
  // }
  //
  // async close() {
  //   await this.browser?.close();
  // }

  /**
   * Consultar una causa específica por ROL y tribunal.
   *
   * En producción usaría Playwright:
   *   const page = await this.browser.newPage();
   *   await page.goto('https://oficinajudicialvirtual.pjud.cl/...');
   *   await page.fill('#rol', rol);
   *   await page.selectOption('#tribunal', tribunal);
   *   await page.click('#btnBuscar');
   *   const data = await page.evaluate(() => { ... });
   */
  async consultarCausa(rol: string, tribunal: string): Promise<CausaPJUD | null> {
    // Simular latencia de red
    await this.delay(300);

    const causa = mockCausas.find(
      (c) =>
        c.rol.toLowerCase() === rol.toLowerCase() ||
        c.rol.toLowerCase().includes(rol.toLowerCase())
    );

    if (causa && tribunal) {
      return { ...causa, tribunal };
    }

    return causa || null;
  }

  /**
   * Buscar causas por RUT del litigante.
   *
   * En producción:
   *   await page.goto('https://oficinajudicialvirtual.pjud.cl/busqueda_por_rut');
   *   await page.fill('#rut', rut);
   *   await page.click('#btnBuscar');
   *   // Parsear tabla de resultados...
   */
  async buscarCausas(rut: string): Promise<ResultadoBusquedaPJUD> {
    await this.delay(400);

    // Retornar subconjunto mock basado en el RUT recibido
    const causas = rut ? mockCausas.slice(0, 3) : [];

    return {
      causas,
      total: causas.length,
    };
  }

  /**
   * Obtener movimientos (historial de trámites) de una causa.
   *
   * En producción:
   *   await page.goto(`https://oficinajudicialvirtual.pjud.cl/causa/${rol}/movimientos`);
   *   const rows = await page.$$('table.movimientos tbody tr');
   *   // Parsear cada fila...
   */
  async obtenerMovimientos(rol: string): Promise<MovimientoPJUD[]> {
    await this.delay(350);

    if (!rol) return [];
    return mockMovimientos;
  }

  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}

// Singleton
export const pjudScraper = new PJUDScraper();
