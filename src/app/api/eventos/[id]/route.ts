import { NextRequest } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const evento = await prisma.evento.findUnique({
      where: { id },
      include: {
        causa: { select: { id: true, rol: true, caratulado: true } },
        usuario: { select: { id: true, name: true } },
      },
    });

    if (!evento) {
      return Response.json(
        { error: "Evento no encontrado" },
        { status: 404 }
      );
    }

    return Response.json({ data: evento });
  } catch (error) {
    console.error("Error fetching evento:", error);
    return Response.json(
      { error: "Error al obtener el evento" },
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

    const existing = await prisma.evento.findUnique({ where: { id } });
    if (!existing) {
      return Response.json(
        { error: "Evento no encontrado" },
        { status: 404 }
      );
    }

    const evento = await prisma.evento.update({
      where: { id },
      data: {
        titulo: body.titulo ?? existing.titulo,
        descripcion:
          body.descripcion !== undefined
            ? body.descripcion
            : existing.descripcion,
        tipo: body.tipo ?? existing.tipo,
        fechaInicio: body.fechaInicio
          ? new Date(body.fechaInicio)
          : existing.fechaInicio,
        fechaFin:
          body.fechaFin !== undefined
            ? body.fechaFin
              ? new Date(body.fechaFin)
              : null
            : existing.fechaFin,
        todoElDia: body.todoElDia ?? existing.todoElDia,
        color: body.color ?? existing.color,
        recordatorio: body.recordatorio ?? existing.recordatorio,
        completado: body.completado ?? existing.completado,
        causaId:
          body.causaId !== undefined ? body.causaId : existing.causaId,
      },
      include: {
        causa: { select: { id: true, rol: true, caratulado: true } },
      },
    });

    return Response.json({ data: evento });
  } catch (error) {
    console.error("Error updating evento:", error);
    return Response.json(
      { error: "Error al actualizar el evento" },
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

    const existing = await prisma.evento.findUnique({ where: { id } });
    if (!existing) {
      return Response.json(
        { error: "Evento no encontrado" },
        { status: 404 }
      );
    }

    await prisma.evento.delete({ where: { id } });

    return Response.json({ message: "Evento eliminado correctamente" });
  } catch (error) {
    console.error("Error deleting evento:", error);
    return Response.json(
      { error: "Error al eliminar el evento" },
      { status: 500 }
    );
  }
}
