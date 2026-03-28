import { NextRequest } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const causa = await prisma.causa.findUnique({
      where: { id },
      include: {
        cliente: true,
        abogado: { select: { id: true, name: true, email: true } },
        movimientos: { orderBy: { fecha: "desc" } },
        documentos: { orderBy: { createdAt: "desc" } },
        eventos: { orderBy: { fechaInicio: "asc" } },
      },
    });

    if (!causa) {
      return Response.json(
        { error: "Causa no encontrada" },
        { status: 404 }
      );
    }

    return Response.json({ data: causa });
  } catch (error) {
    console.error("Error fetching causa:", error);
    return Response.json(
      { error: "Error al obtener la causa" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    const existing = await prisma.causa.findUnique({ where: { id } });
    if (!existing) {
      return Response.json(
        { error: "Causa no encontrada" },
        { status: 404 }
      );
    }

    const causa = await prisma.causa.update({
      where: { id },
      data: {
        rol: body.rol ?? existing.rol,
        rit: body.rit !== undefined ? body.rit : existing.rit,
        ruc: body.ruc !== undefined ? body.ruc : existing.ruc,
        caratulado: body.caratulado ?? existing.caratulado,
        materia: body.materia ?? existing.materia,
        tipo: body.tipo ?? existing.tipo,
        estado: body.estado ?? existing.estado,
        tribunal: body.tribunal ?? existing.tribunal,
        juez: body.juez !== undefined ? body.juez : existing.juez,
        cuantia: body.cuantia !== undefined ? body.cuantia : existing.cuantia,
        observaciones:
          body.observaciones !== undefined
            ? body.observaciones
            : existing.observaciones,
        fechaTermino:
          body.fechaTermino !== undefined
            ? body.fechaTermino
              ? new Date(body.fechaTermino)
              : null
            : existing.fechaTermino,
      },
      include: {
        cliente: { select: { id: true, nombre: true, rut: true } },
        abogado: { select: { id: true, name: true } },
      },
    });

    return Response.json({ data: causa });
  } catch (error) {
    console.error("Error updating causa:", error);
    return Response.json(
      { error: "Error al actualizar la causa" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const existing = await prisma.causa.findUnique({ where: { id } });
    if (!existing) {
      return Response.json(
        { error: "Causa no encontrada" },
        { status: 404 }
      );
    }

    await prisma.causa.delete({ where: { id } });

    return Response.json({ message: "Causa eliminada correctamente" });
  } catch (error) {
    console.error("Error deleting causa:", error);
    return Response.json(
      { error: "Error al eliminar la causa" },
      { status: 500 }
    );
  }
}
