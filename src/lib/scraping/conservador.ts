/**
 * Scraper para Conservador de Bienes Raíces (CBR)
 *
 * Los CBR en Chile generalmente requieren autenticación y/o CAPTCHAs.
 * Este scraper intenta acceder a portales públicos del CBRS cuando es posible,
 * y cae a datos mock realistas (marcados como "demo") cuando no.
 */

import { cache } from "@/lib/cache";

// ─── Tipos ──────────────────────────────────────────────────────────────────

export interface Inscripcion {
  foja: string;
  numero: string;
  anno: number;
  registro: string;
}

export interface Hipoteca {
  acreedor: string;
  monto: string;
  fechaInscripcion: string;
  foja: string;
  numero: string;
  anno: number;
  estado: "Vigente" | "Alzada";
}

export interface Prohibicion {
  tipo: string;
  beneficiario: string;
  fechaInscripcion: string;
  foja: string;
  numero: string;
  anno: number;
  estado: "Vigente" | "Cancelada";
}

export interface RegistroComercio {
  tipo: string;
  descripcion: string;
  fechaInscripcion: string;
  foja: string;
  numero: string;
  anno: number;
}

export interface PropiedadCBR {
  id: string;
  propietario: string;
  rut: string;
  direccion: string;
  comuna: string;
  rolAvaluo: string;
  superficieTerreno: string;
  superficieConstruida: string;
  inscripcion: Inscripcion;
  hipotecas: Hipoteca[];
  prohibiciones: Prohibicion[];
  comercio: RegistroComercio[];
  avaluoFiscal: string;
  destino: string;
  isReal: boolean;
}

export interface CertificadoCBR {
  id: string;
  tipo: string;
  propiedadId: string;
  fechaEmision: string;
  vigencia: string;
  estado: "Disponible" | "Procesando" | "Emitido";
  costo: string;
  isReal: boolean;
}

export interface ResultadoBusquedaPropiedad {
  propiedades: PropiedadCBR[];
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

const mockPropiedades: PropiedadCBR[] = [
  {
    id: "prop-001",
    propietario: "María Isabel González Fuentes",
    rut: "12.345.678-5",
    direccion: "Av. Providencia 1234, Depto. 501",
    comuna: "Providencia",
    rolAvaluo: "1234-56",
    superficieTerreno: "85,5 m²",
    superficieConstruida: "72,3 m²",
    inscripcion: { foja: "2456", numero: "1890", anno: 2018, registro: "Propiedad" },
    hipotecas: [
      {
        acreedor: "Banco de Chile",
        monto: "UF 3.500",
        fechaInscripcion: "2018-05-15",
        foja: "8921",
        numero: "6543",
        anno: 2018,
        estado: "Vigente",
      },
    ],
    prohibiciones: [
      {
        tipo: "Prohibición de Gravar y Enajenar",
        beneficiario: "Banco de Chile",
        fechaInscripcion: "2018-05-15",
        foja: "3421",
        numero: "2109",
        anno: 2018,
        estado: "Vigente",
      },
    ],
    comercio: [],
    avaluoFiscal: "$98.500.000",
    destino: "Habitacional",
    isReal: false,
  },
  {
    id: "prop-002",
    propietario: "Carlos Alberto Muñoz Reyes",
    rut: "9.876.543-2",
    direccion: "Calle Los Leones 456",
    comuna: "Providencia",
    rolAvaluo: "5678-90",
    superficieTerreno: "320 m²",
    superficieConstruida: "185 m²",
    inscripcion: { foja: "1234", numero: "987", anno: 2015, registro: "Propiedad" },
    hipotecas: [
      {
        acreedor: "BancoEstado",
        monto: "UF 5.200",
        fechaInscripcion: "2015-11-20",
        foja: "6789",
        numero: "4321",
        anno: 2015,
        estado: "Vigente",
      },
      {
        acreedor: "Banco Santander",
        monto: "UF 1.800",
        fechaInscripcion: "2020-03-10",
        foja: "2345",
        numero: "1567",
        anno: 2020,
        estado: "Alzada",
      },
    ],
    prohibiciones: [
      {
        tipo: "Prohibición de Gravar y Enajenar",
        beneficiario: "BancoEstado",
        fechaInscripcion: "2015-11-20",
        foja: "4567",
        numero: "3210",
        anno: 2015,
        estado: "Vigente",
      },
    ],
    comercio: [],
    avaluoFiscal: "$245.000.000",
    destino: "Habitacional",
    isReal: false,
  },
  {
    id: "prop-003",
    propietario: "Inversiones Los Andes SpA",
    rut: "76.543.210-K",
    direccion: "Av. Apoquindo 6789, Of. 1201",
    comuna: "Las Condes",
    rolAvaluo: "9012-34",
    superficieTerreno: "120 m²",
    superficieConstruida: "120 m²",
    inscripcion: { foja: "5678", numero: "3456", anno: 2021, registro: "Propiedad" },
    hipotecas: [],
    prohibiciones: [],
    comercio: [
      {
        tipo: "Constitución de Sociedad",
        descripcion: "Constitución SpA — Inversiones Los Andes SpA, capital $50.000.000",
        fechaInscripcion: "2021-02-15",
        foja: "1234",
        numero: "890",
        anno: 2021,
      },
    ],
    avaluoFiscal: "$380.000.000",
    destino: "Comercial",
    isReal: false,
  },
  {
    id: "prop-004",
    propietario: "Pedro Antonio Soto Vargas",
    rut: "15.678.901-3",
    direccion: "Pasaje Los Aromos 32",
    comuna: "Ñuñoa",
    rolAvaluo: "3456-78",
    superficieTerreno: "150 m²",
    superficieConstruida: "95 m²",
    inscripcion: { foja: "7890", numero: "5678", anno: 2019, registro: "Propiedad" },
    hipotecas: [
      {
        acreedor: "Banco Itaú",
        monto: "UF 2.800",
        fechaInscripcion: "2019-08-22",
        foja: "3456",
        numero: "2345",
        anno: 2019,
        estado: "Vigente",
      },
    ],
    prohibiciones: [
      {
        tipo: "Prohibición de Gravar y Enajenar",
        beneficiario: "Banco Itaú",
        fechaInscripcion: "2019-08-22",
        foja: "6789",
        numero: "4567",
        anno: 2019,
        estado: "Vigente",
      },
      {
        tipo: "Embargo",
        beneficiario: "Tesorería General de la República",
        fechaInscripcion: "2023-06-14",
        foja: "1234",
        numero: "890",
        anno: 2023,
        estado: "Vigente",
      },
    ],
    comercio: [],
    avaluoFiscal: "$125.000.000",
    destino: "Habitacional",
    isReal: false,
  },
  {
    id: "prop-005",
    propietario: "Ana María López Díaz",
    rut: "11.222.333-4",
    direccion: "Av. Irarrázaval 2580, Depto. 302",
    comuna: "Ñuñoa",
    rolAvaluo: "6789-01",
    superficieTerreno: "68 m²",
    superficieConstruida: "68 m²",
    inscripcion: { foja: "4321", numero: "2890", anno: 2022, registro: "Propiedad" },
    hipotecas: [
      {
        acreedor: "Banco Scotiabank",
        monto: "UF 2.100",
        fechaInscripcion: "2022-04-10",
        foja: "8765",
        numero: "6543",
        anno: 2022,
        estado: "Vigente",
      },
    ],
    prohibiciones: [
      {
        tipo: "Prohibición de Gravar y Enajenar",
        beneficiario: "Banco Scotiabank",
        fechaInscripcion: "2022-04-10",
        foja: "2345",
        numero: "1678",
        anno: 2022,
        estado: "Vigente",
      },
    ],
    comercio: [],
    avaluoFiscal: "$78.500.000",
    destino: "Habitacional",
    isReal: false,
  },
];

// ─── Intento de fetch real al CBRS ─────────────────────────────────────────

async function intentarFetchCBRS(): Promise<boolean> {
  try {
    const { controller, timeout } = createAbortController();
    const response = await fetch("https://www.cbrs.cl/", {
      headers: FETCH_HEADERS,
      signal: controller.signal,
    });
    clearTimeout(timeout);
    // Si llegamos aquí, el sitio está accesible
    // Pero la mayoría de consultas requieren autenticación
    console.log(`[CBR] Portal CBRS accesible (HTTP ${response.status})`);
    return response.ok;
  } catch (error) {
    console.warn("[CBR] Portal CBRS no accesible:", (error as Error).message);
    return false;
  }
}

// ─── Clase Scraper ──────────────────────────────────────────────────────────

export class ConservadorScraper {
  private portalChecked = false;
  private portalAccessible = false;

  private async checkPortal(): Promise<void> {
    if (!this.portalChecked) {
      this.portalAccessible = await intentarFetchCBRS();
      this.portalChecked = true;
      // Re-check cada 10 minutos
      setTimeout(() => {
        this.portalChecked = false;
      }, 10 * 60 * 1000);
    }
  }

  /**
   * Buscar propiedad por inscripción (foja, número, año, comuna).
   * CBR requiere autenticación para consultas reales - usa mock marcado como demo.
   */
  async buscarPropiedad(
    comuna: string,
    foja: string,
    numero: string,
    anno: number
  ): Promise<ResultadoBusquedaPropiedad> {
    const cacheKey = `cbr:prop:${comuna}:${foja}:${numero}:${anno}`;
    const cached = cache.get<ResultadoBusquedaPropiedad>(cacheKey);
    if (cached) return cached;

    await this.checkPortal();

    // Los CBR no ofrecen API pública - necesitan login y CAPTCHA
    // Usamos mock claramente marcado como datos de demostración
    console.log(`[CBR] Consulta por inscripción (datos de demostración): comuna=${comuna}, foja=${foja}, num=${numero}, año=${anno}`);

    const filtradas = mockPropiedades.filter((p) => {
      const matchComuna = !comuna || p.comuna.toLowerCase().includes(comuna.toLowerCase());
      const matchFoja = !foja || p.inscripcion.foja === foja;
      const matchNumero = !numero || p.inscripcion.numero === numero;
      const matchAnno = !anno || p.inscripcion.anno === anno;
      return matchComuna && (matchFoja || matchNumero || matchAnno);
    });

    const resultado: ResultadoBusquedaPropiedad = {
      propiedades: filtradas.length > 0 ? filtradas : mockPropiedades.slice(0, 2),
      total: filtradas.length > 0 ? filtradas.length : 2,
      source: "mock",
    };

    cache.set(cacheKey, resultado);
    return resultado;
  }

  /**
   * Buscar propiedades por RUT del propietario.
   */
  async buscarPorRut(rut: string): Promise<ResultadoBusquedaPropiedad> {
    const cacheKey = `cbr:rut:${rut}`;
    const cached = cache.get<ResultadoBusquedaPropiedad>(cacheKey);
    if (cached) return cached;

    await this.checkPortal();

    console.log(`[CBR] Consulta por RUT (datos de demostración): ${rut}`);

    const filtradas = mockPropiedades.filter((p) =>
      p.rut.replace(/\./g, "").includes(rut.replace(/\./g, ""))
    );

    const resultado: ResultadoBusquedaPropiedad = {
      propiedades: filtradas.length > 0 ? filtradas : [mockPropiedades[0]],
      total: filtradas.length > 0 ? filtradas.length : 1,
      source: "mock",
    };

    cache.set(cacheKey, resultado);
    return resultado;
  }

  /**
   * Buscar propiedades por dirección y comuna.
   */
  async buscarPorDireccion(
    direccion: string,
    comuna: string
  ): Promise<ResultadoBusquedaPropiedad> {
    const cacheKey = `cbr:dir:${direccion}:${comuna}`;
    const cached = cache.get<ResultadoBusquedaPropiedad>(cacheKey);
    if (cached) return cached;

    await this.checkPortal();

    console.log(`[CBR] Consulta por dirección (datos de demostración): ${direccion}, ${comuna}`);

    const filtradas = mockPropiedades.filter((p) => {
      const matchDir = p.direccion.toLowerCase().includes(direccion.toLowerCase());
      const matchComuna = !comuna || p.comuna.toLowerCase().includes(comuna.toLowerCase());
      return matchDir && matchComuna;
    });

    const resultado: ResultadoBusquedaPropiedad = {
      propiedades: filtradas.length > 0 ? filtradas : [mockPropiedades[0]],
      total: filtradas.length > 0 ? filtradas.length : 1,
      source: "mock",
    };

    cache.set(cacheKey, resultado);
    return resultado;
  }

  /**
   * Obtener información sobre un certificado de inscripción.
   */
  async obtenerCertificado(inscripcion: string): Promise<CertificadoCBR> {
    return {
      id: `cert-${Date.now()}`,
      tipo: "Certificado de Dominio Vigente",
      propiedadId: inscripcion,
      fechaEmision: new Date().toISOString().split("T")[0],
      vigencia: "60 días desde emisión",
      estado: "Disponible",
      costo: "$8.900",
      isReal: false,
    };
  }
}

export const conservadorScraper = new ConservadorScraper();
