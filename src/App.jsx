import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { FileDown, Send, FileText ,Loader2} from "lucide-react";

const API_URL = import.meta.env.VITE_API_URL;

function App() {
  const [messages, setMessages] = useState([
    {
      id: 1,
      role: "assistant",
      content:
        "Hola 👋 Soy tu asistente financiero. Puedes preguntarme sobre el reporte del segundo trimestre de la fibra Nova 2026.",
    },
  ]);

  const exampleQuestions = [
  {
    title: "Propiedades de Inversión",
    question:
      "¿Cuál fue el valor de las propiedades de inversión al 30 de junio de 2026 según la sección de propiedades de inversión?",
  },
  {
    title: "Ingreso Total",
    question:
      "¿Cuál fue el ingreso total en 2026?",
  },
  {
    title: "Utilidad Neta",
    question: "¿Cuál fue la utilidad neta acumulada en 2026?",
  },
  {
    title: "Efectivo Total",
    question: "¿Cuánto efectivo tenía Fibra Nova al 30 de junio de 2026?",
  },
  {
    title: "Deuda Bancaria",
    question: "¿Cuál era la deuda bancaria al 30 de junio de 2026?",
  },
  {
    title: "Crecimiento",
    question: "¿Cuánto crecieron los ingresos totales respecto a 2025?",
  },
];

  const [input, setInput] = useState("");
const [loading, setLoading] = useState(false);
const sendMessage = async (question = input) => {
  const pregunta = question.trim();

  if (!pregunta || loading) return;

  // Mostrar la pregunta del usuario
  setMessages((prev) => [
    ...prev,
    {
      id: Date.now(),
      role: "user",
      content: pregunta,
    },
  ]);

  setInput("");
  setLoading(true);

  try {
    const response = await fetch(`${API_URL}/preguntar`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        pregunta,
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const data = await response.json();

    console.log("Respuesta del backend:", data);

    // Agregar respuesta del backend
    setMessages((prev) => [
      ...prev,
      {
        id: Date.now() + 1,
        role: "assistant",
        content: data.respuesta,
        sources: data.fuentes ?? [],
      },
    ]);
  } catch (error) {
    console.error("Error consultando API:", error);

    setMessages((prev) => [
      ...prev,
      {
        id: Date.now() + 1,
        role: "assistant",
        content:
          "No pude conectar con el servidor. Verifica que el backend esté disponible.",
        sources: [],
      },
    ]);
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="flex h-screen bg-background text-foreground">
      {/* Sidebar */}
      <aside className="hidden w-64 border-r md:flex md:flex-col">
        <div className="p-4">
          <Button
          className="w-full justify-start gap-2 cursor-pointer"
           onClick={() => {
    window.open("/2026-2T26%20NOVA.pdf", "_blank");
  }}

        >
            <FileDown className="h-4 w-4" />
            Reporte Fibra Nova
          </Button>
        </div>

        <Separator />

        <div className="flex-1 p-4">
          <p className="mb-3 text-xs font-semibold uppercase text-muted-foreground">
            Preguntas Ejemplo
          </p>

          <div className="space-y-1">
          {exampleQuestions.map((item) => (
             <button
    key={item.title}
    type="button"
    onClick={() => {
      console.log("Pregunta seleccionada:", item.question);
      sendMessage(item.question);
    }}
    className="w-full cursor-pointer rounded-lg px-3 py-2 text-left text-sm transition-colors hover:bg-muted"
  >
    {item.title}
  </button>
          ))}
          </div>
        </div>
      </aside>

      {/* Main */}
      <main className="flex min-h-0 min-w-0 flex-1 flex-col">
        {/* Header */}
        <header className="border-b px-6 py-4">
          <h1 className="font-semibold">Financial RAG</h1>
          <p className="text-sm text-muted-foreground">
            Asistente para análisis de reportes financieros
          </p>
        </header>

        {/* Messages */}
       <ScrollArea className="min-h-0 flex-1">
        <div className="mx-auto flex max-w-3xl flex-col gap-6 px-6 py-8">
          {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${
                  message.role === "user"
                    ? "justify-end"
                    : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl px-4 py-3 ${
                    message.role === "user"
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted"
                  }`}
                >
                  <p className="whitespace-pre-wrap text-sm leading-6">
                    {message.content}
                  </p>

                 {message.sources?.length > 0 && (
  <div className="mt-4 border-t pt-3">
    <div className="mb-3 flex items-center gap-2 text-xs font-medium">
      <FileText className="h-4 w-4" />
      Fuentes
    </div>

    <div className="space-y-2">
      {message.sources.map((source, index) => (
        <details
          key={`${source.pagina}-${index}`}
          className="rounded-lg border bg-background/50"
        >
          <summary className="cursor-pointer px-3 py-2 text-xs font-medium">
            Fuente {index + 1} · Página {source.pagina}
          </summary>

          <div className="border-t px-3 py-3">
            <p className="mb-2 text-xs font-medium">
              {source.seccion}
            </p>

            <p className="whitespace-pre-wrap text-xs leading-5 text-muted-foreground">
              {source.texto}
            </p>
          </div>
        </details>
      ))}
    </div>
  </div>
                    )}
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex justify-start">
                <div className="flex items-center gap-2 rounded-2xl bg-muted px-4 py-3 text-sm text-muted-foreground">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Analizando el reporte...
                </div>
              </div>
            )}
          </div>
        </ScrollArea>

        {/* Input */}
       <div className="border-t p-4">
          <div className="mx-auto max-w-3xl">
            <div className="flex items-end gap-2 rounded-2xl border bg-background p-2 shadow-sm">
              <Textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    sendMessage();
                  }
                }}
                placeholder="Pregunta sobre tus reportes..."
                disabled={loading}
                className="min-h-[44px] resize-none border-0 shadow-none focus-visible:ring-0"
              />

              <Button
                size="icon"
                onClick={sendMessage}
                disabled={!input.trim() || loading}
              >
                {loading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
              </Button>
            </div>

            <p className="mt-2 text-center text-xs text-muted-foreground">
              Las respuestas se generan a partir de los documentos indexados.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;