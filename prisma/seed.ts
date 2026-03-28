import { PrismaClient } from "@prisma/client";
import { hashSync } from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Iniciando seed de datos...");

  // Limpiar datos existentes
  await prisma.movimiento.deleteMany();
  await prisma.evento.deleteMany();
  await prisma.documento.deleteMany();
  await prisma.nota.deleteMany();
  await prisma.causa.deleteMany();
  await prisma.cliente.deleteMany();
  await prisma.user.deleteMany();
  await prisma.ley.deleteMany();
  await prisma.propiedadCBR.deleteMany();

  console.log("🗑️  Datos anteriores eliminados");

  // ==================== USUARIOS ====================
  const hashedPassword = hashSync("123456", 10);

  const admin = await prisma.user.create({
    data: {
      name: "Carlos Mendoza Fuentes",
      email: "admin@lexachile.cl",
      password: hashedPassword,
      role: "admin",
      phone: "+56 9 8765 4321",
      rut: "12.345.678-5",
    },
  });

  const abogado = await prisma.user.create({
    data: {
      name: "María Fernanda Soto Errázuriz",
      email: "maria.soto@lexachile.cl",
      password: hashedPassword,
      role: "abogado",
      phone: "+56 9 7654 3210",
      rut: "15.678.432-1",
    },
  });

  const asistente = await prisma.user.create({
    data: {
      name: "Rodrigo Andrés Valenzuela López",
      email: "rodrigo.valenzuela@lexachile.cl",
      password: hashedPassword,
      role: "asistente",
      phone: "+56 9 6543 2109",
      rut: "18.234.567-K",
    },
  });

  console.log("👥 Usuarios creados:", admin.name, abogado.name, asistente.name);

  // ==================== CLIENTES ====================
  const cliente1 = await prisma.cliente.create({
    data: {
      tipo: "natural",
      nombre: "Juan Pablo Herrera Contreras",
      rut: "16.789.432-3",
      email: "jpherrera@gmail.com",
      telefono: "+56 9 5432 1098",
      direccion: "Av. Providencia 2456, Oficina 301",
      comuna: "Providencia",
      ciudad: "Santiago",
      region: "Región Metropolitana",
      abogadoId: abogado.id,
    },
  });

  const cliente2 = await prisma.cliente.create({
    data: {
      tipo: "juridica",
      nombre: "Constructora Los Andes SpA",
      rut: "76.543.210-8",
      email: "legal@constructoralosandes.cl",
      telefono: "+56 2 2345 6789",
      direccion: "Av. Apoquindo 4500, Piso 12",
      comuna: "Las Condes",
      ciudad: "Santiago",
      region: "Región Metropolitana",
      giro: "Construcción de edificios residenciales",
      representante: "Andrés Felipe Muñoz Tapia",
      abogadoId: abogado.id,
    },
  });

  const cliente3 = await prisma.cliente.create({
    data: {
      tipo: "natural",
      nombre: "Catalina Andrea Reyes Muñoz",
      rut: "17.654.321-9",
      email: "catalina.reyes@hotmail.com",
      telefono: "+56 9 4321 0987",
      direccion: "Pasaje Los Olmos 123",
      comuna: "Ñuñoa",
      ciudad: "Santiago",
      region: "Región Metropolitana",
      abogadoId: admin.id,
    },
  });

  const cliente4 = await prisma.cliente.create({
    data: {
      tipo: "juridica",
      nombre: "Sociedad Agrícola El Roble Ltda.",
      rut: "77.890.123-4",
      email: "contacto@agricolaelroble.cl",
      telefono: "+56 2 2987 6543",
      direccion: "Camino El Monte 890",
      comuna: "Melipilla",
      ciudad: "Melipilla",
      region: "Región Metropolitana",
      giro: "Agricultura y ganadería",
      representante: "Francisco Javier Ortiz Bravo",
      abogadoId: abogado.id,
    },
  });

  const cliente5 = await prisma.cliente.create({
    data: {
      tipo: "natural",
      nombre: "Roberto Carlos Espinoza Díaz",
      rut: "14.567.890-6",
      email: "respinoza@yahoo.com",
      telefono: "+56 9 3210 9876",
      direccion: "Calle San Diego 1234, Depto 56",
      comuna: "Santiago Centro",
      ciudad: "Santiago",
      region: "Región Metropolitana",
      abogadoId: admin.id,
    },
  });

  console.log("🏢 Clientes creados: 5");

  // ==================== CAUSAS ====================
  const causa1 = await prisma.causa.create({
    data: {
      rol: "C-1234-2024",
      caratulado: "Herrera Contreras con Banco Nacional",
      materia: "civil",
      tipo: "ordinario",
      estado: "en_tramitacion",
      tribunal: "1° Juzgado Civil de Santiago",
      juez: "Sra. Jueza Patricia González Ríos",
      fechaIngreso: new Date("2024-03-15"),
      cuantia: 45000000,
      moneda: "CLP",
      observaciones: "Demanda por incumplimiento contractual en crédito hipotecario",
      abogadoId: abogado.id,
      clienteId: cliente1.id,
    },
  });

  const causa2 = await prisma.causa.create({
    data: {
      rol: "C-5678-2024",
      rit: "T-456-2024",
      caratulado: "Constructora Los Andes SpA con Inmobiliaria Pacífico S.A.",
      materia: "civil",
      tipo: "ejecutivo",
      estado: "en_tramitacion",
      tribunal: "2° Juzgado Civil de Santiago",
      juez: "Sr. Juez Marco Antonio Fuentes Silva",
      fechaIngreso: new Date("2024-06-20"),
      cuantia: 120000000,
      moneda: "CLP",
      observaciones: "Cobro de facturas impagas por servicios de construcción",
      abogadoId: abogado.id,
      clienteId: cliente2.id,
    },
  });

  const causa3 = await prisma.causa.create({
    data: {
      rol: "RIT O-789-2025",
      ruc: "2500123456-7",
      caratulado: "Reyes Muñoz con Empresa de Servicios Integrales Ltda.",
      materia: "laboral",
      tipo: "ordinario",
      estado: "en_tramitacion",
      tribunal: "1° Juzgado de Letras del Trabajo de Santiago",
      juez: "Sr. Juez Roberto Alejandro Vidal Parra",
      fechaIngreso: new Date("2025-01-10"),
      cuantia: 25000000,
      moneda: "CLP",
      observaciones: "Despido injustificado y cobro de prestaciones laborales",
      abogadoId: admin.id,
      clienteId: cliente3.id,
    },
  });

  const causa4 = await prisma.causa.create({
    data: {
      rol: "RIT C-321-2025",
      caratulado: "Reyes Muñoz con Espinoza Díaz",
      materia: "familia",
      tipo: "contencioso",
      estado: "ingresada",
      tribunal: "Juzgado de Familia de Santiago",
      juez: "Sra. Jueza Carolina Beatriz Morales Saavedra",
      fechaIngreso: new Date("2025-02-28"),
      observaciones: "Regulación de pensión alimenticia y régimen de visitas",
      abogadoId: admin.id,
      clienteId: cliente3.id,
    },
  });

  const causa5 = await prisma.causa.create({
    data: {
      rol: "RUC 2400567890-3",
      rit: "RIT 1234-2024",
      caratulado: "Ministerio Público con Espinoza Díaz",
      materia: "penal",
      tipo: "simplificado",
      estado: "en_tramitacion",
      tribunal: "7° Juzgado de Garantía de Santiago",
      juez: "Sr. Juez Fernando Andrés Castillo Ibáñez",
      fechaIngreso: new Date("2024-11-05"),
      observaciones: "Delito de lesiones menos graves, defensa del imputado",
      abogadoId: admin.id,
      clienteId: cliente5.id,
    },
  });

  const causa6 = await prisma.causa.create({
    data: {
      rol: "C-9012-2025",
      caratulado: "Sociedad Agrícola El Roble Ltda. con Fisco de Chile",
      materia: "civil",
      tipo: "ordinario",
      estado: "ingresada",
      tribunal: "3° Juzgado Civil de Santiago",
      juez: "Sra. Jueza Daniela Paz Herrera Contreras",
      fechaIngreso: new Date("2025-03-01"),
      cuantia: 350000000,
      moneda: "CLP",
      observaciones: "Indemnización de perjuicios por expropiación irregular",
      abogadoId: abogado.id,
      clienteId: cliente4.id,
    },
  });

  const causa7 = await prisma.causa.create({
    data: {
      rol: "C-3456-2023",
      caratulado: "Herrera Contreras con Herrera Saavedra",
      materia: "civil",
      tipo: "ordinario",
      estado: "terminada",
      tribunal: "1° Juzgado Civil de Santiago",
      fechaIngreso: new Date("2023-08-12"),
      fechaTermino: new Date("2024-12-20"),
      cuantia: 15000000,
      moneda: "CLP",
      observaciones: "Partición de bienes hereditarios - caso finalizado con acuerdo",
      abogadoId: abogado.id,
      clienteId: cliente1.id,
    },
  });

  const causa8 = await prisma.causa.create({
    data: {
      rol: "RIT O-112-2025",
      ruc: "2500234567-1",
      caratulado: "Espinoza Díaz con Transportes Rápido S.A.",
      materia: "laboral",
      tipo: "ordinario",
      estado: "en_tramitacion",
      tribunal: "2° Juzgado de Letras del Trabajo de Santiago",
      juez: "Sra. Jueza Valentina Isabel Rojas Pizarro",
      fechaIngreso: new Date("2025-02-15"),
      cuantia: 18000000,
      moneda: "CLP",
      observaciones: "Accidente laboral con incapacidad parcial",
      abogadoId: admin.id,
      clienteId: cliente5.id,
    },
  });

  console.log("⚖️  Causas creadas: 8");

  // ==================== MOVIMIENTOS ====================
  const movimientos = [
    { tipo: "presentacion", descripcion: "Presentación de demanda civil por incumplimiento contractual", fecha: new Date("2024-03-15"), folio: "001", causaId: causa1.id },
    { tipo: "resolucion", descripcion: "Resolución: Téngase por presentada la demanda, traslado por 15 días", fecha: new Date("2024-03-22"), folio: "002", causaId: causa1.id },
    { tipo: "notificacion", descripcion: "Notificación personal al demandado en domicilio registrado", fecha: new Date("2024-04-05"), folio: "003", causaId: causa1.id },
    { tipo: "contestacion", descripcion: "Contestación de la demanda por parte del Banco Nacional", fecha: new Date("2024-04-20"), folio: "004", causaId: causa1.id },

    { tipo: "presentacion", descripcion: "Interposición de demanda ejecutiva con título ejecutivo (facturas protestadas)", fecha: new Date("2024-06-20"), folio: "001", causaId: causa2.id },
    { tipo: "resolucion", descripcion: "Despáchese mandamiento de ejecución y embargo", fecha: new Date("2024-06-25"), folio: "002", causaId: causa2.id },
    { tipo: "embargo", descripcion: "Acta de embargo sobre bienes inmuebles del deudor", fecha: new Date("2024-07-15"), folio: "003", causaId: causa2.id },

    { tipo: "presentacion", descripcion: "Presentación de demanda laboral por despido injustificado", fecha: new Date("2025-01-10"), folio: "001", causaId: causa3.id },
    { tipo: "resolucion", descripcion: "Se cita a audiencia preparatoria para el 25 de febrero de 2025", fecha: new Date("2025-01-15"), folio: "002", causaId: causa3.id },
    { tipo: "audiencia", descripcion: "Audiencia preparatoria realizada, se fijan hechos a probar", fecha: new Date("2025-02-25"), folio: "003", causaId: causa3.id },

    { tipo: "presentacion", descripcion: "Presentación de demanda de alimentos y regulación de visitas", fecha: new Date("2025-02-28"), folio: "001", causaId: causa4.id },
    { tipo: "resolucion", descripcion: "Se fijan alimentos provisorios y se cita a audiencia preparatoria", fecha: new Date("2025-03-05"), folio: "002", causaId: causa4.id },

    { tipo: "formalizacion", descripcion: "Formalización de la investigación por lesiones menos graves art. 399 CP", fecha: new Date("2024-11-10"), folio: "001", causaId: causa5.id },

    { tipo: "presentacion", descripcion: "Presentación de demanda de indemnización contra el Fisco", fecha: new Date("2025-03-01"), folio: "001", causaId: causa6.id },

    { tipo: "sentencia", descripcion: "Sentencia definitiva: Se aprueba acuerdo de partición entre las partes", fecha: new Date("2024-12-20"), folio: "012", causaId: causa7.id },
  ];

  for (const mov of movimientos) {
    await prisma.movimiento.create({ data: mov });
  }

  console.log("📋 Movimientos creados: 15");

  // ==================== EVENTOS ====================
  const eventos = [
    {
      titulo: "Audiencia de conciliación - Herrera con Banco Nacional",
      descripcion: "Audiencia de conciliación obligatoria ante el tribunal. Llevar propuesta de acuerdo.",
      tipo: "audiencia",
      fechaInicio: new Date("2026-04-15T09:30:00"),
      fechaFin: new Date("2026-04-15T11:00:00"),
      color: "#3b82f6",
      causaId: causa1.id,
      usuarioId: abogado.id,
    },
    {
      titulo: "Vencimiento plazo excepciones - Constructora Los Andes",
      descripcion: "Vence plazo para oponer excepciones en juicio ejecutivo",
      tipo: "vencimiento",
      fechaInicio: new Date("2026-04-10T23:59:00"),
      todoElDia: true,
      color: "#ef4444",
      causaId: causa2.id,
      usuarioId: abogado.id,
    },
    {
      titulo: "Audiencia de juicio oral laboral - Reyes con Servicios Integrales",
      descripcion: "Audiencia de juicio oral. Preparar testigos y prueba documental.",
      tipo: "audiencia",
      fechaInicio: new Date("2026-04-22T10:00:00"),
      fechaFin: new Date("2026-04-22T13:00:00"),
      color: "#3b82f6",
      causaId: causa3.id,
      usuarioId: admin.id,
    },
    {
      titulo: "Audiencia preparatoria - Causa de familia",
      descripcion: "Audiencia preparatoria por regulación de pensión alimenticia y visitas.",
      tipo: "audiencia",
      fechaInicio: new Date("2026-04-18T11:00:00"),
      fechaFin: new Date("2026-04-18T12:30:00"),
      color: "#8b5cf6",
      causaId: causa4.id,
      usuarioId: admin.id,
    },
    {
      titulo: "Plazo para presentar querella - Espinoza Díaz",
      descripcion: "Último día para presentar querella adhesiva en causa penal",
      tipo: "plazo",
      fechaInicio: new Date("2026-04-08T23:59:00"),
      todoElDia: true,
      color: "#f59e0b",
      causaId: causa5.id,
      usuarioId: admin.id,
    },
    {
      titulo: "Reunión con cliente - Sociedad Agrícola El Roble",
      descripcion: "Reunión para revisar estrategia de la demanda contra el Fisco. Oficina Providencia.",
      tipo: "reunion",
      fechaInicio: new Date("2026-04-05T15:00:00"),
      fechaFin: new Date("2026-04-05T16:30:00"),
      color: "#10b981",
      usuarioId: abogado.id,
    },
    {
      titulo: "Vencimiento plazo contestación - Agrícola El Roble con Fisco",
      descripcion: "Vence plazo de 30 días para que el Fisco conteste la demanda",
      tipo: "vencimiento",
      fechaInicio: new Date("2026-04-30T23:59:00"),
      todoElDia: true,
      color: "#ef4444",
      causaId: causa6.id,
      usuarioId: abogado.id,
    },
    {
      titulo: "Audiencia de revisión de medidas cautelares - Penal",
      descripcion: "Revisión de medidas cautelares en causa penal por lesiones",
      tipo: "audiencia",
      fechaInicio: new Date("2026-05-05T09:00:00"),
      fechaFin: new Date("2026-05-05T10:00:00"),
      color: "#3b82f6",
      causaId: causa5.id,
      usuarioId: admin.id,
    },
    {
      titulo: "Plazo recurso de apelación - Accidente laboral",
      descripcion: "Vence plazo para apelar resolución interlocutoria",
      tipo: "plazo",
      fechaInicio: new Date("2026-04-25T23:59:00"),
      todoElDia: true,
      color: "#f59e0b",
      causaId: causa8.id,
      usuarioId: admin.id,
    },
    {
      titulo: "Audiencia de prueba - Espinoza con Transportes Rápido",
      descripcion: "Audiencia de juicio para rendir prueba testimonial y pericial",
      tipo: "audiencia",
      fechaInicio: new Date("2026-05-12T10:00:00"),
      fechaFin: new Date("2026-05-12T13:00:00"),
      color: "#3b82f6",
      causaId: causa8.id,
      usuarioId: admin.id,
    },
  ];

  for (const evento of eventos) {
    await prisma.evento.create({ data: evento });
  }

  console.log("📅 Eventos creados: 10");

  // ==================== DOCUMENTOS ====================
  const documentos = [
    {
      nombre: "Demanda Civil - Herrera con Banco Nacional",
      tipo: "escrito_judicial",
      contenido: "EN LO PRINCIPAL: Demanda de indemnización de perjuicios por incumplimiento contractual. PRIMER OTROSÍ: Acompaña documentos. SEGUNDO OTROSÍ: Patrocinio y poder.\n\nS.J.L. EN LO CIVIL (1°) DE SANTIAGO\n\nJuan Pablo Herrera Contreras, cédula de identidad N° 16.789.432-3, domiciliado en Av. Providencia 2456, Oficina 301, comuna de Providencia, Santiago...",
      causaId: causa1.id,
      clienteId: cliente1.id,
      autorId: abogado.id,
    },
    {
      nombre: "Contrato de Prestación de Servicios - Constructora Los Andes",
      tipo: "contrato",
      contenido: "CONTRATO DE PRESTACIÓN DE SERVICIOS JURÍDICOS\n\nEn Santiago de Chile, a 15 de junio de 2024, entre Constructora Los Andes SpA, RUT 76.543.210-8, representada por don Andrés Felipe Muñoz Tapia, en adelante 'el Cliente', y el Estudio Jurídico LexaChile, representado por doña María Fernanda Soto Errázuriz...",
      clienteId: cliente2.id,
      autorId: abogado.id,
    },
    {
      nombre: "Demanda Laboral por Despido Injustificado - Reyes Muñoz",
      tipo: "escrito_judicial",
      contenido: "EN LO PRINCIPAL: Demanda por despido injustificado y cobro de prestaciones. PRIMER OTROSÍ: Acompaña documentos. SEGUNDO OTROSÍ: Patrocinio y poder.\n\nSR. JUEZ DE LETRAS DEL TRABAJO\n\nCatalina Andrea Reyes Muñoz, cédula de identidad N° 17.654.321-9, operaria, domiciliada en Pasaje Los Olmos 123, comuna de Ñuñoa...",
      causaId: causa3.id,
      clienteId: cliente3.id,
      autorId: admin.id,
    },
    {
      nombre: "Querella por Lesiones - Espinoza Díaz (defensa)",
      tipo: "escrito_judicial",
      contenido: "EN LO PRINCIPAL: Contesta requerimiento y solicita absolución. PRIMER OTROSÍ: Ofrece prueba.\n\nSR. JUEZ DE GARANTÍA (7°) DE SANTIAGO\n\nRoberto Carlos Espinoza Díaz, RUT 14.567.890-6, domiciliado en Calle San Diego 1234, Depto 56, Santiago Centro...",
      causaId: causa5.id,
      clienteId: cliente5.id,
      autorId: admin.id,
    },
    {
      nombre: "Contrato de Honorarios - Sociedad Agrícola El Roble",
      tipo: "contrato",
      contenido: "CONTRATO DE PRESTACIÓN DE SERVICIOS PROFESIONALES\n\nEn Santiago de Chile, a 1 de marzo de 2025, entre Sociedad Agrícola El Roble Ltda., RUT 77.890.123-4, representada por don Francisco Javier Ortiz Bravo, y el Estudio Jurídico LexaChile...\n\nCLÁUSULA PRIMERA: OBJETO DEL CONTRATO\nEl abogado se obliga a representar judicialmente al cliente en causa de indemnización de perjuicios contra el Fisco de Chile...",
      clienteId: cliente4.id,
      autorId: abogado.id,
    },
  ];

  for (const doc of documentos) {
    await prisma.documento.create({ data: doc });
  }

  console.log("📄 Documentos creados: 5");

  // ==================== LEYES ====================
  const leyes = [
    {
      numero: "Ley 20.744",
      titulo: "Código del Trabajo - Texto refundido, coordinado y sistematizado",
      fechaPublicacion: new Date("2002-01-16"),
      estado: "vigente",
      url: "https://www.bcn.cl/leychile/navegar?idNorma=207436",
      tipo: "codigo",
      contenido: "El Código del Trabajo regula las relaciones laborales entre empleadores y trabajadores en Chile. Contiene normas sobre el contrato individual de trabajo, la protección de los trabajadores, las organizaciones sindicales, la negociación colectiva y la jurisdicción laboral.",
    },
    {
      numero: "DFL 1",
      titulo: "Código Civil de la República de Chile",
      fechaPublicacion: new Date("2000-05-30"),
      estado: "vigente",
      url: "https://www.bcn.cl/leychile/navegar?idNorma=172986",
      tipo: "codigo",
      contenido: "El Código Civil de Chile, originalmente promulgado en 1855 y redactado por Andrés Bello, regula las relaciones entre particulares. Comprende las materias de personas, bienes, sucesiones, obligaciones y contratos.",
    },
    {
      numero: "Ley 19.968",
      titulo: "Ley que Crea los Tribunales de Familia",
      fechaPublicacion: new Date("2004-08-30"),
      estado: "vigente",
      url: "https://www.bcn.cl/leychile/navegar?idNorma=229557",
      tipo: "ley",
      contenido: "Establece los Tribunales de Familia con competencia en materias de derecho de familia, incluyendo alimentos, cuidado personal, relación directa y regular, violencia intrafamiliar, adopción y otras materias relacionadas.",
    },
  ];

  for (const ley of leyes) {
    await prisma.ley.create({ data: ley });
  }

  console.log("📚 Leyes creadas: 3");

  console.log("\n✅ Seed completado exitosamente!");
  console.log("   Usuarios: 3 (admin, abogado, asistente)");
  console.log("   Clientes: 5");
  console.log("   Causas: 8");
  console.log("   Movimientos: 15");
  console.log("   Eventos: 10");
  console.log("   Documentos: 5");
  console.log("   Leyes: 3");
  console.log("\n📧 Credenciales de acceso:");
  console.log("   admin@lexachile.cl / 123456 (admin)");
  console.log("   maria.soto@lexachile.cl / 123456 (abogado)");
  console.log("   rodrigo.valenzuela@lexachile.cl / 123456 (asistente)");
}

main()
  .catch((e) => {
    console.error("❌ Error en seed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
