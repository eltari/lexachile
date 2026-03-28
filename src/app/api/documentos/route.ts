import { NextRequest } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;
    const tipo = searchParams.get("tipo");
    const search = searchParams.get("search");
    const plantilla = searchParams.get("plantilla");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");

    const where: Record<string, unknown> = {};

    if (tipo) where.tipo = tipo;
    if (plantilla !== null) where.plantilla = plantilla === "true";
    if (search) {
      where.OR = [
        { nombre: { contains: search } },
        { contenido: { contains: search } },
      ];
    }

    const [documentos, total] = await Promise.all([
      prisma.documento.findMany({
        where,
        include: {
          causa: { select: { id: true, rol: true, caratulado: true } },
          cliente: { select: { id: true, nombre: true, rut: true } },
          autor: { select: { id: true, name: true } },
        },
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.documento.count({ where }),
    ]);

    return Response.json({
      data: documentos,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching documentos:", error);
    return Response.json(
      { error: "Error al obtener los documentos" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const { nombre, tipo, contenido, archivo, plantilla, causaId, clienteId, autorId } =
      body;

    if (!nombre || !tipo || !autorId) {
      return Response.json(
        { error: "Faltan campos obligatorios: nombre, tipo, autorId" },
        { status: 400 }
      );
    }

    const documento = await prisma.documento.create({
      data: {
        nombre,
        tipo,
        contenido: contenido || null,
        archivo: archivo || null,
        plantilla: plantilla || false,
        causaId: causaId || null,
        clienteId: clienteId || null,
        autorId,
      },
      include: {
        causa: { select: { id: true, rol: true, caratulado: true } },
        cliente: { select: { id: true, nombre: true, rut: true } },
        autor: { select: { id: true, name: true } },
      },
    });

    return Response.json({ data: documento }, { status: 201 });
  } catch (error) {
    console.error("Error creating documento:", error);
    return Response.json(
      { error: "Error al crear el documento" },
      { status: 500 }
    );
  }
}
