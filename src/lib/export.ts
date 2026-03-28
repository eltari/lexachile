/* eslint-disable @typescript-eslint/no-explicit-any */
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";

// ─── Helpers ────────────────────────────────────────────────────────────────

function fechaActual(): string {
  return new Date().toLocaleDateString("es-CL", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function addHeader(doc: jsPDF, titulo: string) {
  // Barra superior
  doc.setFillColor(37, 99, 235); // blue-600
  doc.rect(0, 0, doc.internal.pageSize.getWidth(), 28, "F");

  // Nombre del sistema
  doc.setFont("helvetica", "bold");
  doc.setFontSize(18);
  doc.setTextColor(255, 255, 255);
  doc.text("LexaChile", 14, 12);

  // Subtitulo
  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(191, 219, 254); // blue-200
  doc.text("Sistema de Gestion Juridica", 14, 19);

  // Fecha en la esquina derecha
  doc.setFontSize(8);
  doc.setTextColor(191, 219, 254);
  doc.text(fechaActual(), doc.internal.pageSize.getWidth() - 14, 12, {
    align: "right",
  });

  // Titulo del documento
  doc.setFont("helvetica", "bold");
  doc.setFontSize(14);
  doc.setTextColor(31, 41, 55); // gray-800
  doc.text(titulo, 14, 40);

  // Linea decorativa
  doc.setDrawColor(37, 99, 235);
  doc.setLineWidth(0.5);
  doc.line(14, 43, doc.internal.pageSize.getWidth() - 14, 43);
}

function addFooter(doc: jsPDF) {
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    const pageH = doc.internal.pageSize.getHeight();
    const pageW = doc.internal.pageSize.getWidth();

    doc.setDrawColor(209, 213, 219);
    doc.setLineWidth(0.3);
    doc.line(14, pageH - 15, pageW - 14, pageH - 15);

    doc.setFontSize(7);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(156, 163, 175);
    doc.text(
      `LexaChile - Generado el ${fechaActual()}`,
      14,
      pageH - 9
    );
    doc.text(`Pagina ${i} de ${pageCount}`, pageW - 14, pageH - 9, {
      align: "right",
    });
  }
}

// ─── PDF Generico ───────────────────────────────────────────────────────────

export function exportToPDF(
  title: string,
  headers: string[],
  rows: string[][],
  filename: string
) {
  const doc = new jsPDF();
  addHeader(doc, title);

  autoTable(doc, {
    head: [headers],
    body: rows,
    startY: 50,
    theme: "grid",
    styles: {
      fontSize: 9,
      cellPadding: 4,
      textColor: [31, 41, 55],
      lineColor: [229, 231, 235],
      lineWidth: 0.3,
    },
    headStyles: {
      fillColor: [37, 99, 235],
      textColor: [255, 255, 255],
      fontStyle: "bold",
      fontSize: 9,
    },
    alternateRowStyles: {
      fillColor: [248, 250, 252],
    },
    margin: { top: 50, left: 14, right: 14 },
  });

  addFooter(doc);
  doc.save(filename.endsWith(".pdf") ? filename : `${filename}.pdf`);
}

// ─── Causas PDF ─────────────────────────────────────────────────────────────

export function exportCausasPDF(causas: any[]) {
  const headers = ["ROL", "Caratulado", "Materia", "Estado", "Tribunal", "Cliente"];
  const rows = causas.map((c) => [
    c.rol || "",
    c.caratulado || "",
    c.materia || "",
    c.estado || "",
    c.tribunal || "",
    c.cliente?.nombre || "Sin cliente",
  ]);

  exportToPDF(
    `Listado de Causas (${causas.length})`,
    headers,
    rows,
    `causas_lexachile_${new Date().toISOString().slice(0, 10)}.pdf`
  );
}

// ─── Reporte PDF ────────────────────────────────────────────────────────────

export function exportReportePDF(data: {
  resumen: { label: string; valor: string; subValor: string; trend: string }[];
  causasPorMateria: { label: string; valor: number }[];
  estadoCausas: { label: string; valor: number }[];
  abogados: {
    nombre: string;
    activas: number;
    ganadas: number;
    perdidas: number;
    tasaExito: number;
  }[];
  causasPorMes: { label: string; valor: number }[];
}) {
  const doc = new jsPDF();
  addHeader(doc, "Reporte General del Estudio");

  let yPos = 50;

  // -- Resumen
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.setTextColor(31, 41, 55);
  doc.text("Resumen General", 14, yPos);
  yPos += 3;

  autoTable(doc, {
    head: [["Indicador", "Valor", "Detalle", "Tendencia"]],
    body: data.resumen.map((r) => [r.label, r.valor, r.subValor, r.trend]),
    startY: yPos,
    theme: "grid",
    styles: { fontSize: 9, cellPadding: 4, textColor: [31, 41, 55], lineColor: [229, 231, 235], lineWidth: 0.3 },
    headStyles: { fillColor: [37, 99, 235], textColor: [255, 255, 255], fontStyle: "bold" },
    margin: { left: 14, right: 14 },
  });

  yPos = (doc as any).lastAutoTable.finalY + 10;

  // -- Causas por materia
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.text("Causas por Materia", 14, yPos);
  yPos += 3;

  autoTable(doc, {
    head: [["Materia", "Cantidad"]],
    body: data.causasPorMateria.map((m) => [m.label, String(m.valor)]),
    startY: yPos,
    theme: "grid",
    styles: { fontSize: 9, cellPadding: 4, textColor: [31, 41, 55], lineColor: [229, 231, 235], lineWidth: 0.3 },
    headStyles: { fillColor: [16, 185, 129], textColor: [255, 255, 255], fontStyle: "bold" },
    margin: { left: 14, right: 14 },
  });

  yPos = (doc as any).lastAutoTable.finalY + 10;

  // -- Estado de causas
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.text("Estado de Causas", 14, yPos);
  yPos += 3;

  autoTable(doc, {
    head: [["Estado", "Porcentaje"]],
    body: data.estadoCausas.map((e) => [e.label, `${e.valor}%`]),
    startY: yPos,
    theme: "grid",
    styles: { fontSize: 9, cellPadding: 4, textColor: [31, 41, 55], lineColor: [229, 231, 235], lineWidth: 0.3 },
    headStyles: { fillColor: [245, 158, 11], textColor: [255, 255, 255], fontStyle: "bold" },
    margin: { left: 14, right: 14 },
  });

  yPos = (doc as any).lastAutoTable.finalY + 10;

  // -- Causas por mes
  if (yPos > 220) {
    doc.addPage();
    yPos = 20;
  }

  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.text("Causas por Mes", 14, yPos);
  yPos += 3;

  autoTable(doc, {
    head: [["Mes", "Cantidad"]],
    body: data.causasPorMes.map((m) => [m.label, String(m.valor)]),
    startY: yPos,
    theme: "grid",
    styles: { fontSize: 9, cellPadding: 4, textColor: [31, 41, 55], lineColor: [229, 231, 235], lineWidth: 0.3 },
    headStyles: { fillColor: [139, 92, 246], textColor: [255, 255, 255], fontStyle: "bold" },
    margin: { left: 14, right: 14 },
  });

  yPos = (doc as any).lastAutoTable.finalY + 10;

  // -- Rendimiento por abogado
  if (yPos > 200) {
    doc.addPage();
    yPos = 20;
  }

  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.text("Rendimiento por Abogado", 14, yPos);
  yPos += 3;

  autoTable(doc, {
    head: [["Abogado", "Activas", "Ganadas", "Perdidas", "Tasa Exito"]],
    body: data.abogados.map((a) => [
      a.nombre,
      String(a.activas),
      String(a.ganadas),
      String(a.perdidas),
      `${a.tasaExito}%`,
    ]),
    startY: yPos,
    theme: "grid",
    styles: { fontSize: 9, cellPadding: 4, textColor: [31, 41, 55], lineColor: [229, 231, 235], lineWidth: 0.3 },
    headStyles: { fillColor: [37, 99, 235], textColor: [255, 255, 255], fontStyle: "bold" },
    margin: { left: 14, right: 14 },
  });

  addFooter(doc);
  doc.save(`reporte_lexachile_${new Date().toISOString().slice(0, 10)}.pdf`);
}

// ─── Documento PDF ──────────────────────────────────────────────────────────

export function exportDocumentoPDF(titulo: string, contenido: string) {
  const doc = new jsPDF();
  addHeader(doc, titulo || "Documento sin titulo");

  const pageW = doc.internal.pageSize.getWidth();
  const marginX = 14;
  const maxWidth = pageW - marginX * 2;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.setTextColor(55, 65, 81);

  // Procesar lineas de contenido respetando saltos
  const lines = doc.splitTextToSize(contenido || "(Sin contenido)", maxWidth);
  let yPos = 52;
  const pageH = doc.internal.pageSize.getHeight();

  for (let i = 0; i < lines.length; i++) {
    if (yPos > pageH - 25) {
      doc.addPage();
      yPos = 20;
    }
    doc.text(lines[i], marginX, yPos);
    yPos += 5;
  }

  addFooter(doc);
  doc.save(
    `${(titulo || "documento").replace(/\s+/g, "_").toLowerCase()}_${new Date().toISOString().slice(0, 10)}.pdf`
  );
}

// ─── Excel Generico ─────────────────────────────────────────────────────────

export function exportToExcel(
  sheetName: string,
  headers: string[],
  rows: any[][],
  filename: string
) {
  const wb = XLSX.utils.book_new();
  const data = [headers, ...rows];
  const ws = XLSX.utils.aoa_to_sheet(data);

  // Anchos de columna automaticos
  ws["!cols"] = headers.map((h, i) => {
    const maxLen = Math.max(
      h.length,
      ...rows.map((r) => String(r[i] || "").length)
    );
    return { wch: Math.min(maxLen + 4, 40) };
  });

  XLSX.utils.book_append_sheet(wb, ws, sheetName);
  XLSX.writeFile(
    wb,
    filename.endsWith(".xlsx") ? filename : `${filename}.xlsx`
  );
}

// ─── Causas Excel ───────────────────────────────────────────────────────────

export function exportCausasExcel(causas: any[]) {
  const headers = [
    "ROL",
    "Caratulado",
    "Materia",
    "Estado",
    "Tribunal",
    "Cliente",
    "RUT Cliente",
    "Fecha Creacion",
  ];
  const rows = causas.map((c) => [
    c.rol || "",
    c.caratulado || "",
    c.materia || "",
    c.estado || "",
    c.tribunal || "",
    c.cliente?.nombre || "Sin cliente",
    c.cliente?.rut || "",
    c.createdAt ? new Date(c.createdAt).toLocaleDateString("es-CL") : "",
  ]);

  exportToExcel(
    "Causas",
    headers,
    rows,
    `causas_lexachile_${new Date().toISOString().slice(0, 10)}.xlsx`
  );
}

// ─── Clientes Excel ─────────────────────────────────────────────────────────

export function exportClientesExcel(clientes: any[]) {
  const headers = [
    "Nombre",
    "RUT",
    "Tipo",
    "Email",
    "Telefono",
    "Ciudad",
    "N° Causas",
  ];
  const rows = clientes.map((c) => [
    c.nombre || "",
    c.rut || "",
    c.tipo === "juridica" ? "Persona Juridica" : "Persona Natural",
    c.email || "",
    c.telefono || "",
    c.ciudad || "",
    c._count?.causas ?? 0,
  ]);

  exportToExcel(
    "Clientes",
    headers,
    rows,
    `clientes_lexachile_${new Date().toISOString().slice(0, 10)}.xlsx`
  );
}

// ─── Reporte Excel ──────────────────────────────────────────────────────────

export function exportReporteExcel(data: {
  resumen: { label: string; valor: string; subValor: string; trend: string }[];
  causasPorMateria: { label: string; valor: number }[];
  estadoCausas: { label: string; valor: number }[];
  abogados: {
    nombre: string;
    activas: number;
    ganadas: number;
    perdidas: number;
    tasaExito: number;
  }[];
  causasPorMes: { label: string; valor: number }[];
}) {
  const wb = XLSX.utils.book_new();

  // Hoja 1: Resumen
  const wsResumen = XLSX.utils.aoa_to_sheet([
    ["Indicador", "Valor", "Detalle", "Tendencia"],
    ...data.resumen.map((r) => [r.label, r.valor, r.subValor, r.trend]),
  ]);
  wsResumen["!cols"] = [{ wch: 20 }, { wch: 18 }, { wch: 30 }, { wch: 12 }];
  XLSX.utils.book_append_sheet(wb, wsResumen, "Resumen");

  // Hoja 2: Causas por Materia
  const wsMateria = XLSX.utils.aoa_to_sheet([
    ["Materia", "Cantidad"],
    ...data.causasPorMateria.map((m) => [m.label, m.valor]),
  ]);
  wsMateria["!cols"] = [{ wch: 20 }, { wch: 12 }];
  XLSX.utils.book_append_sheet(wb, wsMateria, "Por Materia");

  // Hoja 3: Estado
  const wsEstado = XLSX.utils.aoa_to_sheet([
    ["Estado", "Porcentaje"],
    ...data.estadoCausas.map((e) => [e.label, `${e.valor}%`]),
  ]);
  wsEstado["!cols"] = [{ wch: 20 }, { wch: 12 }];
  XLSX.utils.book_append_sheet(wb, wsEstado, "Estados");

  // Hoja 4: Causas por Mes
  const wsMes = XLSX.utils.aoa_to_sheet([
    ["Mes", "Cantidad"],
    ...data.causasPorMes.map((m) => [m.label, m.valor]),
  ]);
  wsMes["!cols"] = [{ wch: 12 }, { wch: 12 }];
  XLSX.utils.book_append_sheet(wb, wsMes, "Por Mes");

  // Hoja 5: Abogados
  const wsAbogados = XLSX.utils.aoa_to_sheet([
    ["Abogado", "Causas Activas", "Ganadas", "Perdidas", "Tasa Exito (%)"],
    ...data.abogados.map((a) => [
      a.nombre,
      a.activas,
      a.ganadas,
      a.perdidas,
      a.tasaExito,
    ]),
  ]);
  wsAbogados["!cols"] = [
    { wch: 25 },
    { wch: 15 },
    { wch: 10 },
    { wch: 10 },
    { wch: 15 },
  ];
  XLSX.utils.book_append_sheet(wb, wsAbogados, "Abogados");

  XLSX.writeFile(
    wb,
    `reporte_lexachile_${new Date().toISOString().slice(0, 10)}.xlsx`
  );
}
