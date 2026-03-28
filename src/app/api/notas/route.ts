import { NextRequest } from "next/server";
import { prisma } from "@/lib/db";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { contenido, clienteId, autorId } = body;

    if (!contenido || !clienteId || !autorId) {
      return Response.json(
        { error: "Faltan campos obligatorios: contenido, clienteId, autorId" },
        { status: 400 }
      );
    }

    const nota = await prisma.nota.create({
      data: {
        contenido,
        clienteId,
        autorId,
      },
      include: {
        autor: { select: { id: true, name: true } },
      },
    });

    return Response.json({ data: nota }, { status: 201 });
  } catch (error) {
    console.error("Error creating nota:", error);
    return Response.json(
      { error: "Error al crear la nota" },
      { status: 500 }
    );
  }
}
