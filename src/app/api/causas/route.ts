import { NextRequest } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;
    const materia = searchParams.get("materia");
    const estado = searchParams.get("estado");
    const tribunal = searchParams.get("tribunal");
    const search = searchParams.get("search");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");

    const where: Record<string, unknown> = {};

    if (materia) where.materia = materia;
    if (estado) where.estado = estado;
    if (tribunal) where.tribunal = tribunal;
    if (search) {
      where.OR = [
        { rol: { contains: search } },
        { caratulado: { contains: search } },
      ];
    }

    const [causas, total] = await Promise.all([
      prisma.causa.findMany({
        where,
        include: {
          cliente: { select: { id: true, nombre: true, rut: true } },
          abogado: { select: { id: true, name: true } },
        },
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.causa.count({ where }),
    ]);

    return Response.json({
      data: causas,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching causas:", error);
    return Response.json(
      { error: "Error al obtener las causas" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const {
      rol,
      rit,
      ruc,
      caratulado,
      materia,
      tipo,
      tribunal,
      juez,
      cuantia,
      clienteId,
      abogadoId,
      observaciones,
    } = body;

    if (!rol || !caratulado || !materia || !tribunal || !clienteId || !abogadoId) {
      return Response.json(
        { error: "Faltan campos obligatorios: rol, caratulado, materia, tribunal, clienteId, abogadoId" },
        { status: 400 }
      );
    }

    const causa = await prisma.causa.create({
      data: {
        rol,
        rit: rit || null,
        ruc: ruc || null,
        caratulado,
        materia,
        tipo: tipo || "Ordinario",
        tribunal,
        juez: juez || null,
        cuantia: cuantia ? parseFloat(cuantia) : null,
        clienteId,
        abogadoId,
        observaciones: observaciones || null,
      },
      include: {
        cliente: { select: { id: true, nombre: true, rut: true } },
        abogado: { select: { id: true, name: true } },
      },
    });

    return Response.json({ data: causa }, { status: 201 });
  } catch (error) {
    console.error("Error creating causa:", error);
    return Response.json(
      { error: "Error al crear la causa" },
      { status: 500 }
    );
  }
}
