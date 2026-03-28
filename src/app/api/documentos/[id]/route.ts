import { NextRequest } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const documento = await prisma.documento.findUnique({
      where: { id },
      include: {
        causa: { select: { id: true, rol: true, caratulado: true } },
        cliente: true,
        autor: { select: { id: true, name: true, email: true } },
      },
    });

    if (!documento) {
      return Response.json(
        { error: "Documento no encontrado" },
        { status: 404 }
      );
    }

    return Response.json({ data: documento });
  } catch (error) {
    console.error("Error fetching documento:", error);
    return Response.json(
      { error: "Error al obtener el documento" },
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

    const existing = await prisma.documento.findUnique({ where: { id } });
    if (!existing) {
      return Response.json(
        { error: "Documento no encontrado" },
        { status: 404 }
      );
    }

    const documento = await prisma.documento.update({
      where: { id },
      data: {
        nombre: body.nombre ?? existing.nombre,
        tipo: body.tipo ?? existing.tipo,
        contenido:
          body.contenido !== undefined ? body.contenido : existing.contenido,
        archivo:
          body.archivo !== undefined ? body.archivo : existing.archivo,
        plantilla: body.plantilla ?? existing.plantilla,
        causaId:
          body.causaId !== undefined ? body.causaId : existing.causaId,
        clienteId:
          body.clienteId !== undefined ? body.clienteId : existing.clienteId,
      },
      include: {
        causa: { select: { id: true, rol: true, caratulado: true } },
        cliente: { select: { id: true, nombre: true, rut: true } },
        autor: { select: { id: true, name: true } },
      },
    });

    return Response.json({ data: documento });
  } catch (error) {
    console.error("Error updating documento:", error);
    return Response.json(
      { error: "Error al actualizar el documento" },
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

    const existing = await prisma.documento.findUnique({ where: { id } });
    if (!existing) {
      return Response.json(
        { error: "Documento no encontrado" },
        { status: 404 }
      );
    }

    await prisma.documento.delete({ where: { id } });

    return Response.json({ message: "Documento eliminado correctamente" });
  } catch (error) {
    console.error("Error deleting documento:", error);
    return Response.json(
      { error: "Error al eliminar el documento" },
      { status: 500 }
    );
  }
}
