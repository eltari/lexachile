export interface AnalysisResult {
  resumen: string;
  tipoDocumento: string;
  partesIdentificadas: string[];
  fechasRelevantes: string[];
  plazosLegales: string[];
  recomendaciones: string[];
  riesgo: "bajo" | "medio" | "alto";
  articulosRelevantes: string[];
}

export async function analyzeDocument(
  texto: string,
  tipo?: string
): Promise<AnalysisResult> {
  // Simulacion de analisis IA - en produccion conectar con OpenAI/Claude
  await new Promise((resolve) => setTimeout(resolve, 800));

  const tipoDetectado = tipo || detectarTipoDocumento(texto);

  const analisisMap: Record<string, AnalysisResult> = {
    demanda: {
      resumen:
        "Se trata de una demanda civil ordinaria de cobro de pesos, donde el demandante solicita el pago de una obligacion contractual incumplida. El monto demandado asciende a $15.000.000 CLP mas intereses y costas.",
      tipoDocumento: "Demanda Civil Ordinaria",
      partesIdentificadas: [
        "Demandante: Juan Carlos Gonzalez Perez (RUT: 12.345.678-9)",
        "Demandado: Maria Isabel Munoz Torres (RUT: 9.876.543-2)",
      ],
      fechasRelevantes: [
        "Fecha del contrato: 15 de enero de 2025",
        "Fecha de vencimiento de la obligacion: 30 de junio de 2025",
        "Plazo para contestar: 15 dias habiles desde notificacion",
      ],
      plazosLegales: [
        "Plazo de prescripcion: 5 anos (art. 2515 CC)",
        "Contestacion de demanda: 15 dias habiles",
        "Periodo de prueba: 20 dias habiles",
      ],
      recomendaciones: [
        "Verificar que la notificacion se realice de forma personal conforme al art. 40 CPC",
        "Preparar medios de prueba documental que acrediten la existencia de la obligacion",
        "Considerar solicitar medida precautoria de retencion de bienes",
        "Revisar si existe clausula de arbitraje en el contrato original",
      ],
      riesgo: "medio",
      articulosRelevantes: [
        "Art. 253 CPC - Requisitos de la demanda",
        "Art. 1545 CC - Ley del contrato",
        "Art. 1698 CC - Prueba de las obligaciones",
        "Art. 2515 CC - Prescripcion ordinaria",
      ],
    },
    contrato: {
      resumen:
        "Contrato de arrendamiento de inmueble para uso habitacional. Plazo de 12 meses con renovacion automatica. Canon mensual de $450.000 CLP. Incluye clausulas estandar de terminacion anticipada y garantia.",
      tipoDocumento: "Contrato de Arrendamiento",
      partesIdentificadas: [
        "Arrendador: Propietario del inmueble",
        "Arrendatario: Persona natural",
      ],
      fechasRelevantes: [
        "Inicio del contrato: fecha de firma",
        "Vencimiento: 12 meses desde inicio",
        "Pago de renta: primeros 5 dias de cada mes",
      ],
      plazosLegales: [
        "Desahucio: 2 meses de anticipacion (Ley 18.101)",
        "Restitucion del inmueble: plazo judicial",
        "Prescripcion acciones: 5 anos",
      ],
      recomendaciones: [
        "Agregar clausula de reajuste segun IPC",
        "Especificar detalladamente el estado del inmueble al momento de entrega",
        "Incluir inventario de bienes si el inmueble esta amoblado",
        "Verificar inscripcion del contrato en SII para efectos tributarios",
      ],
      riesgo: "bajo",
      articulosRelevantes: [
        "Ley 18.101 - Arrendamiento de predios urbanos",
        "Art. 1915 CC - Definicion de arrendamiento",
        "Art. 1938 CC - Obligaciones del arrendatario",
        "Art. 1977 CC - Pago de la renta",
      ],
    },
    sentencia: {
      resumen:
        "Sentencia definitiva de primera instancia que acoge parcialmente la demanda. Se condena al demandado al pago de $8.500.000 CLP mas reajustes e intereses corrientes. Se rechaza la indemnizacion por dano moral. Costas de la causa.",
      tipoDocumento: "Sentencia Definitiva",
      partesIdentificadas: [
        "Tribunal: 1er Juzgado Civil de Santiago",
        "Demandante: Parte que obtuvo parcialmente",
        "Demandado: Parte condenada al pago",
      ],
      fechasRelevantes: [
        "Fecha de la sentencia: reciente",
        "Plazo para apelar: 10 dias desde notificacion",
        "Plazo para recurso de casacion: 15 dias",
      ],
      plazosLegales: [
        "Recurso de apelacion: 10 dias (art. 189 CPC)",
        "Recurso de casacion en la forma: 10 dias (art. 770 CPC)",
        "Cumplimiento incidental: 1 ano (art. 231 CPC)",
      ],
      recomendaciones: [
        "Evaluar conveniencia de recurso de apelacion por el monto rechazado",
        "Considerar cumplimiento incidental si la sentencia queda firme",
        "Revisar posibles vicios de casacion en la forma",
        "Preparar liquidacion del credito para etapa de cumplimiento",
      ],
      riesgo: "medio",
      articulosRelevantes: [
        "Art. 170 CPC - Requisitos de la sentencia definitiva",
        "Art. 186 CPC - Recurso de apelacion",
        "Art. 231 CPC - Cumplimiento de resoluciones",
        "Art. 768 CPC - Causales de casacion en la forma",
      ],
    },
  };

  return (
    analisisMap[tipoDetectado] ||
    analisisMap["demanda"]
  );
}

function detectarTipoDocumento(texto: string): string {
  const lower = texto.toLowerCase();
  if (lower.includes("demanda") || lower.includes("demandante"))
    return "demanda";
  if (lower.includes("contrato") || lower.includes("arrendamiento"))
    return "contrato";
  if (
    lower.includes("sentencia") ||
    lower.includes("vistos") ||
    lower.includes("considerando")
  )
    return "sentencia";
  return "demanda";
}
