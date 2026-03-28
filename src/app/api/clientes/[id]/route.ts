import { NextRequest } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const cliente = await prisma.cliente.findUnique({
      where: { id },
      include: {
        abogado: { select: { id: true, name: true, email: true } },
        causas: {
          include: {
            abogado: { select: { id: true, name: true } },
          },
          orderBy: { createdAt: "desc" },
        },
        documentos: { orderBy: { createdAt: "desc" } },
        notas: {
          include: {
            autor: { select: { id: true, name: true } },
          },
          orderBy: { createdAt: "desc" },
        },
        _count: { select: { causas: true, documentos: true, notas: true } },
      },
    });

    if (!cliente) {
      return Response.json(
        { error: "Cliente no encontrado" },
        { status: 404 }
      );
    }

    return Response.json({ data: cliente });
  } catch (error) {
    console.error("Error fetching cliente:", error);
    return Response.json(
      { error: "Error al obtener el cliente" },
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

    const existing = await prisma.cliente.findUnique({ where: { id } });
    if (!existing) {
      return Response.json(
        { error: "Cliente no encontrado" },
        { status: 404 }
      );
    }

    // Check for duplicate RUT if changing
    if (body.rut && body.rut !== existing.rut) {
      const duplicateRut = await prisma.cliente.findUnique({
        where: { rut: body.rut },
      });
      if (duplicateRut) {
        return Response.json(
          { error: "Ya existe un cliente con ese RUT" },
          { status: 409 }
        );
      }
    }

    const cliente = await prisma.cliente.update({
      where: { id },
      data: {
        tipo: body.tipo ?? existing.tipo,
        nombre: body.nombre ?? existing.nombre,
        rut: body.rut ?? existing.rut,
        email: body.email !== undefined ? body.email : existing.email,
        telefono: body.telefono !== undefined ? body.telefono : existing.telefono,
        direccion: body.direccion !== undefined ? body.direccion : existing.direccion,
        comuna: body.comuna !== undefined ? body.comuna : existing.comuna,
        ciudad: body.ciudad !== undefined ? body.ciudad : existing.ciudad,
        region: body.region !== undefined ? body.region : existing.region,
        giro: body.giro !== undefined ? body.giro : existing.giro,
        representante:
          body.representante !== undefined
            ? body.representante
            : existing.representante,
      },
      include: {
        _count: { select: { causas: true } },
        abogado: { select: { id: true, name: true } },
      },
    });

    return Response.json({ data: cliente });
  } catch (error) {
    console.error("Error updating cliente:", error);
    return Response.json(
      { error: "Error al actualizar el cliente" },
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

    const existing = await prisma.cliente.findUnique({ where: { id } });
    if (!existing) {
      return Response.json(
        { error: "Cliente no encontrado" },
        { status: 404 }
      );
    }

    // Check if client has causas
    const causasCount = await prisma.causa.count({ where: { clienteId: id } });
    if (causasCount > 0) {
      return Response.json(
        {
          error: `No se puede eliminar el cliente porque tiene ${causasCount} causa(s) asociada(s). Elimine o reasigne las causas primero.`,
        },
        { status: 409 }
      );
    }

    await prisma.cliente.delete({ where: { id } });

    return Response.json({ message: "Cliente eliminado correctamente" });
  } catch (error) {
    console.error("Error deleting cliente:", error);
    return Response.json(
      { error: "Error al eliminar el cliente" },
      { status: 500 }
    );
  }
}
