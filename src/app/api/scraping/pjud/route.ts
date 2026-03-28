import { NextRequest } from "next/server";
import { pjudScraper } from "@/lib/scraping/pjud";
import { cache } from "@/lib/cache";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { accion, rol, tribunal, rut } = body;

    switch (accion) {
      case "consultarCausa": {
        if (!rol) {
          return Response.json(
            { error: "El ROL es obligatorio" },
            { status: 400 }
          );
        }

        const cacheKey = `api:pjud:causa:${rol}:${tribunal || ""}`;
        const cached = cache.get(cacheKey);
        if (cached) {
          return Response.json({ data: cached, cached: true });
        }

        const causa = await pjudScraper.consultarCausa(rol, tribunal || "");
        if (causa) cache.set(cacheKey, causa, 5 * 60 * 1000);
        return Response.json({
          data: causa,
          source: causa?.source || "mock",
          cached: false,
        });
      }

      case "buscarCausas": {
        if (!rut) {
          return Response.json(
            { error: "El RUT es obligatorio" },
            { status: 400 }
          );
        }

        const cacheKey = `api:pjud:rut:${rut}`;
        const cached = cache.get(cacheKey);
        if (cached) {
          return Response.json({ data: cached, cached: true });
        }

        const resultado = await pjudScraper.buscarCausas(rut);
        cache.set(cacheKey, resultado, 5 * 60 * 1000);
        return Response.json({
          data: resultado,
          source: resultado.source,
          cached: false,
        });
      }

      case "obtenerMovimientos": {
        if (!rol) {
          return Response.json(
            { error: "El ROL es obligatorio" },
            { status: 400 }
          );
        }

        const cacheKey = `api:pjud:mov:${rol}`;
        const cached = cache.get(cacheKey);
        if (cached) {
          return Response.json({ data: cached, cached: true });
        }

        const result = await pjudScraper.obtenerMovimientos(rol);
        cache.set(cacheKey, result, 5 * 60 * 1000);
        return Response.json({
          data: result.movimientos,
          source: result.source,
          cached: false,
        });
      }

      default:
        return Response.json(
          { error: "Acción no válida. Use: consultarCausa, buscarCausas, obtenerMovimientos" },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error("Error en API PJUD:", error);
    return Response.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}
