/**
 * Scraper para la Biblioteca del Congreso Nacional (BCN) / LeyChile
 * https://www.bcn.cl/leychile
 *
 * Módulo MOCK — en producción se usaría Playwright o la API de BCN.
 */

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
}

export interface ResultadoBusquedaJurisprudencia {
  resultados: JurisprudenciaBCN[];
  total: number;
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

// ─── Clase Scraper ──────────────────────────────────────────────────────────

export class BCNScraper {
  // En producción se usaría Playwright o fetch a la API de BCN:
  // private browser: Browser | null = null;
  //
  // async init() {
  //   this.browser = await chromium.launch({ headless: true });
  // }

  /**
   * Buscar leyes por texto libre.
   *
   * En producción:
   *   await page.goto('https://www.bcn.cl/leychile/consulta/buscar');
   *   await page.fill('#txtBuscar', query);
   *   await page.click('#btnBuscar');
   *   // Parsear resultados...
   */
  async buscarLey(query: string): Promise<ResultadoBusquedaLeyes> {
    await this.delay(300);

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
    };
  }

  /**
   * Obtener una ley específica por número.
   */
  async obtenerLey(numero: string): Promise<LeyBCN | null> {
    await this.delay(200);
    return mockLeyes.find((l) => l.numero === numero) || null;
  }

  /**
   * Buscar jurisprudencia por texto.
   */
  async buscarJurisprudencia(query: string): Promise<ResultadoBusquedaJurisprudencia> {
    await this.delay(350);

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
    };
  }

  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}

export const bcnScraper = new BCNScraper();
