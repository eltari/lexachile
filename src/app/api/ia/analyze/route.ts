import { NextRequest } from "next/server";
import { analyzeDocument } from "@/lib/ai/analyze";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { texto, tipo } = body;

    if (!texto) {
      return Response.json(
        { error: "El campo 'texto' es obligatorio" },
        { status: 400 }
      );
    }

    const analysis = await analyzeDocument(texto, tipo);

    return Response.json({ data: analysis });
  } catch (error) {
    console.error("Error analyzing document:", error);
    return Response.json(
      { error: "Error al analizar el documento" },
      { status: 500 }
    );
  }
}
