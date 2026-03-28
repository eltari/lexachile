import { NextRequest } from "next/server";
import { bcnScraper } from "@/lib/scraping/bcn";
import { cache } from "@/lib/cache";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { accion, query, numero } = body;

    switch (accion) {
      case "buscarLey": {
        if (!query) {
          return Response.json(
            { error: "El término de búsqueda es obligatorio" },
            { status: 400 }
          );
        }

        // Cache a nivel de API
        const cacheKey = `api:bcn:buscar:${query}`;
        const cached = cache.get(cacheKey);
        if (cached) {
          return Response.json({ data: cached, cached: true });
        }

        const resultado = await bcnScraper.buscarLey(query);
        cache.set(cacheKey, resultado, 5 * 60 * 1000);
        return Response.json({
          data: resultado,
          source: resultado.source,
          cached: false,
        });
      }

      case "obtenerLey": {
        if (!numero) {
          return Response.json(
            { error: "El número de ley es obligatorio" },
            { status: 400 }
          );
        }

        const ley = await bcnScraper.obtenerLey(numero);
        return Response.json({
          data: ley,
          source: ley?.source || "mock",
        });
      }

      case "buscarJurisprudencia": {
        if (!query) {
          return Response.json(
            { error: "El término de búsqueda es obligatorio" },
            { status: 400 }
          );
        }

        const resultado = await bcnScraper.buscarJurisprudencia(query);
        return Response.json({
          data: resultado,
          source: resultado.source,
        });
      }

      default:
        return Response.json(
          { error: "Acción no válida. Use: buscarLey, obtenerLey, buscarJurisprudencia" },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error("Error en API BCN:", error);
    return Response.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}
