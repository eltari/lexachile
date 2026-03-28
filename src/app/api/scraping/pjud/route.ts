import { NextRequest } from "next/server";
import { pjudScraper } from "@/lib/scraping/pjud";

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
        const causa = await pjudScraper.consultarCausa(rol, tribunal || "");
        return Response.json({ data: causa });
      }

      case "buscarCausas": {
        if (!rut) {
          return Response.json(
            { error: "El RUT es obligatorio" },
            { status: 400 }
          );
        }
        const resultado = await pjudScraper.buscarCausas(rut);
        return Response.json({ data: resultado });
      }

      case "obtenerMovimientos": {
        if (!rol) {
          return Response.json(
            { error: "El ROL es obligatorio" },
            { status: 400 }
          );
        }
        const movimientos = await pjudScraper.obtenerMovimientos(rol);
        return Response.json({ data: movimientos });
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
