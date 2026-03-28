"use client";

import { useState, useRef, useEffect } from "react";
import {
  Bot,
  Send,
  FileSearch,
  FileSignature,
  Search,
  BookOpen,
  Upload,
  Sparkles,
  User,
  Copy,
  Check,
  ChevronRight,
  Scale,
  FileText,
  Gavel,
  AlertCircle,
} from "lucide-react";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

type ToolKey = "analisis" | "escritos" | "busqueda" | "resumen";

interface Tool {
  key: ToolKey;
  label: string;
  description: string;
  icon: typeof FileSearch;
  color: string;
  iconBg: string;
}

const tools: Tool[] = [
  {
    key: "analisis",
    label: "Analisis de Documento",
    description: "Sube o pega un documento legal para obtener un analisis detallado",
    icon: FileSearch,
    color: "text-blue-600 dark:text-blue-400",
    iconBg: "bg-blue-50 dark:bg-blue-900/20",
  },
  {
    key: "escritos",
    label: "Generador de Escritos",
    description: "Selecciona el tipo de escrito, completa los campos y genera",
    icon: FileSignature,
    color: "text-emerald-600 dark:text-emerald-400",
    iconBg: "bg-emerald-50 dark:bg-emerald-900/20",
  },
  {
    key: "busqueda",
    label: "Busqueda Legal",
    description: "Busca leyes, jurisprudencia y normativa chilena vigente",
    icon: Search,
    color: "text-purple-600 dark:text-purple-400",
    iconBg: "bg-purple-50 dark:bg-purple-900/20",
  },
  {
    key: "resumen",
    label: "Resumen de Sentencia",
    description: "Pega el texto de una sentencia para obtener un resumen estructurado",
    icon: BookOpen,
    color: "text-amber-600 dark:text-amber-400",
    iconBg: "bg-amber-50 dark:bg-amber-900/20",
  },
];

const suggestedPrompts = [
  {
    label: "Analizar documento",
    prompt: "Necesito analizar un documento legal. Puedo pegar el texto aqui?",
    icon: FileSearch,
  },
  {
    label: "Redactar escrito",
    prompt:
      "Necesito redactar una demanda civil ordinaria de cobro de pesos por $10.000.000 contra un deudor que incumplio un contrato de prestacion de servicios.",
    icon: FileSignature,
  },
  {
    label: "Buscar jurisprudencia",
    prompt:
      "Busca jurisprudencia reciente sobre despido injustificado en Chile, especificamente sobre la causal del articulo 160 N.7 del Codigo del Trabajo.",
    icon: Search,
  },
  {
    label: "Resumir sentencia",
    prompt:
      "Puedo pegar el texto de una sentencia para que me hagas un resumen estructurado?",
    icon: BookOpen,
  },
];

const mockResponses: Record<string, string> = {
  analizar: `**Analisis del Documento**

He revisado el documento proporcionado. Aqui esta mi analisis:

**Tipo de Documento:** Demanda Civil Ordinaria

**Partes Identificadas:**
- Demandante: Juan Carlos Gonzalez Perez (RUT: 12.345.678-9)
- Demandado: Maria Isabel Munoz Torres (RUT: 9.876.543-2)

**Resumen:**
Se trata de una demanda de cobro de pesos por incumplimiento contractual. El monto demandado es de $15.000.000 CLP mas intereses y costas.

**Plazos Legales Relevantes:**
- Prescripcion: 5 anos (art. 2515 CC)
- Contestacion: 15 dias habiles desde notificacion
- Periodo de prueba: 20 dias habiles

**Recomendaciones:**
1. Verificar notificacion personal conforme al art. 40 CPC
2. Preparar prueba documental del contrato y su incumplimiento
3. Considerar solicitar medida precautoria
4. Revisar existencia de clausula arbitral

**Nivel de Riesgo:** Medio - La demanda esta bien fundamentada pero el resultado depende de la prueba documental.`,

  redactar: `**Borrador de Demanda Civil - Cobro de Pesos**

He preparado un borrador basado en la informacion proporcionada:

---

**EN LO PRINCIPAL:** Demanda en juicio ordinario de cobro de pesos.
**PRIMER OTROSI:** Acompana documentos.
**SEGUNDO OTROSI:** Patrocinio y poder.

**S.J.L. EN LO CIVIL**

[Nombre del cliente], cedula de identidad N. [RUT], domiciliado en [domicilio], a US. respetuosamente digo:

Que vengo en interponer demanda en juicio ordinario de cobro de pesos en contra de [demandado], por la suma de $10.000.000...

---

**Nota:** Este es un borrador inicial. Te recomiendo:
1. Completar los datos personales de las partes
2. Detallar los hechos especificos del incumplimiento
3. Adjuntar el contrato de prestacion de servicios como prueba documental
4. Verificar la competencia del tribunal

Puedo personalizar mas este documento si me proporcionas detalles adicionales.`,

  jurisprudencia: `**Resultados de Busqueda: Despido Injustificado - Art. 160 N.7 CT**

He encontrado jurisprudencia relevante sobre incumplimiento grave de las obligaciones del contrato:

**1. Corte Suprema, Rol N. 12.345-2025 (15/01/2026)**
- Materia: Despido por incumplimiento grave
- Resolucion: Se acoge recurso de unificacion. Se establece que el incumplimiento debe ser de tal magnitud que haga imposible la continuidad de la relacion laboral.

**2. Corte de Apelaciones de Santiago, Rol N. 567-2025 (20/11/2025)**
- Materia: Despido injustificado - carga de la prueba
- Resolucion: Corresponde al empleador acreditar la causal invocada. Se confirma indemnizacion con recargo del 80%.

**3. Corte Suprema, Rol N. 89.012-2024 (05/08/2025)**
- Materia: Incumplimiento grave vs. incumplimiento menor
- Resolucion: No todo incumplimiento justifica el despido. Debe evaluarse proporcionalidad y contexto.

**Articulos Relevantes:**
- Art. 160 N.7 del Codigo del Trabajo
- Art. 168 CT - Indemnizaciones por despido injustificado
- Art. 162 CT - Formalidades del despido

Quieres que profundice en alguno de estos fallos?`,

  sentencia: `**Resumen Estructurado de Sentencia**

**Tribunal:** 1er Juzgado Civil de Santiago
**Fecha:** 15 de marzo de 2026
**Rol:** C-892-2025

**Caratulado:** Perez con Inversiones SpA

**Materia:** Indemnizacion de perjuicios por responsabilidad contractual

**Resolucion:** Se acoge parcialmente la demanda.

**Hechos Probados:**
1. Existencia del contrato entre las partes (enero 2024)
2. Incumplimiento del demandado en la entrega del proyecto
3. Perjuicios patrimoniales acreditados por $8.500.000

**Considerandos Clave:**
- Se aplica el art. 1545 CC (ley del contrato)
- Se rechaza dano moral por falta de prueba suficiente
- Se acredita nexo causal entre incumplimiento y perjuicio

**Decisiones:**
1. Se condena al pago de $8.500.000 + reajustes e intereses
2. Se rechaza indemnizacion por dano moral
3. Costas de la causa a cargo del demandado

**Plazos para Recurrir:**
- Apelacion: 10 dias habiles
- Casacion en la forma: 10 dias habiles

Quieres que analice algun aspecto especifico de esta sentencia?`,

  default: `Entiendo tu consulta. Como asistente legal de IA, puedo ayudarte con:

1. **Analisis de documentos** - Pega o describe el documento y lo analizo
2. **Redaccion de escritos** - Indicame el tipo y los detalles relevantes
3. **Busqueda de jurisprudencia** - Dame el tema o articulo legal
4. **Resumen de sentencias** - Pega el texto de la sentencia

Por favor, proporcioname mas detalles sobre lo que necesitas y te ayudare con gusto.

*Nota: Esta es una herramienta de asistencia. Siempre verifica la informacion con fuentes oficiales y el criterio profesional del abogado.*`,
};

function getAIResponse(message: string): string {
  const lower = message.toLowerCase();
  if (lower.includes("analiz") || lower.includes("document") || lower.includes("revis"))
    return mockResponses.analizar;
  if (lower.includes("redact") || lower.includes("demand") || lower.includes("escrit") || lower.includes("escrib"))
    return mockResponses.redactar;
  if (lower.includes("jurisprud") || lower.includes("busc") || lower.includes("ley") || lower.includes("articulo"))
    return mockResponses.jurisprudencia;
  if (lower.includes("sentencia") || lower.includes("resum") || lower.includes("fallo"))
    return mockResponses.sentencia;
  return mockResponses.default;
}

export default function IAAsistentePage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "assistant",
      content:
        "Hola, soy tu asistente legal con IA. Puedo ayudarte a analizar documentos, redactar escritos, buscar jurisprudencia y resumir sentencias. En que puedo ayudarte hoy?",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [activeTool, setActiveTool] = useState<ToolKey | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async (text: string) => {
    if (!text.trim()) return;

    const userMsg: Message = {
      id: `user-${Date.now()}`,
      role: "user",
      content: text,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);

    // Simulate AI response delay
    await new Promise((resolve) => setTimeout(resolve, 1200));

    const aiResponse: Message = {
      id: `ai-${Date.now()}`,
      role: "assistant",
      content: getAIResponse(text),
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, aiResponse]);
    setIsTyping(false);
  };

  const handleCopy = async (id: string, content: string) => {
    await navigator.clipboard.writeText(content);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleToolClick = (toolKey: ToolKey) => {
    setActiveTool(activeTool === toolKey ? null : toolKey);
    const toolPrompts: Record<ToolKey, string> = {
      analisis: "Quiero analizar un documento legal. Voy a pegar el texto a continuacion.",
      escritos: "Necesito generar un escrito judicial. Que tipo de escrito necesitas?",
      busqueda: "Quiero buscar jurisprudencia o normativa legal sobre un tema especifico.",
      resumen: "Necesito un resumen estructurado de una sentencia. Voy a pegar el texto.",
    };
    if (activeTool !== toolKey) {
      setInput(toolPrompts[toolKey]);
    }
  };

  return (
    <div className="max-w-7xl mx-auto h-[calc(100vh-8rem)]">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-full">
        {/* Chat Area */}
        <div className="lg:col-span-3 flex flex-col bg-white dark:bg-slate-900 rounded-xl border border-gray-200 dark:border-slate-800 shadow-sm overflow-hidden">
          {/* Chat Header */}
          <div className="flex items-center gap-3 px-6 py-4 border-b border-gray-100 dark:border-slate-800">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center shadow-sm shadow-violet-500/20">
              <Bot className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-base font-bold text-gray-900 dark:text-white">
                IA Asistente Legal
              </h1>
              <p className="text-xs text-gray-500 dark:text-slate-400">
                Analisis, redaccion y busqueda juridica con inteligencia artificial
              </p>
            </div>
            <div className="ml-auto flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">
                En linea
              </span>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-6 py-4 space-y-6">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-3 ${msg.role === "user" ? "flex-row-reverse" : ""}`}
              >
                {/* Avatar */}
                <div
                  className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                    msg.role === "assistant"
                      ? "bg-gradient-to-br from-violet-500 to-purple-600"
                      : "bg-gradient-to-br from-blue-500 to-indigo-600"
                  }`}
                >
                  {msg.role === "assistant" ? (
                    <Bot className="w-4 h-4 text-white" />
                  ) : (
                    <User className="w-4 h-4 text-white" />
                  )}
                </div>

                {/* Bubble */}
                <div
                  className={`group relative max-w-[80%] ${
                    msg.role === "user" ? "text-right" : ""
                  }`}
                >
                  <div
                    className={`inline-block text-left px-4 py-3 rounded-2xl text-sm leading-relaxed ${
                      msg.role === "user"
                        ? "bg-blue-600 text-white rounded-tr-md"
                        : "bg-gray-100 dark:bg-slate-800 text-gray-900 dark:text-white rounded-tl-md"
                    }`}
                  >
                    {msg.content.split("\n").map((line, i) => {
                      // Simple markdown-like bold rendering
                      const parts = line.split(/(\*\*[^*]+\*\*)/g);
                      return (
                        <p
                          key={i}
                          className={i > 0 ? "mt-1.5" : ""}
                        >
                          {parts.map((part, j) => {
                            if (part.startsWith("**") && part.endsWith("**")) {
                              return (
                                <strong key={j} className="font-semibold">
                                  {part.slice(2, -2)}
                                </strong>
                              );
                            }
                            return <span key={j}>{part}</span>;
                          })}
                        </p>
                      );
                    })}
                  </div>

                  {/* Copy button for AI messages */}
                  {msg.role === "assistant" && msg.id !== "welcome" && (
                    <button
                      onClick={() => handleCopy(msg.id, msg.content)}
                      className="absolute -bottom-6 left-0 flex items-center gap-1 text-xs text-gray-400 hover:text-gray-600 dark:hover:text-slate-300 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      {copiedId === msg.id ? (
                        <>
                          <Check className="w-3 h-3" />
                          Copiado
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3" />
                          Copiar
                        </>
                      )}
                    </button>
                  )}

                  <p
                    className={`text-[10px] text-gray-400 dark:text-slate-500 mt-1 ${
                      msg.role === "user" ? "text-right" : ""
                    }`}
                  >
                    {msg.timestamp.toLocaleTimeString("es-CL", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
              </div>
            ))}

            {/* Typing indicator */}
            {isTyping && (
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center shrink-0">
                  <Bot className="w-4 h-4 text-white" />
                </div>
                <div className="bg-gray-100 dark:bg-slate-800 px-4 py-3 rounded-2xl rounded-tl-md">
                  <div className="flex items-center gap-1.5">
                    <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: "0ms" }} />
                    <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: "150ms" }} />
                    <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: "300ms" }} />
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Suggested Prompts */}
          {messages.length <= 1 && (
            <div className="px-6 pb-3">
              <div className="grid grid-cols-2 gap-2">
                {suggestedPrompts.map((prompt) => {
                  const Icon = prompt.icon;
                  return (
                    <button
                      key={prompt.label}
                      onClick={() => sendMessage(prompt.prompt)}
                      className="flex items-center gap-2.5 px-4 py-3 bg-gray-50 dark:bg-slate-800/50 hover:bg-gray-100 dark:hover:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl text-left transition-colors group"
                    >
                      <Icon className="w-4 h-4 text-gray-400 group-hover:text-blue-500 transition-colors shrink-0" />
                      <span className="text-sm text-gray-700 dark:text-slate-300 font-medium">
                        {prompt.label}
                      </span>
                      <ChevronRight className="w-3.5 h-3.5 text-gray-300 dark:text-slate-600 ml-auto group-hover:text-blue-500 transition-colors" />
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Input Area */}
          <div className="px-6 py-4 border-t border-gray-100 dark:border-slate-800">
            <div className="flex items-end gap-3">
              <div className="flex-1 relative">
                <textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      sendMessage(input);
                    }
                  }}
                  placeholder="Escribe tu consulta legal..."
                  rows={1}
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl text-sm text-gray-900 dark:text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent resize-none"
                  style={{ minHeight: "44px", maxHeight: "120px" }}
                />
              </div>
              <button
                onClick={() => sendMessage(input)}
                disabled={!input.trim() || isTyping}
                className="p-3 bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 disabled:from-gray-300 disabled:to-gray-400 dark:disabled:from-slate-700 dark:disabled:to-slate-700 text-white rounded-xl shadow-sm shadow-violet-600/20 transition-all"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
            <p className="text-[10px] text-gray-400 dark:text-slate-500 mt-2 flex items-center gap-1">
              <AlertCircle className="w-3 h-3" />
              Las respuestas son generadas por IA y deben verificarse con criterio profesional.
            </p>
          </div>
        </div>

        {/* Sidebar - AI Tools */}
        <div className="space-y-4 overflow-y-auto">
          {/* AI Tools */}
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-gray-200 dark:border-slate-800 shadow-sm">
            <div className="px-5 py-4 border-b border-gray-100 dark:border-slate-800">
              <h2 className="text-sm font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-violet-500" />
                Herramientas IA
              </h2>
            </div>
            <div className="p-3 space-y-2">
              {tools.map((tool) => {
                const Icon = tool.icon;
                const isActive = activeTool === tool.key;
                return (
                  <button
                    key={tool.key}
                    onClick={() => handleToolClick(tool.key)}
                    className={`w-full flex items-start gap-3 p-3 rounded-xl text-left transition-all ${
                      isActive
                        ? "bg-violet-50 dark:bg-violet-900/20 border border-violet-200 dark:border-violet-800"
                        : "hover:bg-gray-50 dark:hover:bg-slate-800/50 border border-transparent"
                    }`}
                  >
                    <div
                      className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${tool.iconBg}`}
                    >
                      <Icon className={`w-4.5 h-4.5 ${tool.color}`} />
                    </div>
                    <div className="min-w-0">
                      <p
                        className={`text-sm font-semibold ${
                          isActive
                            ? "text-violet-700 dark:text-violet-300"
                            : "text-gray-900 dark:text-white"
                        }`}
                      >
                        {tool.label}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-slate-400 mt-0.5">
                        {tool.description}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Quick Info */}
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-gray-200 dark:border-slate-800 shadow-sm p-5">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">
              Capacidades
            </h3>
            <div className="space-y-2.5">
              {[
                { icon: Scale, text: "Analisis de casos y jurisprudencia" },
                { icon: FileText, text: "Generacion de escritos judiciales" },
                { icon: Gavel, text: "Busqueda de normativa vigente" },
                { icon: BookOpen, text: "Resumen de sentencias y fallos" },
              ].map((item, i) => {
                const Icon = item.icon;
                return (
                  <div key={i} className="flex items-center gap-2.5">
                    <Icon className="w-3.5 h-3.5 text-violet-500 shrink-0" />
                    <span className="text-xs text-gray-600 dark:text-slate-400">
                      {item.text}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Disclaimer */}
          <div className="bg-amber-50 dark:bg-amber-900/10 rounded-xl border border-amber-200 dark:border-amber-800/50 p-4">
            <div className="flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-semibold text-amber-800 dark:text-amber-300">
                  Aviso Importante
                </p>
                <p className="text-xs text-amber-700 dark:text-amber-400 mt-1">
                  Esta herramienta utiliza IA como asistente. Las respuestas deben
                  ser siempre verificadas por un abogado habilitado antes de su
                  uso en procedimientos legales.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
