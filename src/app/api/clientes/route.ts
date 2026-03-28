import { NextRequest } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;
    const tipo = searchParams.get("tipo");
    const search = searchParams.get("search");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");

    const where: Record<string, unknown> = {};

    if (tipo) where.tipo = tipo;
    if (search) {
      where.OR = [
        { nombre: { contains: search } },
        { rut: { contains: search } },
        { email: { contains: search } },
      ];
    }

    const [clientes, total] = await Promise.all([
      prisma.cliente.findMany({
        where,
        include: {
          _count: { select: { causas: true } },
          abogado: { select: { id: true, name: true } },
        },
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.cliente.count({ where }),
    ]);

    return Response.json({
      data: clientes,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching clientes:", error);
    return Response.json(
      { error: "Error al obtener los clientes" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const { tipo, nombre, rut, email, telefono, direccion, comuna, ciudad, region, giro, representante, abogadoId } = body;

    if (!nombre || !rut || !abogadoId) {
      return Response.json(
        { error: "Faltan campos obligatorios: nombre, rut, abogadoId" },
        { status: 400 }
      );
    }

    // Check for duplicate RUT
    const existingRut = await prisma.cliente.findUnique({ where: { rut } });
    if (existingRut) {
      return Response.json(
        { error: "Ya existe un cliente con ese RUT" },
        { status: 409 }
      );
    }

    const cliente = await prisma.cliente.create({
      data: {
        tipo: tipo || "natural",
        nombre,
        rut,
        email: email || null,
        telefono: telefono || null,
        direccion: direccion || null,
        comuna: comuna || null,
        ciudad: ciudad || null,
        region: region || null,
        giro: giro || null,
        representante: representante || null,
        abogadoId,
      },
      include: {
        _count: { select: { causas: true } },
        abogado: { select: { id: true, name: true } },
      },
    });

    return Response.json({ data: cliente }, { status: 201 });
  } catch (error) {
    console.error("Error creating cliente:", error);
    return Response.json(
      { error: "Error al crear el cliente" },
      { status: 500 }
    );
  }
}
