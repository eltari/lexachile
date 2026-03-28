import { NextResponse } from "next/server";

/**
 * POST /api/export/pdf
 *
 * Nota: La generacion de PDF se realiza del lado del cliente usando jsPDF.
 * Este endpoint existe como referencia y podria usarse para generar PDFs
 * del lado del servidor si fuera necesario en el futuro.
 */
export async function POST() {
  return NextResponse.json(
    {
      message:
        "La generacion de PDF se realiza del lado del cliente. " +
        "Use las funciones exportToPDF, exportCausasPDF, exportReportePDF o exportDocumentoPDF " +
        "desde @/lib/export en componentes del cliente.",
      docs: {
        exportToPDF: "Exportacion generica de tabla a PDF",
        exportCausasPDF: "Exportar listado de causas a PDF",
        exportReportePDF: "Exportar reporte completo a PDF",
        exportDocumentoPDF: "Exportar documento legal a PDF",
        exportToExcel: "Exportacion generica de tabla a Excel",
        exportCausasExcel: "Exportar listado de causas a Excel",
        exportClientesExcel: "Exportar listado de clientes a Excel",
        exportReporteExcel: "Exportar reporte completo a Excel",
      },
    },
    { status: 200 }
  );
}
