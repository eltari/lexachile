import { NextRequest } from "next/server";
import { conservadorScraper } from "@/lib/scraping/conservador";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { accion, comuna, foja, numero, anno, rut, direccion, inscripcion } = body;

    switch (accion) {
      case "buscarPropiedad": {
        const resultado = await conservadorScraper.buscarPropiedad(
          comuna || "",
          foja || "",
          numero || "",
          anno || 0
        );
        return Response.json({ data: resultado });
      }

      case "buscarPorRut": {
        if (!rut) {
          return Response.json(
            { error: "El RUT es obligatorio" },
            { status: 400 }
          );
        }
        const resultado = await conservadorScraper.buscarPorRut(rut);
        return Response.json({ data: resultado });
      }

      case "buscarPorDireccion": {
        if (!direccion) {
          return Response.json(
            { error: "La dirección es obligatoria" },
            { status: 400 }
          );
        }
        const resultado = await conservadorScraper.buscarPorDireccion(
          direccion,
          comuna || ""
        );
        return Response.json({ data: resultado });
      }

      case "obtenerCertificado": {
        if (!inscripcion) {
          return Response.json(
            { error: "La inscripción es obligatoria" },
            { status: 400 }
          );
        }
        const certificado = await conservadorScraper.obtenerCertificado(inscripcion);
        return Response.json({ data: certificado });
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
