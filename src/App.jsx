import { useState, useRef, useEffect } from "react";

// TODO: Integrar con API de IA real (OpenAI, Anthropic, etc.)
// TODO: Implementar autenticación de usuarios
// TODO: Guardar historial de conversaciones en localStorage o backend

const TOOLS = [
  {
    id: "writer",
    icon: "✍️",
    name: "Escritor IA",
    desc: "Crea artículos, blogs y textos profesionales al instante",
    color: "#7c3aed",
    gradient: "linear-gradient(135deg, #7c3aed, #a855f7)",
    category: "Escritura",
  },
  {
    id: "copywriting",
    icon: "💡",
    name: "Copywriting",
    desc: "Anuncios, emails y copys que convierten clientes",
    color: "#2563eb",
    gradient: "linear-gradient(135deg, #2563eb, #3b82f6)",
    category: "Marketing",
  },
  {
    id: "seo",
    icon: "🔍",
    name: "SEO Optimizer",
    desc: "Optimiza tu contenido para aparecer en Google",
    color: "#059669",
    gradient: "linear-gradient(135deg, #059669, #10b981)",
    category: "SEO",
  },
  {
    id: "social",
    icon: "📱",
    name: "Redes Sociales",
    desc: "Posts virales para Instagram, Twitter y LinkedIn",
    color: "#dc2626",
    gradient: "linear-gradient(135deg, #dc2626, #f87171)",
    category: "Social",
  },
  {
    id: "summarize",
    icon: "📄",
    name: "Resumidor",
    desc: "Resume textos largos en segundos",
    color: "#d97706",
    gradient: "linear-gradient(135deg, #d97706, #fbbf24)",
    category: "Productividad",
  },
  {
    id: "translator",
    icon: "🌐",
    name: "Traductor IA",
    desc: "Traduce con contexto y tono natural",
    color: "#0891b2",
    gradient: "linear-gradient(135deg, #0891b2, #22d3ee)",
    category: "Idiomas",
  },
  {
    id: "code",
    icon: "💻",
    name: "Generador de Código",
    desc: "Escribe código en cualquier lenguaje de programación",
    color: "#7c3aed",
    gradient: "linear-gradient(135deg, #4f46e5, #7c3aed)",
    category: "Desarrollo",
  },
  {
    id: "image",
    icon: "🎨",
    name: "Descripción de Imágenes",
    desc: "Genera texto a partir de imágenes y fotos",
    color: "#be185d",
    gradient: "linear-gradient(135deg, #be185d, #ec4899)",
    category: "Creativo",
  },
];

const HISTORY = [
  { id: 1, tool: "Escritor IA", preview: "Artículo sobre inteligencia artificial...", time: "Hace 2 min", icon: "✍️" },
  { id: 2, tool: "Copywriting", preview: "Email de bienvenida para nuevos clientes...", time: "Hace 1 hora", icon: "💡" },
  { id: 3, tool: "SEO Optimizer", preview: "Optimización para 'mejores restaurantes...'", time: "Ayer", icon: "🔍" },
];

const PLANS = [
  {
    name: "Gratis",
    price: "0",
    period: "siempre",
    color: "#6b7280",
    features: ["10 generaciones/mes", "Herramientas básicas", "Soporte por email"],
    cta: "Empezar gratis",
    popular: false,
  },
  {
    name: "Pro",
    price: "19",
    period: "mes",
    color: "#7c3aed",
    features: ["Generaciones ilimitadas", "Todas las herramientas", "Prioridad en soporte", "API Access", "Sin marcas de agua"],
    cta: "Empezar Pro",
    popular: true,
  },
  {
    name: "Empresa",
    price: "49",
    period: "mes",
    color: "#059669",
    features: ["Todo lo de Pro", "Usuarios ilimitados", "Panel de administración", "Integraciones custom", "SLA garantizado"],
    cta: "Contactar ventas",
    popular: false,
  },
];

const PROMPTS_EXAMPLE = {
  writer: [
    "Escribe un artículo de 500 palabras sobre inteligencia artificial",
    "Crea una introducción para un blog de viajes",
    "Redacta una reseña de producto para auriculares",
  ],
  copywriting: [
    "Crea un email de bienvenida para nuevos usuarios",
    "Escribe un anuncio para Facebook Ads de una app fitness",
    "Genera un asunto de email con alta tasa de apertura",
  ],
  seo: [
    "Optimiza este título para SEO: 'Aprende a cocinar'",
    "Genera 10 keywords para un blog de tecnología",
    "Escribe una meta descripción para una tienda online",
  ],
  social: [
    "Crea 5 ideas de posts para Instagram de una cafetería",
    "Genera un hilo de Twitter sobre productividad",
    "Escribe una publicación de LinkedIn para buscar empleo",
  ],
  summarize: [
    "Resume este artículo en 3 puntos clave",
    "Extrae las ideas principales de este texto",
    "Crea un resumen ejecutivo de este informe",
  ],
  translator: [
    "Traduce al inglés con tono formal",
    "Traduce al francés manteniendo el humor",
    "Adapta culturalmente este mensaje al mercado mexicano",
  ],
  code: [
    "Crea una función en Python para ordenar listas",
    "Escribe una API REST básica en Node.js",
    "Genera un componente React para un formulario de contacto",
  ],
  image: [
    "Describe esta imagen para redes sociales",
    "Crea texto alternativo accesible para esta foto",
    "Genera un pie de foto creativo",
  ],
};

function TypingDots() {
  return (
    <div style={{ display: "flex", gap: 4, alignItems: "center", padding: "12px 0" }}>
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          style={{
            width: 8,
            height: 8,
            borderRadius: "50%",
            background: "#a855f7",
            animation: `bounce 1.2s infinite`,
            animationDelay: `${i * 0.2}s`,
          }}
        />
      ))}
    </div>
  );
}

function ToolCard({ tool, onClick, compact = false }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      onClick={() => onClick(tool)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: hovered ? "rgba(255,255,255,0.08)" : "rgba(255,255,255,0.04)",
        border: `1px solid ${hovered ? tool.color + "60" : "rgba(255,255,255,0.08)"}`,
        borderRadius: 16,
        padding: compact ? "14px" : "18px",
        cursor: "pointer",
        transition: "all 0.25s ease",
        transform: hovered ? "translateY(-2px)" : "translateY(0)",
        boxShadow: hovered ? `0 8px 24px ${tool.color}30` : "none",
      }}
    >
      <div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
        <div
          style={{
            width: compact ? 40 : 48,
            height: compact ? 40 : 48,
            borderRadius: 12,
            background: tool.gradient,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: compact ? 18 : 22,
            flexShrink: 0,
            boxShadow: `0 4px 12px ${tool.color}40`,
          }}
        >
          {tool.icon}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }}>
            <p style={{ margin: 0, color: "#f1f5f9", fontWeight: 600, fontSize: compact ? 13 : 15, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
              {tool.name}
            </p>
            <span style={{ fontSize: 10, background: tool.color + "30", color: tool.color, padding: "1px 6px", borderRadius: 20, whiteSpace: "nowrap", fontWeight: 500 }}>
              {tool.category}
            </span>
          </div>
          {!compact && (
            <p style={{ margin: 0, color: "#94a3b8", fontSize: 12, lineHeight: 1.4 }}>
              {tool.desc}
            </p>
          )}
        </div>
        <div style={{ color: "#475569", fontSize: 16, flexShrink: 0 }}>›</div>
      </div>
    </div>
  );
}

export default function App() {
  const [activeTab, setActiveTab] = useState("inicio");
  const [selectedTool, setSelectedTool] = useState(null);
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showOnboarding, setShowOnboarding] = useState(true);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isTyping]);

  const filteredTools = TOOLS.filter(
    (t) =>
      t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.desc.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSelectTool = (tool) => {
    setSelectedTool(tool);
    setMessages([
      {
        id: Date.now(),
        role: "assistant",
        text: `¡Hola! Soy tu asistente de **${tool.name}**. ${tool.desc}. ¿Qué quieres crear hoy?`,
        time: new Date().toLocaleTimeString("es-ES", { hour: "2-digit", minute: "2-digit" }),
      },
    ]);
    setActiveTab("chat");
    setTimeout(() => inputRef.current?.focus(), 100);
  };

  // TODO: Reemplazar esta función con llamada real a API de IA
  const generateFakeResponse = (tool, userMsg) => {
    const responses = {
      writer: `✍️ **Aquí tienes tu texto:**\n\nLa inteligencia artificial está transformando el mundo tal como lo conocemos. Desde la automatización de tareas repetitivas hasta la generación de contenido creativo, las posibilidades son infinitas.\n\n**Puntos destacados:**\n• Mayor productividad en equipos\n• Personalización a escala\n• Innovación continua\n\n¿Quieres que ajuste el tono o la longitud?`,
      copywriting: `💡 **Tu copy está listo:**\n\n*Asunto:* ¡Bienvenido a la familia! 🎉\n\nHola [Nombre],\n\nNos alegra tenerte con nosotros. Has dado el primer paso hacia [beneficio principal].\n\nEn los próximos días te enviaremos todo lo que necesitas para empezar.\n\n**[CTA: Comenzar ahora →]**\n\nUn abrazo,\nEl equipo`,
      seo: `🔍 **Análisis SEO completado:**\n\n**Puntuación:** 78/100 ✅\n\n**Keywords sugeridas:**\n1. "cocinar fácil en casa" - Vol: 12.4K\n2. "recetas rápidas" - Vol: 8.2K\n3. "comida saludable" - Vol: 22K\n\n**Mejoras recomendadas:**\n• Añadir keyword en H1\n• Meta descripción de 155 caracteres\n• Agregar texto alternativo a imágenes`,
      social: `📱 **Posts para Instagram:**\n\n**Post 1:**\n☕ El secreto de un buen café está en los detalles. Visítanos y descúbrelo. #café #vibes\n\n**Post 2:**\n¿Buscas tu lugar favorito en la ciudad? Ya lo encontraste 💜 #cafetería #cozy\n\n**Post 3:**\nMañanas mejores comienzan aquí ✨ Reserva tu mesa: [link en bio]`,
      summarize: `📄 **Resumen ejecutivo:**\n\n**Ideas principales:**\n1. El mercado digital creció un 34% en 2024\n2. Los usuarios móviles superan a los de escritorio\n3. La personalización aumenta la retención en un 60%\n\n**Conclusión:** La transformación digital ya no es opcional, es una necesidad competitiva.\n\n*Texto reducido de 1,200 a 85 palabras.*`,
      translator: `🌐 **Traducción completada:**\n\n**Original:** "${userMsg}"\n\n**Traducción:**\n"Artificial intelligence is transforming the world as we know it, opening new possibilities for businesses and individuals alike."\n\n**Tono:** Formal ✅\n**Precisión:** Alta ✅`,
      code: `💻 **Código generado:**\n\n\`\`\`python\ndef ordenar_lista(lista, reverso=False):\n    """\n    Ordena una lista de menor a mayor\n    o de mayor a menor.\n    """\n    return sorted(lista, reverse=reverso)\n\n# Ejemplo de uso\nnumeros = [3, 1, 4, 1, 5, 9, 2, 6]\nprint(ordenar_lista(numeros))  # [1,1,2,3,4,5,6,9]\n\`\`\`\n\n¿Necesitas añadir más funcionalidades?`,
      image: `🎨 **Descripción generada:**\n\n*Para redes sociales:*\n"Tarde perfecta capturada en un instante ☀️ La luz dorada del atardecer inunda cada rincón, recordándonos que los mejores momentos no se planean, simplemente suceden. ¿Cuál fue tu mejor momento del día? 💛"\n\n*Texto alternativo:* "Fotografía de paisaje al atardecer con cielo naranja y árboles en silueta"`,
    };

    return responses[tool.id] || `He procesado tu solicitud: "${userMsg}". Aquí tienes el resultado generado con inteligencia artificial. ¿Necesitas ajustes?`;
  };

  const handleSend = () => {
    if (!inputValue.trim() || isTyping) return;
    const userMsg = inputValue.trim();
    setInputValue("");

    const newMessage = {
      id: Date.now(),
      role: "user",
      text: userMsg,
      time: new Date().toLocaleTimeString("es-ES", { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, newMessage]);
    setIsTyping(true);

    // TODO: Reemplazar setTimeout con llamada real a API
    setTimeout(() => {
      setIsTyping(false);
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          role: "assistant",
          text: generateFakeResponse(selectedTool, userMsg),
          time: new Date().toLocaleTimeString("es-ES", { hour: "2-digit", minute: "2-digit" }),
        },
      ]);
    }, 1800);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const renderMessage = (text) => {
    return text
      .split("\n")
      .map((line, i) => {
        const bold = line.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");
        const italic = bold.replace(/\*(.*?)\*/g, "<em>$1</em>");
        const code = italic.replace(/`(.*?)`/g, "<code style='background:#1e1b4b;padding:2px 6px;border-radius:4px;font-family:monospace;font-size:12px;color:#a5b4fc'>$1</code>");
        return (
          <span key={i}>
            <span dangerouslySetInnerHTML={{ __html: code }} />
            {i < text.split("\n").length - 1 && <br />}
          </span>
        );
      });
  };

  // ======================== PANTALLAS ========================

  const HomeScreen = () => (
    <div style={{ padding: "0 0 100px 0" }}>
      {/* Header */}
      <div
        style={{
          padding: "24px 20px 20px",
          background: "linear-gradient(180deg, #0f0a1e 0%, transparent 100%)",
          position: "sticky",
          top: 0,
          zIndex: 10,
          backdropFilter: "blur(12px)",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <div>
            <p style={{ margin: 0, color: "#94a3b8", fontSize: 13 }}>Buenos días 👋</p>
            <h1 style={{ margin: 0, color: "#f1f5f9", fontSize: 22, fontWeight: 700 }}>Hazlo Ahora</h1>
          </div>
          <div
            style={{
              width: 40,
              height: 40,
              borderRadius: "50%",
              background: "linear-gradient(135deg, #7c3aed, #a855f7)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 18,
              cursor: "pointer",
              boxShadow: "0 4px 12px #7c3aed50",
            }}
          >
            H
          </div>
        </div>

        {/* Buscador */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            background: "rgba(255,255,255,0.06)",
            border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: 12,
            padding: "10px 14px",
            gap: 10,
          }}
        >
          <span style={{ fontSize: 16 }}>🔎</span>
          <input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar herramientas de IA..."
            style={{
              flex: 1,
              background: "transparent",
              border: "none",
              outline: "none",
              color: "#f1f5f9",
              fontSize: 14,
              fontFamily: "Inter, sans-serif",
            }}
          />
        </div>
      </div>

      {/* Banner Hero */}
      {showOnboarding && (
        <div style={{ padding: "0 20px 20px" }}>
          <div
            style={{
              background: "linear-gradient(135deg, #4f46e5 0%, #7c3aed 50%, #a855f7 100%)",
              borderRadius: 20,
              padding: 20,
              position: "relative",
              overflow: "hidden",
            }}
          >
            <button
              onClick={() => setShowOnboarding(false)}
              style={{
                position: "absolute",
                top: 12,
                right: 12,
                background: "rgba(255,255,255,0.2)",
                border: "none",
                color: "white",
                width: 24,
                height: 24,
                borderRadius: "50%",
                cursor: "pointer",
                fontSize: 12,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              ✕
            </button>
            <div style={{ fontSize: 32, marginBottom: 8 }}>🚀</div>
            <h2 style={{ margin: "0 0 6px", color: "white", fontSize: 18, fontWeight: 700 }}>
              ¡Bienvenido a Hazlo Ahora!
            </h2>
            <p style={{ margin: "0 0 16px", color: "rgba(255,255,255,0.8)", fontSize: 13, lineHeight: 1.5 }}>
              Tu asistente de IA para crear contenido increíble en segundos. Elige una herramienta y empieza.
            </p>
            <button
              onClick={() => { setShowOnboarding(false); setActiveTab("herramientas"); }}
              style={{
                background: "white",
                color: "#7c3aed",
                border: "none",
                borderRadius: 10,
                padding: "10px 20px",
                fontWeight: 700,
                fontSize: 14,
                cursor: "pointer",
                fontFamily: "Inter, sans-serif",
              }}
            >
              Explorar herramientas →
            </button>
            {/* Decoración */}
            <div style={{
              position: "absolute", right: -20, bottom: -20, width: 100, height: 100,
              borderRadius: "50%", background: "rgba(255,255,255,0.05)",
            }} />
            <div style={{
              position: "absolute", right: 20, bottom: -40, width: 80, height: 80,
              borderRadius: "50%", background: "rgba(255,255,255,0.07)",
            }} />
          </div>
        </div>
      )}

      {/* Stats rápidas */}
      <div style={{ padding: "0 20px 20px", display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 }}>
        {[
          { label: "Herramientas", value: "8", icon: "⚡" },
          { label: "Generaciones", value: "∞", icon: "🔥" },
          { label: "Idiomas", value: "50+", icon: "🌐" },
        ].map((stat) => (
          <div
            key={stat.label}
            style={{
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.08)",
              borderRadius: 14,
              padding: "14px 10px",
              textAlign: "center",
            }}
          >
            <div style={{ fontSize: 20, marginBottom: 4 }}>{stat.icon}</div>
            <div style={{ color: "#f1f5f9", fontWeight: 700, fontSize: 16 }}>{stat.value}</div>
            <div style={{ color: "#64748b", fontSize: 11 }}>{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Herramientas populares */}
      <div style={{ padding: "0 20px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
          <h2 style={{ margin: 0, color: "#f1f5f9", fontSize: 17, fontWeight: 600 }}>
            {searchQuery ? `Resultados (${filteredTools.length})` : "Herramientas populares"}
          </h2>
          {!searchQuery && (
            <button
              onClick={() => setActiveTab("herramientas")}
              style={{ background: "none", border: "none", color: "#a855f7", fontSize: 13, cursor: "pointer", fontFamily: "Inter, sans-serif" }}
            >
              Ver todas →
            </button>
          )}
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {(searchQuery ? filteredTools : TOOLS.slice(0, 4)).map((tool) => (
            <ToolCard key={tool.id} tool={tool} onClick={handleSelectTool} />
          ))}
        </div>
      </div>

      {/* Historial reciente */}
      {!searchQuery && (
        <div style={{ padding: "20px 20px 0" }}>
          <h2 style={{ margin: "0 0 14px", color: "#f1f5f9", fontSize: 17, fontWeight: 600 }}>
            Reciente
          </h2>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {HISTORY.map((item) => (
              <div
                key={item.id}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  background: "rgba(255,255,255,0.03)",
                  border: "1px solid rgba(255,255,255,0.06)",
                  borderRadius: 12,
                  padding: "12px 14px",
                  cursor: "pointer",
                }}
              >
                <span style={{ fontSize: 20 }}>{item.icon}</span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ margin: "0 0 2px", color: "#cbd5e1", fontSize: 13, fontWeight: 500 }}>{item.tool}</p>
                  <p style={{ margin: 0, color: "#475569", fontSize: 12, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {item.preview}
                  </p>
                </div>
                <span style={{ color: "#475569", fontSize: 11, flexShrink: 0 }}>{item.time}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  const ToolsScreen = () => (
    <div style={{ padding: "24px 20px 100px" }}>
      <h1 style={{ margin: "0 0 6px", color: "#f1f5f9", fontSize: 22, fontWeight: 700 }}>Herramientas IA</h1>
      <p style={{ margin: "0 0 20px", color: "#64748b", fontSize: 14 }}>Elige una herramienta para comenzar</p>

      {/* Categorías */}
      <div style={{ display: "flex", gap: 8, overflowX: "auto", paddingBottom: 16, marginBottom: 16, scrollbarWidth: "none" }}>
        {["Todas", "Escritura", "Marketing", "SEO", "Social", "Productividad", "Desarrollo"].map((cat) => (
          <button
            key={cat}
            style={{
              background: cat === "Todas" ? "#7c3aed" : "rgba(255,255,255,0.06)",
              border: `1px solid ${cat === "Todas" ? "#7c3aed" : "rgba(255,255,255,0.1)"}`,
              color: cat === "Todas" ? "white" : "#94a3b8",
              borderRadius: 20,
              padding: "8px 16px",
              fontSize: 13,
              cursor: "pointer",
              whiteSpace: "nowrap",
              fontFamily: "Inter, sans-serif",
              fontWeight: cat === "Todas" ? 600 : 400,
            }}
          >
            {cat}
          </button>
        ))}
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {TOOLS.map((tool) => (
          <ToolCard key={tool.id} tool={tool} onClick={handleSelectTool} />
        ))}
      </div>
    </div>
  );

  const ChatScreen = () => (
    <div style={{ display: "flex", flexDirection: "column", height: "100vh", paddingBottom: 80 }}>
      {/* Chat Header */}
      <div
        style={{
          padding: "16px 20px",
          background: "#0f0a1e",
          borderBottom: "1px solid rgba(255,255,255,0.08)",
          display: "flex",
          alignItems: "center",
          gap: 12,
          position: "sticky",
          top: 0,
          zIndex: 10,
        }}
      >
        <button
          onClick={() => setActiveTab("herramientas")}
          style={{ background: "none", border: "none", color: "#94a3b8", fontSize: 20, cursor: "pointer", padding: 0 }}
        >
          ←
        </button>
        {selectedTool && (
          <>
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: 10,
                background: selectedTool.gradient,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 18,
              }}
            >
              {selectedTool.icon}
            </div>
            <div>
              <p style={{ margin: 0, color: "#f1f5f9", fontWeight: 600, fontSize: 15 }}>{selectedTool.name}</p>
              <p style={{ margin: 0, color: "#10b981", fontSize: 11 }}>● Activo</p>
            </div>
          </>
        )}
        <button
          onClick={() => setMessages([])}
          style={{
            marginLeft: "auto",
            background: "rgba(255,255,255,0.06)",
            border: "1px solid rgba(255,255,255,0.1)",
            color: "#94a3b8",
            borderRadius: 8,
            padding: "6px 12px",
            fontSize: 12,
            cursor: "pointer",
            fontFamily: "Inter, sans-serif",
          }}
        >
          Limpiar
        </button>
      </div>

      {/* Mensajes */}
      <div
        style={{
          flex: 1,
          overflowY: "auto",
          padding: "16px 20px",
          display: "flex",
          flexDirection: "column",
          gap: 12,
        }}
      >
        {messages.length === 0 && selectedTool && (
          <div style={{ textAlign: "center", padding: "40px 0" }}>
            <div style={{ fontSize: 48, marginBottom: 12 }}>{selectedTool.icon}</div>
            <p style={{ color: "#64748b", fontSize: 14 }}>Escribe un mensaje para comenzar</p>
            <div style={{ marginTop: 20, display: "flex", flexDirection: "column", gap: 8 }}>
              <p style={{ color: "#475569", fontSize: 12, margin: 0 }}>Sugerencias:</p>
              {(PROMPTS_EXAMPLE[selectedTool.id] || []).map((prompt, i) => (
                <button
                  key={i}
                  onClick={() => setInputValue(prompt)}
                  style={{
                    background: "rgba(255,255,255,0.04)",
                    border: `1px solid ${selectedTool.color}30`,
                    borderRadius: 10,
                    padding: "10px 14px",
                    color: "#94a3b8",
                    fontSize: 13,
                    cursor: "pointer",
                    textAlign: "left",
                    fontFamily: "Inter, sans-serif",
                    transition: "all 0.2s",
                  }}
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((msg) => (
          <div
            key={msg.id}
            style={{
              display: "flex",
              justifyContent: msg.role === "user" ? "flex-end" : "flex-start",
              gap: 8,
            }}
          >
            {msg.role === "assistant" && (
              <div
                style={{
                  width: 30,
                  height: 30,
                  borderRadius: 10,
                  background: selectedTool ? selectedTool.gradient : "linear-gradient(135deg, #7c3aed, #a855f7)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 14,
                  flexShrink: 0,
                  marginTop: 4,
                }}
              >
                {selectedTool?.icon || "🤖"}
              </div>
            )}
            <div style={{ maxWidth: "78%", display: "flex", flexDirection: "column", gap: 4 }}>
              <div
                style={{
                  background:
                    msg.role === "user"
                      ? "linear-gradient(135deg, #7c3aed, #a855f7)"
                      : "rgba(255,255,255,0.06)",
                  border: msg.role === "user" ? "none" : "1px solid rgba(255,255,255,0.08)",
                  borderRadius: msg.role === "user" ? "18px 18px 4px 18px" : "18px 18px 18px 4px",
                  padding: "12px 14px",
                  color: "#f1f5f9",
                  fontSize: 14,
                  lineHeight: 1.6,
                  wordBreak: "break-word",
                }}
              >
                {renderMessage(msg.text)}
              </div>
              <span
                style={{
                  color: "#475569",
                  fontSize: 10,
                  alignSelf: msg.role === "user" ? "flex-end" : "flex-start",
                }}
              >
                {msg.time}
              </span>
            </div>
          </div>
        ))}

        {isTyping && (
          <div style={{ display: "flex", gap: 8, alignItems: "flex-start" }}>
            <div
              style={{
                width: 30,
                height: 30,
                borderRadius: 10,
                background: selectedTool ? selectedTool.gradient : "linear-gradient(135deg, #7c3aed, #a855f7)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 14,
                flexShrink: 0,
              }}
            >
              {selectedTool?.icon || "🤖"}
            </div>
            <div
              style={{
                background: "rgba(255,255,255,0.06)",
                border: "1px solid rgba(255,255,255,0.08)",
                borderRadius: "18px 18px 18px 4px",
                padding: "8px 14px",
              }}
            >
              <TypingDots />
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div
        style={{
          padding: "12px 16px",
          background: "#0f0a1e",
          borderTop: "1px solid rgba(255,255,255,0.08)",
          position: "fixed",
          bottom: 70,
          left: 0,
          right: 0,
          zIndex: 10,
        }}
      >
        <div
          style={{
            display: "flex",
            gap: 10,
            alignItems: "flex-end",
            background: "rgba(255,255,255,0.06)",
            border: "1px solid rgba(255,255,255,0.12)",
            borderRadius: 16,
            padding: "8px 12px",
          }}
        >
          <textarea
            ref={inputRef}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Escribe tu solicitud..."
            rows={1}
            style={{
              flex: 1,
              background: "transparent",
              border: "none",
              outline: "none",
              color: "#f1f5f9",
              fontSize: 14,
              fontFamily: "Inter, sans-serif",
              resize: "none",
              lineHeight: 1.5,
              maxHeight: 100,
              overflow: "auto",
            }}
          />
          <button
            onClick={handleSend}
            disabled={!inputValue.trim() || isTyping}
            style={{
              width: 36,
              height: 36,
              borderRadius: 10,
              background:
                inputValue.trim() && !isTyping
                  ? "linear-gradient(135deg, #7c3aed, #a855f7)"
                  : "rgba(255,255,255,0.08)",
              border: "none",
              color: inputValue.trim() && !isTyping ? "white" : "#475569",
              cursor: inputValue.trim() && !isTyping ? "pointer" : "not-allowed",
              fontSize: 16,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
              transition: "all 0.2s",
              boxShadow: inputValue.trim() && !isTyping ? "0 4px 12px #7c3aed50" : "none",
            }}
          >
            ↑
          </button>
        </div>
        <p style={{ margin: "6px 0 0", color: "#374151", fontSize: 10, textAlign: "center" }}>
          Hazlo Ahora IA · Enter para enviar, Shift+Enter para nueva línea
        </p>
      </div>
    </div>
  );

  const PlansScreen = () => (
    <div style={{ padding: "24px 20px 100px" }}>
      <div style={{ textAlign: "center", marginBottom: 28 }}>
        <div style={{ fontSize: 36, marginBottom: 8 }}>⚡</div>
        <h1 style={{ margin: "0 0 8px", color: "#f1f5f9", fontSize: 24, fontWeight: 700 }}>
          Elige tu plan
        </h1>
        <p style={{ margin: 0, color: "#64748b", fontSize: 14 }}>
          Crea contenido ilimitado con IA de última generación
        </p>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        {PLANS.map((plan) => (
          <div
            key={plan.name}
            style={{
              background: plan.popular
                ? `linear-gradient(135deg, ${plan.color}20, ${plan.color}10)`
                : "rgba(255,255,255,0.04)",
              border: `2px solid ${plan.popular ? plan.color : "rgba(255,255,255,0.08)"}`,
              borderRadius: 20,
              padding: "22px 20px",
              position: "relative",
              overflow: "hidden",
            }}
          >
            {plan.popular && (
              <div
                style={{
                  position: "absolute",
                  top: 14,
                  right: 14,
                  background: plan.color,
                  color: "white",
                  fontSize: 11,
                  fontWeight: 700,
                  padding: "4px 10px",
                  borderRadius: 20,
                }}
              >
                ⭐ POPULAR
              </div>
            )}

            <div style={{ marginBottom: 16 }}>
              <h2 style={{ margin: "0 0 4px", color: "#f1f5f9", fontSize: 20, fontWeight: 700 }}>
                {plan.name}
              </h2>
              <div style={{ display: "flex", alignItems: "baseline", gap: 4 }}>
                <span style={{ color: plan.color, fontSize: 36, fontWeight: 800 }}>${plan.price}</span>
                <span style={{ color: "#64748b", fontSize: 14 }}>/{plan.period}</span>
              </div>
            </div>

            <div style={{ marginBottom: 20 }}>
              {plan.features.map((f, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
                  <div
                    style={{
                      width: 18,
                      height: 18,
                      borderRadius: "50%",
                      background: plan.color + "30",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 10,
                      color: plan.color,
                      flexShrink: 0,
                    }}
                  >
                    ✓
                  </div>
                  <span style={{ color: "#cbd5e1", fontSize: 14 }}>{f}</span>
                </div>
              ))}
            </div>

            <button
              style={{
                width: "100%",
                padding: "14px",
                background: plan.popular ? `linear-gradient(135deg, ${plan.color}, ${plan.color}cc)` : "rgba(255,255,255,0.06)",
                border: `1px solid ${plan.popular ? "transparent" : "rgba(255,255,255,0.12)"}`,
                borderRadius: 12,
                color: plan.popular ? "white" : "#94a3b8",
                fontWeight: 700,
                fontSize: 15,
                cursor: "pointer",
                fontFamily: "Inter, sans-serif",
                transition: "all 0.2s",
                boxShadow: plan.popular ? `0 4px 20px ${plan.color}50` : "none",
              }}
            >
              {plan.cta}
            </button>
          </div>
        ))}
      </div>

      <div style={{ marginTop: 24, textAlign: "center" }}>
        <p style={{ color: "#475569", fontSize: 12 }}>
          🔒 Pago seguro · Cancela cuando quieras · Sin contratos
        </p>
      </div>
    </div>
  );

  const ProfileScreen = () => (
    <div style={{ padding: "24px 20px 100px" }}>
      {/* Avatar y nombre */}
      <div style={{ textAlign: "center", marginBottom: 28 }}>
        <div
          style={{
            width: 80,
            height: 80,
            borderRadius: "50%",
            background: "linear-gradient(135deg, #7c3aed, #a855f7)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 32,
            margin: "0 auto 12px",
            boxShadow: "0 8px 24px #7c3aed50",
          }}
        >
          H
        </div>
        <h2 style={{ margin: "0 0 4px", color: "#f1f5f9", fontSize: 20, fontWeight: 700 }}>
          Usuario Hazlo Ahora
        </h2>
        <p style={{ margin: 0, color: "#64748b", fontSize: 13 }}>usuario@hazloahora.com</p>
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
            background: "#7c3aed20",
            border: "1px solid #7c3aed40",
            borderRadius: 20,
            padding: "4px 12px",
            marginTop: 10,
          }}
        >
          <span style={{ color: "#a855f7", fontSize: 12 }}>⭐ Plan Gratis</span>
        </div>
      </div>

      {/* Estadísticas */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 24 }}>
        {[
          { label: "Generaciones usadas", value: "3", icon: "⚡" },
          { label: "Herramientas usadas", value: "2", icon: "🛠️" },
          { label: "Palabras generadas", value: "1.2K", icon: "📝" },
          { label: "Tiempo ahorrado", value: "2h", icon: "⏱️" },
        ].map((stat) => (
          <div
            key={stat.label}
            style={{
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.08)",
              borderRadius: 14,
              padding: 16,
              textAlign: "center",
            }}
          >
            <div style={{ fontSize: 24, marginBottom: 6 }}>{stat.icon}</div>
            <div style={{ color: "#f1f5f9", fontWeight: 700, fontSize: 18 }}>{stat.value}</div>
            <div style={{ color: "#64748b", fontSize: 11, marginTop: 2 }}>{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Menú */}
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {[
          { icon: "👤", label: "Editar perfil", sub: "Nombre, email, foto" },
          { icon: "🔔", label: "Notificaciones", sub: "Gestiona tus alertas" },
          { icon: "🌙", label: "Tema oscuro", sub: "Activo actualmente" },
          { icon: "🔒", label: "Seguridad", sub: "Contraseña y sesiones" },
          { icon: "📦", label: "Mi plan", sub: "Plan Gratis · Actualizar" },
          { icon: "❓", label: "Ayuda y soporte", sub: "FAQ, chat de soporte" },
          { icon: "📜", label: "Términos y privacidad", sub: "Política legal" },
        ].map((item) => (
          <div
            key={item.label}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 14,
              background: "rgba(255,255,255,0.03)",
              border: "1px solid rgba(255,255,255,0.06)",
              borderRadius: 14,
              padding: "14px 16px",
              cursor: "pointer",
              transition: "all 0.2s",
            }}
          >
            <span style={{ fontSize: 20, width: 32, textAlign: "center" }}>{item.icon}</span>
            <div style={{ flex: 1 }}>
              <p style={{ margin: 0, color: "#e2e8f0", fontSize: 14, fontWeight: 500 }}>{item.label}</p>
              <p style={{ margin: 0, color: "#475569", fontSize: 12 }}>{item.sub}</p>
            </div>
            <span style={{ color: "#475569", fontSize: 16 }}>›</span>
          </div>
        ))}

        <button
          style={{
            width: "100%",
            padding: 14,
            background: "rgba(239,68,68,0.08)",
            border: "1px solid rgba(239,68,68,0.2)",
            borderRadius: 14,
            color: "#f87171",
            fontWeight: 600,
            fontSize: 14,
            cursor: "pointer",
            fontFamily: "Inter, sans-serif",
            marginTop: 8,
          }}
        >
          🚪 Cerrar sesión
        </button>
      </div>
    </div>
  );

  // ======================== TABS NAVIGATION ========================
  const tabs = [
    { id: "inicio", label: "Inicio", icon: "🏠" },
    { id: "herramientas", label: "Herramientas", icon: "⚡" },
    { id: "chat", label: "Chat IA", icon: "💬" },
    { id: "planes", label: "Planes", icon: "⭐" },
    { id: "perfil", label: "Perfil", icon: "👤" },
  ];

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#0f0a1e",
        fontFamily: "Inter, sans-serif",
        maxWidth: 480,
        margin: "0 auto",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Fondo decorativo */}
      <div
        style={{
          position: "fixed",
          top: -100,
          right: -100,
          width: 300,
          height: 300,
          borderRadius: "50%",
          background: "radial-gradient(circle, #7c3aed15 0%, transparent 70%)",
          pointerEvents: "none",
          zIndex: 0,
        }}
      />
      <div
        style={{
          position: "fixed",
          bottom: 100,
          left: -80,
          width: 250,
          height: 250,
          borderRadius: "50%",
          background: "radial-gradient(circle, #2563eb10 0%, transparent 70%)",
          pointerEvents: "none",
          zIndex: 0,
        }}
      />

      {/* Contenido principal */}
      <div style={{ position: "relative", zIndex: 1 }}>
        {activeTab === "inicio" && <HomeScreen />}
        {activeTab === "herramientas" && <ToolsScreen />}
        {activeTab === "chat" && <ChatScreen />}
        {activeTab === "planes" && <PlansScreen />}
        {activeTab === "perfil" && <ProfileScreen />}
      </div>

      {/* Bottom Navigation */}
      <nav
        style={{
          position: "fixed",
          bottom: 0,
          left: "50%",
          transform: "translateX(-50%)",
          width: "100%",
          maxWidth: 480,
          background: "rgba(15, 10, 30, 0.95)",
          backdropFilter: "blur(20px)",
          borderTop: "1px solid rgba(255,255,255,0.08)",
          display: "flex",
          justifyContent: "space-around",
          padding: "8px 0 16px",
          zIndex: 100,
        }}
      >
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => {
                if (tab.id === "chat" && !selectedTool) {
                  setActiveTab("herramientas");
                } else {
                  setActiveTab(tab.id);
                }
              }}
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 3,
                padding: "6px 12px",
                borderRadius: 12,
                transition: "all 0.2s",
                position: "relative",
              }}
            >
              {isActive && (
                <div
                  style={{
                    position: "absolute",
                    top: -1,
                    width: 24,
                    height: 3,
                    background: "linear-gradient(90deg, #7c3aed, #a855f7)",
                    borderRadius: "0 0 4px 4px",
                  }}
                />
              )}
              <span
                style={{
                  fontSize: 20,
                  filter: isActive ? "none" : "grayscale(60%) opacity(0.5)",
                  transform: isActive ? "scale(1.1)" : "scale(1)",
                  transition: "all 0.2s",
                }}
              >
                {tab.icon}
              </span>
              <span
                style={{
                  fontSize: 10,
                  color: isActive ? "#a855f7" : "#475569",
                  fontWeight: isActive ? 600 : 400,
                  fontFamily: "Inter, sans-serif",
                }}
              >
                {tab.label}
              </span>
            </button>
          );
        })}
      </nav>

      {/* CSS Animations */}
      <style>{`
        @keyframes bounce {
          0%, 80%, 100% { transform: translateY(0); opacity: 0.4; }
          40% { transform: translateY(-8px); opacity: 1; }
        }
        * { box-sizing: border-box; }
        ::-webkit-scrollbar { display: none; }
        textarea { scrollbar-width: none; }
      `}</style>
    </div>
  );
}