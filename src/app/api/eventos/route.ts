import { NextRequest } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;
    const desde = searchParams.get("desde");
    const hasta = searchParams.get("hasta");
    const tipo = searchParams.get("tipo");

    const where: Record<string, unknown> = {};

    if (desde || hasta) {
      where.fechaInicio = {};
      if (desde)
        (where.fechaInicio as Record<string, unknown>).gte = new Date(desde);
      if (hasta)
        (where.fechaInicio as Record<string, unknown>).lte = new Date(hasta);
    }

    if (tipo) where.tipo = tipo;

    const eventos = await prisma.evento.findMany({
      where,
      include: {
        causa: { select: { id: true, rol: true, caratulado: true } },
      },
      orderBy: { fechaInicio: "asc" },
    });

    return Response.json({ data: eventos });
  } catch (error) {
    console.error("Error fetching eventos:", error);
    return Response.json(
      { error: "Error al obtener los eventos" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const {
      titulo,
      descripcion,
      tipo,
      fechaInicio,
      fechaFin,
      todoElDia,
      color,
      recordatorio,
      causaId,
      usuarioId,
    } = body;

    if (!titulo || !tipo || !fechaInicio || !usuarioId) {
      return Response.json(
        {
          error:
            "Faltan campos obligatorios: titulo, tipo, fechaInicio, usuarioId",
        },
        { status: 400 }
      );
    }

    const evento = await prisma.evento.create({
      data: {
        titulo,
        descripcion: descripcion || null,
        tipo,
        fechaInicio: new Date(fechaInicio),
        fechaFin: fechaFin ? new Date(fechaFin) : null,
        todoElDia: todoElDia || false,
        color: color || "#3b82f6",
        recordatorio: recordatorio !== undefined ? recordatorio : true,
        causaId: causaId || null,
        usuarioId,
      },
      include: {
        causa: { select: { id: true, rol: true, caratulado: true } },
      },
    });

    return Response.json({ data: evento }, { status: 201 });
  } catch (error) {
    console.error("Error creating evento:", error);
    return Response.json(
      { error: "Error al crear el evento" },
      { status: 500 }
    );
  }
}
