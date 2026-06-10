import express from "express";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Simple in-memory ticket/consultation database
const tickets: any[] = [];

// Gemini Lazy Client helper
let aiInstance: GoogleGenAI | null = null;
function getGeminiClient() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return null;
  }
  if (!aiInstance) {
    aiInstance = new GoogleGenAI({
      apiKey: apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
  }
  return aiInstance;
}

// 1. API Route: AI Diagnosis
app.post("/api/diagnose", async (req, res) => {
  try {
    const { symptoms, customText, chatHistory } = req.body;
    
    const ai = getGeminiClient();
    if (!ai) {
      // Graceful fallback response when GEMINI_API_KEY is not available
      return res.json({
        success: true,
        text: `### ⚠️ Diagnóstico Heurístico de Emergencia (Sin conexión Gemini)

No se ha configurado la API Key de Gemini en los Secretos, por lo que estamos utilizando la base de conocimiento local del Laboratorio de **LyC.Tech**.

**Síntomas reportados:** ${symptoms && symptoms.length > 0 ? symptoms.join(", ") : "Ninguno seleccionado"}.
**Detalle adicional:** ${customText || "No provisto"}.

#### Posible Falla Electrónica Relacionada:
1. **Falta de Video:** Puede deberse a desgaste de pasta térmica, un MOSFET de fase de alimentación en corto que impide la inicialización de la GPU, o pin doblado en el socket LGA/PGA.
2. **Reinicio/Apagado inesperado:** Generalmente causado por elevadas temperaturas en el procesador (puente térmico ineficiente) o VRM defectuosa (módulo regulador de tensión sobrecalentándose).
3. **Falta de Encendido:** Suele radicar en capacitores desvalorizados de la línea de standby (+5V_STB), un corto franco en la línea principal de +12V (EPS CPU / PCIe de GPU) o fuente de alimentación dañada.

#### Recomendaciones Técnicas Inmediatas:
* Realice un **Clear CMOS** drenando toda la energía por 2-3 minutos quitando la pila CR2032 de la placa base.
* Pruebe encender con un único módulo de RAM instalado secuencialmente en cada slot.
* Si nota que la fuente de poder se protege y corta inmediatamente después de parpadear, desconecte los conectores de 8 pines de energía de la CPU o la Placa de Video y pruebe de nuevo. Si entonces no corta, el daño está localizado en la etapa de potencia de ese componente en particular.

*Nuestros laboratorios en Argentina están equipados con instrumental alemán de precisión (osciloscopios de 100MHz, termografos FLIR y microscopios estereo). De requerir micro-soldadura, por favor abra un Ticket en nuestra sección de Contacto.*`,
        isOfflineMode: true
      });
    }

    const promptParts: string[] = [];
    promptParts.push("Eres el Ingeniero de Hardware Jefe de micro-soldadura electrónica y reparación avanzada 'LyC.Tech' en Argentina.");
    promptParts.push("El usuario está experimentando un problema de hardware de PC y necesita un pre-diagnóstico técnico impecable y experto.");
    promptParts.push("\n### Síntomas Seleccionados:");
    if (symptoms && symptoms.length > 0) {
      symptoms.forEach((s: string) => promptParts.push(`- ${s}`));
    } else {
      promptParts.push("- Ninguno seleccionado de lista rápida.");
    }

    if (customText) {
      promptParts.push(`\n### Mensaje descriptivo del cliente:\n"${customText}"`);
    }

    promptParts.push("\n### Estructura de Respuesta Directiva (en Markdown):");
    promptParts.push("1. Saluda con entusiasmo y extrema profesionalidad en español. Menciona que eres el Ingeniero Jefe de LyC.Tech.");
    promptParts.push("2. Explica la termodinámica o electrónica de la falla sugerida (fases de alimentación, cortocircuitos en rieles de tensión de CPU/GPU, capacitancia desfasada, BIOS corrompida por SPI, pines de socket LGA rotos).");
    promptParts.push("3. Brinda 3 pasos metodológicos de descarte seguro.");
    promptParts.push("4. Indica la complejidad del trabajo (Baja / Media / Alta) y si requiere instrumental óptico de soldadura avanzada de LyC.Tech.");
    promptParts.push("5. Sugiere un costo estimado estimado orientativo en pesos argentinos (ARS) razonable.");

    let response;
    
    if (chatHistory && chatHistory.length > 0) {
      const contentsParts: any[] = [];
      contentsParts.push({ role: 'user', parts: [{ text: promptParts.join("\n") }] });
      
      chatHistory.forEach((msg: any) => {
        contentsParts.push({
          role: msg.role === 'user' ? 'user' : 'model',
          parts: [{ text: msg.text }]
        });
      });
      
      response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: contentsParts,
        config: {
          systemInstruction: "Eres el Ingeniero de Hardware Jefe de LyC.Tech, micro-soldador avanzado especializado en revivir placas de video, motherboards, socket pins y CPUs rotas. Ofreces soporte interactivo, empático, en idioma español, respondiendo cortésmente y sugiriendo diagnósticos lógicos paso a paso."
        }
      });
    } else {
      response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: promptParts.join("\n"),
        config: {
          systemInstruction: "Eres el Ingeniero de Hardware Jefe de LyC.Tech, experto en microelectrónica de Argentina. Tu tono debe ser super profesional, con un léxico excelentemente técnico y estructurado en Markdown."
        }
      });
    }

    res.json({
      success: true,
      text: response.text,
      isOfflineMode: false
    });

  } catch (error: any) {
    console.error("Diagnosis error:", error);
    res.status(500).json({
      success: false,
      error: error.message || "Error procesando el diagnóstico inteligente."
    });
  }
});

// 2. API Route: Submit ticket
app.post("/api/tickets", (req, res) => {
  try {
    const { clientName, email, phone, componentType, symptom, notes } = req.body;
    if (!clientName || !email) {
      return res.status(400).json({ error: "El nombre y el correo electrónico son requeridos." });
    }

    const ticketId = `LYC-${Date.now().toString().slice(-6)}`;
    const newTicket = {
      id: ticketId,
      clientName,
      email,
      phone: phone || "No provisto",
      componentType: componentType || "General",
      symptom: symptom || "No especificado",
      notes: notes || "",
      status: "Recibido - Pendiente de Diagnóstico Físico",
      createdAt: new Date().toISOString()
    };

    tickets.push(newTicket);
    res.json({ success: true, ticket: newTicket });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// 3. API Route: List tickets
app.get("/api/tickets", (req, res) => {
  res.json({ success: true, tickets });
});

// Vite middleware integration
async function integrateVite() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "custom",
    });
    app.use(vite.middlewares);

    // Serve index.html dynamically in development with transformation
    app.get("*", async (req, res, next) => {
      if (req.path.startsWith("/api")) {
        return next();
      }
      try {
        const htmlPath = path.resolve(process.cwd(), "index.html");
        let html = fs.readFileSync(htmlPath, "utf-8");
        html = await vite.transformIndexHtml(req.originalUrl, html);
        res.status(200).set({ "Content-Type": "text/html" }).end(html);
      } catch (e: any) {
        vite.ssrFixStacktrace(e);
        next(e);
      }
    });
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running at http://localhost:${PORT} in ${process.env.NODE_ENV || 'development'} mode`);
  });
}

integrateVite();
