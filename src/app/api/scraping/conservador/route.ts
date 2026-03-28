import { NextRequest } from "next/server";
import { conservadorScraper } from "@/lib/scraping/conservador";
import { cache } from "@/lib/cache";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { accion, comuna, foja, numero, anno, rut, direccion, inscripcion } = body;

    switch (accion) {
      case "buscarPropiedad": {
        const cacheKey = `api:cbr:prop:${comuna}:${foja}:${numero}:${anno}`;
        const cached = cache.get(cacheKey);
        if (cached) {
          return Response.json({ data: cached, cached: true });
        }

        const resultado = await conservadorScraper.buscarPropiedad(
          comuna || "",
          foja || "",
          numero || "",
          anno || 0
        );
        cache.set(cacheKey, resultado, 5 * 60 * 1000);
        return Response.json({
          data: resultado,
          source: resultado.source,
          cached: false,
        });
      }

      case "buscarPorRut": {
        if (!rut) {
          return Response.json(
            { error: "El RUT es obligatorio" },
            { status: 400 }
          );
        }

        const cacheKey = `api:cbr:rut:${rut}`;
        const cached = cache.get(cacheKey);
        if (cached) {
          return Response.json({ data: cached, cached: true });
        }

        const resultado = await conservadorScraper.buscarPorRut(rut);
        cache.set(cacheKey, resultado, 5 * 60 * 1000);
        return Response.json({
          data: resultado,
          source: resultado.source,
          cached: false,
        });
      }

      case "buscarPorDireccion": {
        if (!direccion) {
          return Response.json(
            { error: "La dirección es obligatoria" },
            { status: 400 }
          );
        }

        const cacheKey = `api:cbr:dir:${direccion}:${comuna}`;
        const cached = cache.get(cacheKey);
        if (cached) {
          return Response.json({ data: cached, cached: true });
        }

        const resultado = await conservadorScraper.buscarPorDireccion(
          direccion,
          comuna || ""
        );
        cache.set(cacheKey, resultado, 5 * 60 * 1000);
        return Response.json({
          data: resultado,
          source: resultado.source,
          cached: false,
        });
      }

      case "obtenerCertificado": {
        if (!inscripcion) {
          return Response.json(
            { error: "La inscripción es obligatoria" },
            { status: 400 }
          );
        }
        const certificado = await conservadorScraper.obtenerCertificado(inscripcion);
        return Response.json({
          data: certificado,
          source: certificado.isReal ? "real" : "mock",
        });
      }

      default:
        return Response.json(
          { error: "Acción no válida. Use: buscarPropiedad, buscarPorRut, buscarPorDireccion, obtenerCertificado" },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error("Error en API Conservador:", error);
    return Response.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}
