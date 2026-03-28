export interface GenerateOptions {
  tipo: string;
  campos: Record<string, string>;
}

export interface GenerateResult {
  contenido: string;
  tipo: string;
  titulo: string;
}

const plantillas: Record<string, { titulo: string; contenido: string }> = {
  demanda_civil: {
    titulo: "Demanda Civil Ordinaria",
    contenido: `EN LO PRINCIPAL: Demanda en juicio ordinario de cobro de pesos.
PRIMER OTROSI: Acompana documentos.
SEGUNDO OTROSI: Patrocinio y poder.

S.J.L. EN LO CIVIL

{{nombre_cliente}}, {{nacionalidad}}, {{profesion}}, cedula de identidad N. {{rut_cliente}}, domiciliado en {{domicilio_cliente}}, comuna de {{comuna_cliente}}, a US. respetuosamente digo:

Que vengo en interponer demanda en juicio ordinario de cobro de pesos en contra de {{nombre_demandado}}, {{profesion_demandado}}, cedula de identidad N. {{rut_demandado}}, domiciliado en {{domicilio_demandado}}, comuna de {{comuna_demandado}}, en virtud de los siguientes antecedentes de hecho y de derecho:

I. LOS HECHOS

{{hechos}}

II. EL DERECHO

Las normas juridicas aplicables al presente caso son las siguientes:

- Articulo 1545 del Codigo Civil, que establece que todo contrato legalmente celebrado es una ley para los contratantes.
- Articulo 1546 del Codigo Civil, que senala que los contratos deben ejecutarse de buena fe.
- Articulo 1489 del Codigo Civil, en cuanto a la condicion resolutoria tacita.
- Articulo 1698 del Codigo Civil, respecto de la prueba de las obligaciones.

III. PETITORIO

POR TANTO, en merito de lo expuesto y lo dispuesto en los articulos citados y demas normas legales aplicables,

RUEGO A US.: Se sirva tener por interpuesta demanda en juicio ordinario de cobro de pesos en contra de {{nombre_demandado}}, ya individualizado, y en definitiva acogerla en todas sus partes, declarando:

1. Que el demandado debe pagar la suma de {{monto}} pesos, mas reajustes e intereses corrientes desde la fecha de la mora.
2. Que el demandado debe pagar las costas de la causa.

PRIMER OTROSI: Solicito a US. tener por acompanados los siguientes documentos:
1. Contrato de fecha {{fecha_contrato}}.
2. Documentos que acreditan el incumplimiento.

SEGUNDO OTROSI: Solicito a US. tener presente que confiero patrocinio y poder al abogado habilitado para el ejercicio de la profesion don/dona {{nombre_abogado}}, RUT {{rut_abogado}}, con domicilio en {{domicilio_abogado}}.`,
  },

  contestacion_demanda: {
    titulo: "Contestacion de Demanda",
    contenido: `EN LO PRINCIPAL: Contesta demanda.
PRIMER OTROSI: Opone excepciones.
SEGUNDO OTROSI: Patrocinio y poder.

S.J.L. EN LO CIVIL

{{nombre_cliente}}, cedula de identidad N. {{rut_cliente}}, domiciliado en {{domicilio_cliente}}, en autos sobre juicio ordinario de cobro de pesos, causa ROL N. {{rol_causa}}, caratulados "{{caratulado}}", a US. respetuosamente digo:

Que dentro del plazo legal, vengo en contestar la demanda interpuesta en mi contra, solicitando su integro rechazo, con costas, en virtud de los siguientes fundamentos:

I. NEGACION DE LOS HECHOS

Niego cada uno de los hechos expuestos en la demanda de autos, salvo aquellos que expresamente reconozca en este escrito.

{{argumentos_defensa}}

II. EL DERECHO

{{fundamentos_derecho}}

III. PETITORIO

POR TANTO, ruego a US. tener por contestada la demanda y rechazarla en todas sus partes, con expresa condena en costas.`,
  },

  recurso_apelacion: {
    titulo: "Recurso de Apelacion",
    contenido: `EN LO PRINCIPAL: Recurso de apelacion.
OTROSI: Se tenga presente.

S.J.L. EN LO CIVIL

{{nombre_cliente}}, en autos ROL N. {{rol_causa}}, caratulados "{{caratulado}}", a US. respetuosamente digo:

Que encontrandome dentro de plazo, vengo en interponer recurso de apelacion en contra de la resolucion de fecha {{fecha_resolucion}}, que {{descripcion_resolucion}}, por cuanto dicha resolucion me causa agravio en los terminos que paso a exponer:

I. AGRAVIOS

{{agravios}}

II. PETICIONES CONCRETAS

Solicito a la Iltma. Corte de Apelaciones que, conociendo del presente recurso, revoque la resolucion apelada y en su lugar declare:

{{peticiones}}

POR TANTO, ruego a US. conceder el presente recurso de apelacion en ambos efectos y elevar los autos al tribunal superior.`,
  },

  contrato_arrendamiento: {
    titulo: "Contrato de Arrendamiento",
    contenido: `CONTRATO DE ARRENDAMIENTO

En {{ciudad}}, a {{fecha}}, entre:

ARRENDADOR: {{nombre_arrendador}}, RUT {{rut_arrendador}}, domiciliado en {{domicilio_arrendador}}, en adelante "el Arrendador"; y

ARRENDATARIO: {{nombre_arrendatario}}, RUT {{rut_arrendatario}}, domiciliado en {{domicilio_arrendatario}}, en adelante "el Arrendatario";

Se ha convenido el siguiente contrato de arrendamiento:

PRIMERO: El Arrendador da en arrendamiento al Arrendatario el inmueble ubicado en {{direccion_inmueble}}, comuna de {{comuna_inmueble}}, que se destinara exclusivamente a uso {{uso_inmueble}}.

SEGUNDO: El presente contrato tendra una duracion de {{duracion}} meses, contados desde el {{fecha_inicio}}, renovable automaticamente por periodos iguales y sucesivos, salvo que alguna de las partes manifieste su voluntad de no renovarlo con al menos dos meses de anticipacion.

TERCERO: La renta mensual de arrendamiento sera de \${{monto_renta}} ({{monto_renta_palabras}}), pagadera dentro de los primeros cinco dias de cada mes.

CUARTO: El Arrendatario entrega en este acto la suma de \${{monto_garantia}} a titulo de garantia.

QUINTO: El Arrendatario se obliga a restituir el inmueble en el mismo estado en que lo recibe, salvo el deterioro ocasionado por el uso y goce legitimos.

SEXTO: Queda prohibido al Arrendatario subarrendar o ceder el presente contrato sin autorizacion escrita del Arrendador.

SEPTIMO: El incumplimiento de cualquiera de las obligaciones del presente contrato dara derecho a la parte cumplidora para solicitar la terminacion del mismo.

OCTAVO: Para todos los efectos legales derivados del presente contrato, las partes fijan su domicilio en la ciudad de {{ciudad}} y se someten a la jurisdiccion de sus tribunales ordinarios de justicia.

Se firman dos ejemplares de igual tenor y fecha, quedando uno en poder de cada parte.


________________________          ________________________
ARRENDADOR                        ARRENDATARIO
{{nombre_arrendador}}             {{nombre_arrendatario}}
RUT: {{rut_arrendador}}           RUT: {{rut_arrendatario}}`,
  },

  poder_simple: {
    titulo: "Poder Simple",
    contenido: `PODER

En {{ciudad}}, a {{fecha}}, yo {{nombre_poderdante}}, cedula de identidad N. {{rut_poderdante}}, domiciliado en {{domicilio_poderdante}}, por el presente instrumento confiero poder especial a don/dona {{nombre_apoderado}}, cedula de identidad N. {{rut_apoderado}}, domiciliado en {{domicilio_apoderado}}, para que en mi nombre y representacion pueda:

{{facultades}}

El presente poder tendra vigencia desde la fecha de su otorgamiento hasta {{vigencia}}.

Se otorga el presente poder en senal de conformidad.


________________________
{{nombre_poderdante}}
RUT: {{rut_poderdante}}`,
  },

  recurso_proteccion: {
    titulo: "Recurso de Proteccion",
    contenido: `EN LO PRINCIPAL: Recurso de proteccion.
PRIMER OTROSI: Orden de no innovar.
SEGUNDO OTROSI: Patrocinio y poder.

ILTMA. CORTE DE APELACIONES DE {{ciudad_corte}}

{{nombre_cliente}}, RUT {{rut_cliente}}, domiciliado en {{domicilio_cliente}}, a USIA respetuosamente digo:

Que en virtud de lo dispuesto en el articulo 20 de la Constitucion Politica de la Republica y el Auto Acordado de la Excma. Corte Suprema sobre tramitacion del recurso de proteccion, vengo en interponer recurso de proteccion en contra de {{nombre_recurrido}}, RUT {{rut_recurrido}}, domiciliado en {{domicilio_recurrido}}, por la vulneracion de las siguientes garantias constitucionales:

I. HECHOS

{{hechos}}

II. GARANTIAS VULNERADAS

{{garantias_vulneradas}}

III. PETITORIO

POR TANTO, ruego a USIA acoger el presente recurso de proteccion y adoptar de inmediato las providencias que juzgue necesarias para restablecer el imperio del derecho y asegurar la debida proteccion del afectado.

PRIMER OTROSI: Atendida la urgencia del caso, solicito a USIA decretar orden de no innovar, ordenando a la recurrida abstenerse de {{medida_no_innovar}}.`,
  },

  contrato_trabajo: {
    titulo: "Contrato de Trabajo",
    contenido: `CONTRATO INDIVIDUAL DE TRABAJO

En {{ciudad}}, a {{fecha}}, entre:

EMPLEADOR: {{nombre_empleador}}, RUT {{rut_empleador}}, representado legalmente por {{representante_legal}}, domiciliado en {{domicilio_empleador}}, en adelante "el Empleador"; y

TRABAJADOR: {{nombre_trabajador}}, RUT {{rut_trabajador}}, nacido el {{fecha_nacimiento}}, de nacionalidad {{nacionalidad}}, estado civil {{estado_civil}}, domiciliado en {{domicilio_trabajador}}, en adelante "el Trabajador";

Se ha convenido el siguiente contrato individual de trabajo:

PRIMERO: NATURALEZA DE LOS SERVICIOS. El Trabajador se compromete a desempenar las funciones de {{cargo}} y las demas labores que le encomiende el Empleador.

SEGUNDO: LUGAR DE TRABAJO. El Trabajador prestara sus servicios en {{lugar_trabajo}}.

TERCERO: JORNADA DE TRABAJO. La jornada ordinaria de trabajo sera de {{horas_semanales}} horas semanales, distribuidas de {{dia_inicio}} a {{dia_fin}}, de {{hora_inicio}} a {{hora_fin}} horas, con {{minutos_colacion}} minutos de colacion.

CUARTO: REMUNERACION. El Empleador se obliga a pagar al Trabajador una remuneracion mensual bruta de \${{remuneracion}} ({{remuneracion_palabras}}), que sera pagada por periodos vencidos el ultimo dia habil de cada mes.

QUINTO: DURACION. El presente contrato tendra una duracion {{tipo_duracion}}.

SEXTO: Se deja constancia que el Trabajador ingreso al servicio del Empleador con fecha {{fecha_ingreso}}.

SEPTIMO: Forman parte integrante de este contrato el Reglamento Interno de Orden, Higiene y Seguridad de la empresa.

El presente contrato se firma en dos ejemplares, quedando uno en poder de cada parte.


________________________          ________________________
EMPLEADOR                         TRABAJADOR
{{nombre_empleador}}              {{nombre_trabajador}}
RUT: {{rut_empleador}}            RUT: {{rut_trabajador}}`,
  },

  compraventa: {
    titulo: "Escritura de Compraventa",
    contenido: `ESCRITURA PUBLICA DE COMPRAVENTA

En {{ciudad}}, a {{fecha}}, ante mi {{nombre_notario}}, Notario Publico de {{ciudad_notaria}}, comparecen:

VENDEDOR: {{nombre_vendedor}}, RUT {{rut_vendedor}}, domiciliado en {{domicilio_vendedor}};

COMPRADOR: {{nombre_comprador}}, RUT {{rut_comprador}}, domiciliado en {{domicilio_comprador}};

Exponen:

PRIMERO: Que el Vendedor es dueno del inmueble ubicado en {{direccion_inmueble}}, comuna de {{comuna_inmueble}}, inscrito a fojas {{fojas}} N. {{numero_inscripcion}} del Registro de Propiedad del Conservador de Bienes Raices de {{cbr}}, del ano {{anno_inscripcion}}.

SEGUNDO: Que por el presente instrumento, el Vendedor vende, cede y transfiere al Comprador el inmueble antes individualizado.

TERCERO: El precio de la compraventa es la suma de \${{precio}} ({{precio_palabras}}), que el Comprador paga al Vendedor de la siguiente forma: {{forma_pago}}.

CUARTO: El Vendedor declara que el inmueble se encuentra libre de todo gravamen, prohibicion, embargo y litigio pendiente.

QUINTO: La entrega material del inmueble se efectuara el {{fecha_entrega}}.

En comprobante firman las partes.


________________________          ________________________
VENDEDOR                          COMPRADOR
{{nombre_vendedor}}               {{nombre_comprador}}
RUT: {{rut_vendedor}}             RUT: {{rut_comprador}}`,
  },
};

export async function generateDocument(
  options: GenerateOptions
): Promise<GenerateResult> {
  await new Promise((resolve) => setTimeout(resolve, 600));

  const plantilla = plantillas[options.tipo];

  if (!plantilla) {
    return {
      contenido:
        "No se encontro una plantilla para el tipo de documento solicitado.",
      tipo: options.tipo,
      titulo: "Documento no encontrado",
    };
  }

  let contenido = plantilla.contenido;

  for (const [key, value] of Object.entries(options.campos)) {
    contenido = contenido.replace(
      new RegExp(`\\{\\{${key}\\}\\}`, "g"),
      value
    );
  }

  return {
    contenido,
    tipo: options.tipo,
    titulo: plantilla.titulo,
  };
}

export function getPlantillas() {
  return Object.entries(plantillas).map(([key, value]) => ({
    id: key,
    titulo: value.titulo,
    preview: value.contenido.substring(0, 200) + "...",
  }));
}
