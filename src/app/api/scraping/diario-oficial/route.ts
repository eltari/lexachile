import { NextRequest } from "next/server";
import { diarioOficialScraper } from "@/lib/scraping/diario-oficial";
import { cache } from "@/lib/cache";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { accion, query, fecha, id } = body;

    switch (accion) {
      case "buscarPublicaciones": {
        if (!query) {
          return Response.json(
            { error: "El término de búsqueda es obligatorio" },
            { status: 400 }
          );
        }

        const cacheKey = `api:do:buscar:${query}:${fecha || ""}`;
        const cached = cache.get(cacheKey);
        if (cached) {
          return Response.json({ data: cached, cached: true });
        }

        const resultado = await diarioOficialScraper.buscarPublicaciones(query, fecha);
        cache.set(cacheKey, resultado, 5 * 60 * 1000);
        return Response.json({
          data: resultado,
          source: resultado.source,
          cached: false,
        });
      }

      case "obtenerPublicacion": {
        if (!id) {
          return Response.json(
            { error: "El ID de publicación es obligatorio" },
            { status: 400 }
          );
        }

        const publicacion = await diarioOficialScraper.obtenerPublicacion(id);
        return Response.json({
          data: publicacion,
          source: publicacion?.source || "mock",
        });
      }

      default:
        return Response.json(
          { error: "Acción no válida. Use: buscarPublicaciones, obtenerPublicacion" },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error("Error en API Diario Oficial:", error);
    return Response.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}
