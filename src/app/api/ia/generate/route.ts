import { NextRequest } from "next/server";
import { generateDocument } from "@/lib/ai/generate";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { tipo, campos } = body;

    if (!tipo) {
      return Response.json(
        { error: "El campo 'tipo' es obligatorio" },
        { status: 400 }
      );
    }

    const result = await generateDocument({
      tipo,
      campos: campos || {},
    });

    return Response.json({ data: result });
  } catch (error) {
    console.error("Error generating document:", error);
    return Response.json(
      { error: "Error al generar el documento" },
      { status: 500 }
    );
  }
}
