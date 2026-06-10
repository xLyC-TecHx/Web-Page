/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import {
  Cpu,
  TrendingUp,
  Search,
  Check,
  AlertCircle,
  Clock,
  Sparkles,
  Send,
  MessageSquare,
  ClipboardList,
  ChevronRight,
  Info,
  DollarSign,
  Plus,
  Minus,
  RefreshCcw,
  Layers,
  Thermometer,
  Shield,
  Zap,
  Wrench
} from "lucide-react";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import { initialProducts, repairServices, caseStudies } from "./data";
import { Product, CartItem, Ticket, ChatMessage } from "./types";

export default function App() {
  // Navigation & Currency/Exchange Rate States
  const [cart, setCart] = useState<CartItem[]>([]);
  const [currencyMode, setCurrencyMode] = useState<"ARS" | "USD">("ARS");
  const [usdRate, setUsdRate] = useState<number>(950);

  // Store filter and search
  const [selectedCategory, setSelectedCategory] = useState<string>("todos");
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Case Studies Inspector selection
  const [selectedCaseId, setSelectedCaseId] = useState<string>(caseStudies[0].id);

  // Dynamic AI Diagnosis state
  const [symptomChecklist, setSymptomChecklist] = useState<string[]>([]);
  const [customDescription, setCustomDescription] = useState<string>("");
  const [diagnosticChat, setDiagnosticChat] = useState<ChatMessage[]>([]);
  const [chatInput, setChatInput] = useState<string>("");
  const [isAiDiagnosing, setIsAiDiagnosing] = useState<boolean>(false);
  const [aiError, setAiError] = useState<string>("");

  // Ticket submittal state
  const [ticketName, setTicketName] = useState<string>("");
  const [ticketEmail, setTicketEmail] = useState<string>("");
  const [ticketPhone, setTicketPhone] = useState<string>("");
  const [ticketComponent, setTicketComponent] = useState<string>("GPU / Placa de Video");
  const [ticketSymptom, setTicketSymptom] = useState<string>("Falta de Video / Sin señal");
  const [ticketNotes, setTicketNotes] = useState<string>("");
  
  // Real active laboratory tickets list
  const [activeTickets, setActiveTickets] = useState<Ticket[]>([]);
  const [isLoadingTickets, setIsLoadingTickets] = useState<boolean>(false);
  const [showNotification, setShowNotification] = useState<{ type: "success" | "info" | "error"; message: string } | null>(null);

  // Load existing tickets on stand-up
  useEffect(() => {
    fetchTickets();
  }, []);

  const fetchTickets = async () => {
    try {
      setIsLoadingTickets(true);
      const res = await fetch("/api/tickets");
      if (res.ok) {
        const data = await res.json();
        if (data.success) {
          setActiveTickets(data.tickets);
        }
      }
    } catch (e) {
      console.error("Error fetching tickets", e);
    } finally {
      setIsLoadingTickets(false);
    }
  };

  const triggerToast = (type: "success" | "info" | "error", message: string) => {
    setShowNotification({ type, message });
    setTimeout(() => setShowNotification(null), 4000);
  };

  // Cart operations
  const handleAddToCart = (product: Product) => {
    const existing = cart.find(item => item.product.id === product.id);
    if (existing) {
      if (existing.quantity >= product.stock) {
        triggerToast("error", `No hay más stock disponible de ${product.name}`);
        return;
      }
      setCart(cart.map(item => 
        item.product.id === product.id 
          ? { ...item, quantity: item.quantity + 1 } 
          : item
      ));
    } else {
      setCart([...cart, { product, quantity: 1 }]);
    }
    triggerToast("success", `¡${product.name} agregado al carrito!`);
  };

  const handleUpdateCartQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      handleRemoveFromCart(productId);
      return;
    }
    const item = cart.find(i => i.product.id === productId);
    if (item && quantity > item.product.stock) {
      triggerToast("error", `Límite de stock alcanzado para ${item.product.name}`);
      return;
    }
    setCart(cart.map(i => i.product.id === productId ? { ...i, quantity } : i));
  };

  const handleRemoveFromCart = (productId: string) => {
    const item = cart.find(i => i.product.id === productId);
    setCart(cart.filter(i => i.product.id !== productId));
    if (item) {
      triggerToast("info", `Removido ${item.product.name} del carrito.`);
    }
  };

  const handleClearCart = () => {
    setCart([]);
  };

  // Currency utility helper
  const renderPrice = (priceArs: number) => {
    if (currencyMode === "ARS") {
      return `$${priceArs.toLocaleString("es-AR")} ARS`;
    } else {
      const priceUsd = priceArs / usdRate;
      return `u$s ${priceUsd.toFixed(2)}`;
    }
  };

  // Fast symptom selector toggle helper
  const handleToggleSymptom = (symptom: string) => {
    if (symptomChecklist.includes(symptom)) {
      setSymptomChecklist(symptomChecklist.filter(s => s !== symptom));
    } else {
      setSymptomChecklist([...symptomChecklist, symptom]);
    }
  };

  // AI Diagnostic launcher
  const handleStartAiDiagnosis = async () => {
    if (symptomChecklist.length === 0 && !customDescription.trim()) {
      triggerToast("error", "Por favor seleccione al menos un síntoma rápido o ingrese su descripción personalizada.");
      return;
    }

    setIsAiDiagnosing(true);
    setAiError("");

    // Setup initial conversation text
    const initMessage: ChatMessage = {
      role: "user",
      text: `Entrada del Diagnóstico:
- Síntomas de hardware detectados: [${symptomChecklist.join(", ")}]
- Descripción personalizada: ${customDescription || "Ninguna adicional registrada."}`,
      timestamp: new Date().toLocaleTimeString("es-AR", { hour: '2-digit', minute: '2-digit' })
    };

    setDiagnosticChat([initMessage]);

    try {
      const response = await fetch("/api/diagnose", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          symptoms: symptomChecklist,
          customText: customDescription
        })
      });

      if (!response.ok) {
        throw new Error("Ocurrió un error al contactar al servidor de diagnóstico de LyC.Tech.");
      }

      const data = await response.json();
      if (data.success) {
        const modelReturn: ChatMessage = {
          role: "model",
          text: data.text,
          timestamp: new Date().toLocaleTimeString("es-AR", { hour: '2-digit', minute: '2-digit' })
        };
        setDiagnosticChat(prev => [...prev, modelReturn]);
        // Scroll slightly down to showcase interactive terminal
        setTimeout(() => {
          document.getElementById("chat-panel-scroll")?.scrollIntoView({ behavior: "smooth" });
        }, 300);
      } else {
        throw new Error(data.error || "Ocurrió una falla procesando el diagnóstico.");
      }
    } catch (e: any) {
      setAiError(e.message || "Falla de red en servidor de microelectrónica.");
      triggerToast("error", "Falla al ejecutar diagnóstico virtual.");
    } finally {
      setIsAiDiagnosing(false);
    }
  };

  // Continue chatting with AI diagnostician
  const handleSendChatMessage = async () => {
    if (!chatInput.trim() || isAiDiagnosing) return;

    const userText = chatInput.trim();
    setChatInput("");

    const newMsg: ChatMessage = {
      role: "user",
      text: userText,
      timestamp: new Date().toLocaleTimeString("es-AR", { hour: '2-digit', minute: '2-digit' })
    };

    const updatedHistory = [...diagnosticChat, newMsg];
    setDiagnosticChat(updatedHistory);
    setIsAiDiagnosing(true);

    try {
      const response = await fetch("/api/diagnose", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          symptoms: symptomChecklist,
          customText: customDescription,
          chatHistory: updatedHistory
        })
      });

      if (!response.ok) {
        throw new Error("El servidor no pudo responder la consulta.");
      }

      const data = await response.json();
      if (data.success) {
        const reply: ChatMessage = {
          role: "model",
          text: data.text,
          timestamp: new Date().toLocaleTimeString("es-AR", { hour: '2-digit', minute: '2-digit' })
        };
        setDiagnosticChat(prev => [...prev, reply]);
        setTimeout(() => {
          const scroller = document.getElementById("chat-terminal-messages");
          if (scroller) {
            scroller.scrollTop = scroller.scrollHeight;
          }
        }, 100);
      } else {
        throw new Error(data.error || "Falla en procesamiento interactivo.");
      }
    } catch (err: any) {
      triggerToast("error", "No se pudo transmitir la respuesta. Intente nuevamente.");
    } finally {
      setIsAiDiagnosing(false);
    }
  };

  // Submit official service ticket
  const handleSubmitTicket = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!ticketName.trim() || !ticketEmail.trim()) {
      triggerToast("error", "El nombre y correo electrónico son de carácter obligatorio.");
      return;
    }

    try {
      const res = await fetch("/api/tickets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          clientName: ticketName,
          email: ticketEmail,
          phone: ticketPhone,
          componentType: ticketComponent,
          symptom: ticketSymptom,
          notes: ticketNotes
        })
      });

      if (res.ok) {
        const data = await res.json();
        if (data.success) {
          triggerToast("success", `¡Ticket de Servicio ${data.ticket.id} creado con éxito!`);
          
          // Reset fields non-essential
          setTicketPhone("");
          setTicketNotes("");
          
          // Re-fetch tickets list
          fetchTickets();
          
          // Scroll list of active tickets into view
          setTimeout(() => {
            document.getElementById("active-lab-tickets")?.scrollIntoView({ behavior: "smooth" });
          }, 350);
        }
      } else {
        const err = await res.json();
        triggerToast("error", err.error || "No se pudo registrar la reparación.");
      }
    } catch (e) {
      triggerToast("error", "Error de red al procesar el ticket de laboratorio.");
    }
  };

  // Pre-fill ticket fields when clicking "Solicitar de forma avanzada" on service list
  const handlePrefillService = (serviceName: string) => {
    setTicketComponent(serviceName);
    setTicketSymptom(`Consulta o reparación referente a: ${serviceName}`);
    setTicketNotes(`Deseo solicitar diagnóstico físico avanzado y cotización precisa para el servicio de: "${serviceName}".`);
    
    // Smooth scroll down to ticket form
    document.getElementById("contacto")?.scrollIntoView({ behavior: "smooth" });
    triggerToast("info", `¡Formulario de ticket configurado para: ${serviceName}!`);
  };

  // Quick categories and items list
  const filteredProducts = initialProducts.filter(item => {
    const matchCat = selectedCategory === "todos" || item.category === selectedCategory;
    const matchSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                        item.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCat && matchSearch;
  });

  const activeCase = caseStudies.find(c => c.id === selectedCaseId) || caseStudies[0];

  return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-emerald-500 selection:text-black">
      
      {/* Navigation Bar */}
      <Navbar
        cart={cart}
        onUpdateCartQuantity={handleUpdateCartQuantity}
        onRemoveFromCart={handleRemoveFromCart}
        onClearCart={handleClearCart}
        currencyMode={currencyMode}
        setCurrencyMode={setCurrencyMode}
        usdRate={usdRate}
        setUsdRate={setUsdRate}
      />

      {/* Hero Header Space */}
      <Hero />

      {/* Main Container Grid */}
      <main className="max-w-7xl mx-auto px-4 py-12 md:py-16 space-y-24">

        {/* 1. SECCIÓN TIENDA ONLINE */}
        <section id="tienda" className="scroll-mt-20">
          <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-zinc-800 pb-6 mb-8 gap-4">
            <div>
              <div className="flex items-center gap-2 text-emerald-400 font-mono text-xs tracking-widest uppercase mb-1">
                <TrendingUp className="h-4 w-4" /> Hardware Original Garantizado
              </div>
              <h2 className="text-3xl md:text-4xl font-extrabold font-mono tracking-tight">
                Tienda Online
              </h2>
            </div>

            {/* In-Store Live Conversion Gauge */}
            <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-3 flex flex-wrap items-center gap-3 text-xs max-w-sm">
              <span className="font-mono text-zinc-400">Cotización Ticker:</span>
              <div className="flex items-center gap-1.5 bg-zinc-900 border border-emerald-500/10 px-2 py-1 rounded">
                <span className="text-zinc-500 font-mono text-[10px]">1 USD = </span>
                <input
                  type="number"
                  value={usdRate}
                  onChange={(e) => {
                    const val = parseFloat(e.target.value);
                    if (!isNaN(val) && val > 0) setUsdRate(val);
                  }}
                  className="w-14 bg-transparent border-none text-emerald-400 font-mono font-bold focus:outline-none p-0 text-center"
                />
                <span className="text-zinc-400 font-mono">ARS</span>
              </div>
              <p className="text-zinc-500 text-[10px] w-full mt-1.5 font-mono">
                * Cambio oficial banco de referencia para facturaciones mixtas.
              </p>
            </div>
          </div>

          {/* Filters Bar & Search Engine */}
          <div className="flex flex-col md:flex-row gap-4 justify-between items-center mb-8">
            {/* Category tabs */}
            <div className="flex flex-wrap gap-2 w-full md:w-auto">
              {[
                { label: "Todo el catálogo", value: "todos" },
                { label: "CPU / Silicios", value: "procesadores" },
                { label: "Placas de Video", value: "videos" },
                { label: "Discos / RAM", value: "almacenamiento" },
                { label: "Motherboards", value: "motherboards" },
              ].map((cat) => (
                <button
                  key={cat.value}
                  onClick={() => setSelectedCategory(cat.value)}
                  className={`px-4 py-2 rounded-lg text-xs font-bold font-mono tracking-wide transition-all ${
                    selectedCategory === cat.value
                      ? "bg-emerald-500 text-black shadow-[0_0_12px_rgba(16,185,129,0.25)]"
                      : "bg-zinc-950 border border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-700"
                  }`}
                >
                  {cat.label.toUpperCase()}
                </button>
              ))}
            </div>

            {/* Real Search bar input */}
            <div className="relative w-full md:w-80">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Buscar silicio o componente..."
                className="w-full bg-zinc-950 border border-zinc-800 rounded-lg pl-10 pr-4 py-2 text-sm text-zinc-200 placeholder-zinc-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500"
              />
              <Search className="absolute left-3.5 top-2.5 h-4 w-4 text-zinc-500" />
            </div>
          </div>

          {/* Products Grid */}
          {filteredProducts.length === 0 ? (
            <div className="bg-zinc-950 border border-dashed border-zinc-800 py-16 text-center text-zinc-500 rounded-xl">
              <Cpu className="h-10 w-10 mx-auto stroke-[1.2] mb-3 text-zinc-600" />
              <p className="font-mono text-sm">No encontramos componentes activos con el criterio buscado.</p>
              <button
                onClick={() => {
                  setSelectedCategory("todos");
                  setSearchQuery("");
                }}
                className="mt-4 text-xs font-mono text-emerald-400 hover:underline"
              >
                Limpiar filtros de búsqueda
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map((p) => (
                <div
                  key={p.id}
                  className="group bg-zinc-950 border border-zinc-800 rounded-xl overflow-hidden hover:border-emerald-500/40 transition-all flex flex-col hover:shadow-[0_0_20px_rgba(16,185,129,0.05)]"
                >
                  {/* Image space inside safe sandbox */}
                  <div className="relative aspect-video bg-zinc-900 border-b border-zinc-800 overflow-hidden">
                    <img
                      src={p.imageUrl}
                      alt={p.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      referrerPolicy="no-referrer"
                    />
                    <span className="absolute top-2.5 right-2.5 bg-black/85 border border-emerald-500/30 text-emerald-400 text-[10px] font-mono px-2 py-0.5 rounded-full uppercase tracking-wider">
                      {p.category}
                    </span>
                  </div>

                  {/* Component Info */}
                  <div className="p-5 flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="text-lg font-bold text-white group-hover:text-emerald-400 transition-colors font-mono">
                        {p.name}
                      </h3>
                      <p className="text-zinc-400 text-xs mt-2 line-clamp-2 leading-relaxed">
                        {p.description}
                      </p>

                      {/* Specs pills */}
                      <div className="mt-4 space-y-1">
                        {p.specs.map((spec, i) => (
                          <div key={i} className="flex items-center gap-1.5 text-[11px] text-zinc-500">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500/60" />
                            <span className="font-mono truncate">{spec}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="mt-6 pt-4 border-t border-zinc-900/80 flex items-center justify-between">
                      <div>
                        {/* Interactive price */}
                        <div className="text-emerald-400 font-mono font-bold text-xl">
                          {renderPrice(p.priceArs)}
                        </div>
                        <div className="text-[10px] text-zinc-500 font-mono mt-0.5 uppercase tracking-wide">
                          {p.stock > 0 ? `Stock: ${p.stock} unidades` : "Sin stock disponible"}
                        </div>
                      </div>

                      <button
                        onClick={() => handleAddToCart(p)}
                        disabled={p.stock === 0}
                        className="px-4 py-2 bg-zinc-900 hover:bg-emerald-500 border border-emerald-500/30 hover:border-emerald-600 text-emerald-400 hover:text-black font-bold font-mono text-xs rounded transition-all cursor-pointer disabled:bg-zinc-950 disabled:border-zinc-800 disabled:text-zinc-600 disabled:cursor-not-allowed"
                      >
                        AGREGAR
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* 2. SECCIÓN SERVICIOS TÉCNICOS */}
        <section id="servicios" className="scroll-mt-20">
          <div className="border-b border-zinc-800 pb-6 mb-8">
            <div className="flex items-center gap-2 text-emerald-400 font-mono text-xs tracking-widest uppercase mb-1">
              <Layers className="h-4 w-4 animate-pulse" /> Laboratorio de Alta Precisión
            </div>
            <h2 className="text-3xl md:text-4xl font-extrabold font-mono tracking-tight">
              Servicios Técnicos de Laboratorio
            </h2>
            <p className="text-zinc-400 text-sm mt-2 max-w-xl">
              Nuestras reparaciones a nivel componente electrónico salvan placas declaradas &quot;sin arreglo&quot; realizándose en cabinas seguras contra descargas electroestáticas (ESD).
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {repairServices.map((srv) => (
              <div
                key={srv.id}
                className="bg-zinc-950 border-2 border-zinc-900 rounded-xl p-6 hover:border-emerald-500/20 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex justify-between items-start flex-wrap gap-2 mb-3">
                    <h3 className="text-xl font-bold text-white font-mono flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full bg-emerald-400" />
                      {srv.name}
                    </h3>

                    {/* Complexity badge */}
                    <span
                      className={`px-2.5 py-0.5 rounded text-[10px] font-mono uppercase tracking-widest border ${
                        srv.complexity === "Crítica"
                          ? "bg-red-500/10 border-red-500/40 text-red-400"
                          : srv.complexity === "Alta"
                          ? "bg-amber-500/10 border-amber-500/40 text-amber-400"
                          : "bg-emerald-500/10 border-emerald-500/40 text-emerald-400"
                      }`}
                    >
                      Complejidad: {srv.complexity}
                    </span>
                  </div>

                  <p className="text-zinc-400 text-sm leading-relaxed mb-6">
                    {srv.description}
                  </p>

                  {/* Technical specifics list */}
                  <div className="bg-zinc-900/60 rounded-lg p-4 mb-6 border border-zinc-900">
                    <span className="text-[11px] font-mono uppercase text-zinc-500 tracking-wider block mb-2">
                      Tareas Incluidas por Protocolo:
                    </span>
                    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-zinc-300 font-mono">
                      {srv.detailedSpecs.map((spec, i) => (
                        <li key={i} className="flex items-start gap-1.5">
                          <Check className="h-3 w-3 mt-0.5 text-emerald-400 shrink-0" />
                          <span className="truncate">{spec}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 items-center justify-between pt-4 border-t border-zinc-900">
                  <div className="flex items-center gap-6 w-full sm:w-auto text-left justify-between sm:justify-start">
                    <div>
                      <span className="text-[10px] text-zinc-500 font-mono block uppercase">Base Estimada ARS</span>
                      <span className="text-emerald-400 font-mono font-bold text-base">
                        {renderPrice(srv.basePriceArs)}
                      </span>
                    </div>

                    <div className="border-l border-zinc-800 pl-4">
                      <span className="text-[10px] text-zinc-500 font-mono block uppercase">Tiempo Estimado</span>
                      <span className="text-zinc-300 text-sm font-semibold font-mono flex items-center gap-1 mt-0.5">
                        <Clock className="h-3.5 w-3.5 text-emerald-500" /> {srv.duration}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => handlePrefillService(srv.name)}
                    className="w-full sm:w-auto px-4 py-2 bg-emerald-500/10 border border-emerald-500/30 hover:bg-emerald-500 hover:text-black text-emerald-400 font-bold font-mono text-xs rounded transition-all cursor-pointer"
                  >
                    SOLICITAR PRESUPUESTO
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 3. SECCIÓN CASOS REALES (SLIDER/GALLERY) */}
        <section id="casos" className="scroll-mt-20">
          <div className="border-b border-zinc-800 pb-6 mb-8">
            <div className="flex items-center gap-2 text-emerald-400 font-mono text-xs tracking-widest uppercase mb-1">
              <Thermometer className="h-4 w-4 animate-bounce" /> Historial de Quirófano
            </div>
            <h2 className="text-3xl md:text-4xl font-extrabold font-mono tracking-tight">
              Casos Reales Examinados
            </h2>
            <p className="text-zinc-400 text-sm mt-2 max-w-xl">
              Nuestra mesa de trabajo microelectrónica bajo el microscópico trinocular. Seleccione un caso de éxito técnico para inspeccionar el informe pericial.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Case selector grid (left column) */}
            <div className="lg:col-span-5 space-y-4">
              {caseStudies.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setSelectedCaseId(item.id)}
                  className={`w-full text-left p-5 border rounded-xl transition-all flex gap-4 ${
                    selectedCaseId === item.id
                      ? "bg-zinc-950 border-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.08)]"
                      : "bg-zinc-950/40 border-zinc-900 hover:border-zinc-800 hover:bg-zinc-950"
                  }`}
                >
                  <div className="bg-zinc-900 border border-zinc-800 w-12 h-12 rounded-lg flex items-center justify-center font-mono font-bold text-lg shrink-0 text-emerald-400">
                    {item.difficulty === "Extrema" ? "!!!" : "!!"}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] uppercase font-mono tracking-wider text-emerald-400/80 bg-emerald-500/10 px-1.5 py-0.5 rounded">
                        {item.difficulty}
                      </span>
                    </div>
                    <h3 className="text-sm font-bold text-white mt-1.5 font-mono">{item.title}</h3>
                    <p className="text-zinc-500 text-xs font-sans mt-1 line-clamp-1">
                      {item.description}
                    </p>
                  </div>
                </button>
              ))}
            </div>

            {/* Selected case detail screen (right column) */}
            <div className="lg:col-span-7 bg-zinc-950 border border-zinc-800 rounded-xl p-6 md:p-8 space-y-6">
              <div className="flex justify-between items-center border-b border-zinc-900 pb-4">
                <div>
                  <h3 className="text-xl font-bold text-white font-mono">
                    {activeCase.title}
                  </h3>
                  <span className="text-xs text-zinc-500 font-mono block mt-1">
                    Informe Técnico de Laboratorio / Diagnóstico de Circuito Electrónico
                  </span>
                </div>
              </div>

              {/* Slider comparative visuals (Side by side) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="relative group rounded-lg overflow-hidden border border-zinc-800 bg-zinc-900 aspect-video">
                  <div className="absolute top-2 left-2 bg-black/85 border border-red-500/40 text-red-400 text-[10px] font-mono px-2 py-0.5 rounded z-10">
                    ESTADO INICIAL / DAÑADO
                  </div>
                  <img
                    src={activeCase.beforeImage}
                    alt="Antes"
                    className="w-full h-full object-cover filter saturate-50 group-hover:scale-105 transition-transform"
                    referrerPolicy="no-referrer"
                  />
                </div>

                <div className="relative group rounded-lg overflow-hidden border border-zinc-800 bg-zinc-900 aspect-video">
                  <div className="absolute top-2 left-2 bg-black/85 border border-emerald-500/40 text-emerald-400 text-[10px] font-mono px-2 py-0.5 rounded z-10">
                    RECONSTRUIDO EN LABORATORIO
                  </div>
                  <img
                    src={activeCase.afterImage}
                    alt="Después"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    referrerPolicy="no-referrer"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="text-xs uppercase font-mono tracking-widest text-emerald-400">
                  Resumen de la Falla:
                </h4>
                <p className="text-zinc-300 text-sm leading-relaxed font-sans">
                  {activeCase.description}
                </p>

                <div className="bg-zinc-900 p-4 rounded-lg border border-zinc-800 space-y-2">
                  <h5 className="text-[11px] font-mono uppercase text-zinc-400 flex items-center gap-1.5">
                    <Sparkles className="h-3.5 w-3.5 text-emerald-400" /> Análisis Microscópico del Ingeniero:
                  </h5>
                  <p className="text-xs text-zinc-300 font-mono leading-relaxed bg-black/40 p-3.5 rounded border border-zinc-950 select-text">
                    &quot;{activeCase.microscopeAnalysis}&quot;
                  </p>
                </div>
              </div>

              <div className="text-[11px] font-mono text-zinc-600 flex items-center gap-1.5 pt-4 border-t border-zinc-900">
                <Info className="h-3.5 w-3.5" /> Las capturas microscópicas se almacenan en el historial médico del silicio para futuras validaciones de garantía oficial de LyC.Tech.
              </div>
            </div>
          </div>
        </section>

        {/* 4. SECCIÓN DIAGNÓSTICO EN TIEMPO REAL CON INTELIGENCIA ARTIFICIAL (GEMINI CLIENT) */}
        <section id="diagnostico" className="scroll-mt-20">
          <div className="border-b border-zinc-800 pb-6 mb-8">
            <div className="flex items-center gap-2 text-emerald-400 font-mono text-xs tracking-widest uppercase mb-1">
              <Sparkles className="h-4 w-4 animate-spin-slow text-emerald-300" /> Motor de Diagnóstico Virtual
            </div>
            <h2 className="text-3xl md:text-4xl font-extrabold font-mono tracking-tight">
              Pre-Diagnóstico Técnico Inteligente
            </h2>
            <p className="text-zinc-400 text-sm mt-2 max-w-xl">
              Seleccione los síntomas físicos de su máquina para que nuestro **Asistente Inteligente Supervisor de Hardware** elabore un informe pericial e interactúe con usted de forma técnica inmediata.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
            {/* Inputs Column */}
            <div className="lg:col-span-5 bg-zinc-950 border border-zinc-800 rounded-xl p-6 flex flex-col justify-between space-y-6">
              <div>
                <span className="text-xs uppercase font-mono tracking-wider text-emerald-400 block mb-3">
                  Paso 1: Síntomas Físicos Rápidos
                </span>

                <div className="grid grid-cols-1 gap-2.5">
                  {[
                    "No da video / Pantalla negra",
                    "Cuelgues, apagados repentinos o reinicios intermitentes",
                    "Saturación de temperatura / Sobrecalentamiento inmediato",
                    "Inestabilidad con la GPU en carga gráfica",
                    "Cero alimentación de corriente general / No enciende",
                    "Canal de memoria RAM inactivo (Dual Channel fallido)",
                  ].map((sym) => {
                    const isSelected = symptomChecklist.includes(sym);
                    return (
                      <button
                        key={sym}
                        type="button"
                        onClick={() => handleToggleSymptom(sym)}
                        className={`flex items-center text-left gap-3 p-3.5 rounded-lg border text-xs font-mono transition-all ${
                          isSelected
                            ? "bg-emerald-500/10 border-emerald-500 text-emerald-400"
                            : "bg-zinc-900/40 border-zinc-800 text-zinc-400 hover:border-zinc-700"
                        }`}
                      >
                        <div
                          className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 ${
                            isSelected ? "border-emerald-500 bg-emerald-500 text-black" : "border-zinc-700"
                          }`}
                        >
                          {isSelected && <Check className="h-3 w-3 stroke-[3]" />}
                        </div>
                        {sym}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="text-xs uppercase font-mono tracking-wider text-emerald-400 block mb-2">
                  Paso 2: Comportamiento o Historia Personalizada
                </label>
                <textarea
                  value={customDescription}
                  onChange={(e) => setCustomDescription(e.target.value)}
                  placeholder="Ej: Intenté armar la PC nueva y doblé un pin del socket AM5 de Ryzen de reojo... o el disipador AIO chorreó refrigerante líquido sobre el slot PCIe secundario..."
                  rows={4}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-3 text-xs text-zinc-100 placeholder-zinc-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 uppercase-control"
                />
              </div>

              <button
                onClick={handleStartAiDiagnosis}
                disabled={isAiDiagnosing}
                className="w-full bg-emerald-500 hover:bg-emerald-600 disabled:bg-zinc-800 text-black font-bold font-mono tracking-wider text-sm py-3.5 rounded-lg transition-all shadow-[0_0_20px_rgba(16,185,129,0.15)] flex items-center justify-center gap-2 cursor-pointer disabled:text-zinc-500"
              >
                {isAiDiagnosing ? (
                  <>
                    <RefreshCcw className="h-4 w-4 animate-spin" /> PROCESANDO SILICIOS...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4" /> GENERAR INFORME DE FASES POR IA
                  </>
                )}
              </button>
            </div>

            {/* AI Diagnosis Live Terminal output column */}
            <div id="chat-panel-scroll" className="lg:col-span-7 bg-zinc-950 border border-emerald-500/20 rounded-xl flex flex-col justify-between overflow-hidden shadow-[inset_0_0_25px_rgba(0,0,0,0.8)]">
              {/* Terminal Title Bar */}
              <div className="bg-zinc-900/80 border-b border-zinc-800/80 px-5 py-3 flex justify-between items-center">
                <div className="flex items-center gap-2 text-xs font-mono font-bold tracking-wider text-white">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                  CONSOLA DE INFORME TÉCNICO INTERACTIVO V2.5
                </div>

                <div className="flex gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-red-500" />
                  <span className="w-2 h-2 rounded-full bg-yellow-500" />
                  <span className="w-2 h-2 rounded-full bg-green-500" />
                </div>
              </div>

              {/* Chat Interface logs container */}
              <div
                id="chat-terminal-messages"
                className="p-5 flex-1 min-h-[380px] max-h-[460px] overflow-y-auto space-y-4 font-mono text-xs text-zinc-300 select-text"
              >
                {diagnosticChat.length === 0 ? (
                  <div className="h-full flex flex-col justify-center items-center text-center text-zinc-500 py-12 px-6">
                    <MessageSquare className="h-10 w-10 text-zinc-700 stroke-[1.2] mb-3" />
                    <p className="max-w-md">
                      La consola está ociosa. Seleccione sus síntomas en el panel de la izquierda y presione **&quot;Generar Informe de Fases&quot;** para levantar la placa al osciloscopio virtual.
                    </p>
                  </div>
                ) : (
                  diagnosticChat.map((msg, idx) => (
                    <div
                      key={idx}
                      className={`flex flex-col max-w-[85%] ${
                        msg.role === "user" ? "ml-auto items-end" : "mr-auto items-start"
                      }`}
                    >
                      <span className="text-[9px] text-zinc-600 mb-1">
                        {msg.role === "user" ? "USUARIO" : "INGENIERO JEFE (AI)"} • {msg.timestamp}
                      </span>
                      <div
                        className={`p-3.5 rounded-lg border leading-relaxed select-text ${
                          msg.role === "user"
                            ? "bg-zinc-900 border-zinc-800 text-emerald-400 text-right whitespace-pre-wrap"
                            : "bg-black border-emerald-500/20 text-zinc-300 whitespace-pre-line prose-invert"
                        }`}
                      >
                        {msg.text}
                      </div>
                    </div>
                  ))
                )}

                {isAiDiagnosing && (
                  <div className="flex items-center gap-2 text-emerald-400/80 animate-pulse">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                    Examinando componentes SMT y midiendo impedancias con sonda virtual de silicio...
                  </div>
                )}

                {aiError && (
                  <div className="flex items-center gap-2 text-red-400 border border-red-500/10 bg-red-500/5 p-3 rounded-lg">
                    <AlertCircle className="h-4 w-4 shrink-0" />
                    <span>Error de hardware analítico: {aiError}</span>
                  </div>
                )}
              </div>

              {/* Chat Input message block (enabled once chat has started) */}
              <div className="p-4 bg-zinc-900/60 border-t border-zinc-800/80 flex items-center gap-3">
                <input
                  type="text"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleSendChatMessage();
                  }}
                  disabled={diagnosticChat.length === 0 || isAiDiagnosing}
                  placeholder={
                    diagnosticChat.length === 0
                      ? "Inicie el primer informe arriba antes de chatear..."
                      : "Escriba detalles extras (ej: Marca y modelo de la fuente, tensión, etc.)"
                  }
                  className="flex-1 bg-black border border-zinc-800 rounded-lg px-3 py-2 text-xs text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-emerald-500/60 font-mono disabled:opacity-50 disabled:cursor-not-allowed"
                />
                <button
                  type="button"
                  onClick={handleSendChatMessage}
                  disabled={diagnosticChat.length === 0 || isAiDiagnosing || !chatInput.trim()}
                  className="p-2.5 bg-emerald-500 text-black hover:bg-emerald-600 rounded-lg transition-all focus:outline-none disabled:bg-zinc-800 disabled:text-zinc-650 disabled:cursor-not-allowed"
                >
                  <Send className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* 4.5 MIS TICKETS DE SERVICIO EN VIVO (DYNAMIC RETRIEVAL BOARD) */}
        <section id="active-lab-tickets" className="scroll-mt-20">
          <div className="border-b border-zinc-800 pb-6 mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-emerald-400 font-mono text-xs tracking-widest uppercase mb-1">
                <ClipboardList className="h-4 w-4" /> Seguimiento en Vivo
              </div>
              <h2 className="text-3xl md:text-4xl font-extrabold font-mono tracking-tight">
                Tablero de Diagnósticos en Laboratorio
              </h2>
            </div>

            <button
              onClick={fetchTickets}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-zinc-900 border border-zinc-800 hover:border-emerald-500/20 text-xs text-zinc-400 hover:text-emerald-400 rounded-lg font-mono transition-all self-start sm:self-center cursor-pointer"
            >
              <RefreshCcw className={`h-3 w-3 ${isLoadingTickets ? "animate-spin" : ""}`} /> Actualizar Tablero
            </button>
          </div>

          {isLoadingTickets && activeTickets.length === 0 ? (
            <div className="py-12 text-center text-zinc-500 font-mono text-xs animate-pulse">
              Consultando base de datos de microelectrónica de LyC.Tech...
            </div>
          ) : activeTickets.length === 0 ? (
            <div className="bg-zinc-950 border border-zinc-900/60 rounded-xl p-8 text-center text-zinc-500">
              <ClipboardList className="h-10 w-10 mx-auto stroke-[1.2] mb-3 text-zinc-700" />
              <p className="font-mono text-xs">No hay tickets levantados para este navegador en este momento.</p>
              <p className="text-[11px] font-sans text-zinc-600 mt-1">Completa el formulario de contacto para registrar una reparación en línea.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {activeTickets.map((t) => (
                <div
                  key={t.id}
                  className="bg-zinc-950 border-2 border-zinc-900 rounded-xl p-5 hover:border-emerald-500/40 transition-all flex flex-col justify-between"
                >
                  <div className="space-y-4">
                    <div className="flex justify-between items-center border-b border-zinc-900 pb-3">
                      <span className="text-sm font-bold font-mono text-emerald-400">
                        {t.id}
                      </span>
                      <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 animate-pulse">
                        {t.status}
                      </span>
                    </div>

                    <div className="space-y-1">
                      <span className="text-[10px] text-zinc-500 uppercase font-mono block">Equipo / Componente</span>
                      <p className="text-sm font-semibold text-white font-mono">{t.componentType}</p>
                    </div>

                    <div className="space-y-1">
                      <span className="text-[10px] text-zinc-500 uppercase font-mono block">Sintomatología</span>
                      <p className="text-xs text-zinc-300 font-mono truncate">{t.symptom}</p>
                    </div>

                    {t.notes && (
                      <div className="space-y-1 bg-zinc-900/60 p-2.5 rounded border border-zinc-900 text-[11px] font-sans text-zinc-400 leading-relaxed italic max-h-24 overflow-y-auto">
                        &quot;{t.notes}&quot;
                      </div>
                    )}
                  </div>

                  <div className="mt-5 pt-3.5 border-t border-zinc-900 text-[10px] font-mono text-zinc-500 flex justify-between">
                    <span>{t.clientName}</span>
                    <span>{new Date(t.createdAt).toLocaleDateString("es-AR")}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* 5. SECCIÓN CONTACTO / INGRESO DE TICKETS */}
        <section id="contacto" className="scroll-mt-20">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            {/* Contact text context (left) */}
            <div className="lg:col-span-5 space-y-6">
              <div>
                <span className="text-emerald-400 font-mono text-xs tracking-widest uppercase block mb-1">
                  Mesa de Entrada Autorizada
                </span>
                <h2 className="text-3xl md:text-4xl font-extrabold font-mono tracking-tight">
                  Registro de Ingreso Físico
                </h2>
              </div>

              <p className="text-zinc-400 text-sm leading-relaxed">
                ¿Posee una placa base muerta, procesador doblado o placa de video con artifacts? Registre los datos del dispositivo para organizar el ingreso a nuestro laboratorio técnico. Recibirá un código oficial interactivo del sistema para realizar el seguimiento inmediato.
              </p>

              {/* Lab details overview */}
              <div className="bg-zinc-950 border border-zinc-850 rounded-xl p-5 space-y-4">
                <h4 className="text-xs font-mono uppercase text-emerald-400 font-bold tracking-wider">
                  Especificaciones del Taller:
                </h4>

                <div className="space-y-3 text-xs font-mono text-zinc-300">
                  <div className="flex items-center gap-2">
                    <Shield className="h-4 w-4 text-emerald-500 shrink-0" />
                    <span>Certificación ESD Safe (Norma ANSI/ESD S20.20)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Zap className="h-4 w-4 text-emerald-500 shrink-0" />
                    <span>Fuentes Programables DC de precisión para inyección de tensión</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Wrench className="h-4 w-4 text-emerald-500 shrink-0" />
                    <span>Estaciones de Soldado de aire caliente y micro-calefactores SMT</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Form layout (right) */}
            <div className="lg:col-span-7 bg-zinc-950 border border-zinc-800 rounded-xl p-6 md:p-8">
              <h3 className="text-lg font-bold font-mono text-white mb-6 flex items-center gap-2">
                <ClipboardList className="h-5 w-5 text-emerald-400" />
                Formulario de Orden de Reparación Virtual
              </h3>

              <form onSubmit={handleSubmitTicket} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-mono uppercase tracking-wider text-zinc-400 block">
                      Nombre Completo
                    </label>
                    <input
                      type="text"
                      required
                      value={ticketName}
                      onChange={(e) => setTicketName(e.target.value)}
                      placeholder="Ej: Marcelo Salsedo"
                      className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-2 text-sm text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-emerald-500 uppercase-control"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[11px] font-mono uppercase tracking-wider text-zinc-400 block">
                      Correo Electrónico
                    </label>
                    <input
                      type="email"
                      required
                      value={ticketEmail}
                      onChange={(e) => setTicketEmail(e.target.value)}
                      placeholder="nombre@correo.com"
                      className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-2 text-sm text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-emerald-500 uppercase-control"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-mono uppercase tracking-wider text-zinc-400 block">
                      WhatsApp o Teléfono de contacto
                    </label>
                    <input
                      type="tel"
                      value={ticketPhone}
                      onChange={(e) => setTicketPhone(e.target.value)}
                      placeholder="+54 9 11 1234-5678"
                      className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-2 text-sm text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-emerald-500 uppercase-control"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[11px] font-mono uppercase tracking-wider text-zinc-400 block">
                      Clasificación del Componente
                    </label>
                    <select
                      value={ticketComponent}
                      onChange={(e) => setTicketComponent(e.target.value)}
                      className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-2 text-sm text-zinc-100 focus:outline-none focus:border-emerald-500 font-mono"
                    >
                      <option>GPU / Placa de Video</option>
                      <option>CPU / Socket pins doblados</option>
                      <option>Motherboard / Desktop / Notebook</option>
                      <option>Memoria RAM / Almacenamiento SSD</option>
                      <option>Fuente de Alimentación de alta gama</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[11px] font-mono uppercase tracking-wider text-zinc-400 block">
                    Breve descripción de los síntomas
                  </label>
                  <input
                    type="text"
                    required
                    value={ticketSymptom}
                    onChange={(e) => setTicketSymptom(e.target.value)}
                    placeholder="Ej: Tira artifacts luego de 10 min de juego o vuela disipador a 100°C"
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-2 text-sm text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-emerald-500 uppercase-control"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[11px] font-mono uppercase tracking-wider text-zinc-400 block">
                    Notas adicionales (antecedentes de overclocking, mojaduras o intentos de reparaciones previas)
                  </label>
                  <textarea
                    value={ticketNotes}
                    onChange={(e) => setTicketNotes(e.target.value)}
                    placeholder="Escriba antecedentes relevantes..."
                    rows={4}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-3 text-xs text-zinc-100 placeholder-zinc-650 focus:outline-none focus:ring-1 focus:ring-emerald-500 uppercase-control"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-emerald-500 hover:bg-emerald-600 text-black font-bold font-mono tracking-widest text-xs py-3.5 rounded-lg transition-all shadow-[0_0_15px_rgba(16,185,129,0.15)] flex items-center justify-center gap-2 cursor-pointer mt-4"
                >
                  REGISTRAR INGRESO EN BASE DE DATOS <ChevronRight className="h-4 w-4" />
                </button>
              </form>
            </div>
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer className="bg-zinc-950 border-t border-zinc-900 text-zinc-500 py-12 px-4 mt-24 text-sm font-mono text-center">
        <div className="max-w-7xl mx-auto space-y-4">
          <p className="font-bold text-white tracking-wider text-base">LyC.Tech</p>
          <p className="text-xs max-w-md mx-auto leading-relaxed text-zinc-400">
            Laboratorio microelectrónico especializado en reparación de silicios y restauración de pistas multicapa. Argentina, {new Date().getFullYear()}.
          </p>
          <div className="flex justify-center gap-6 text-xs text-zinc-500 pt-3">
            <span>Lab: ESD Safe Certified</span>
            <span>Est. BNA: u$s oficial</span>
            <span>Ref: 24h stress test</span>
          </div>
          <p className="text-[10px] text-zinc-605 pt-6">
            © {new Date().getFullYear()} LyC.Tech. Todos los derechos reservados.
          </p>
        </div>
      </footer>

      {/* TOAST SYSTEM */}
      {showNotification && (
        <div className="fixed bottom-6 right-6 z-50 animate-bounce-short">
          <div
            className={`p-4 rounded-xl border-2 flex items-center gap-3 shadow-2xl text-white ${
              showNotification.type === "success"
                ? "bg-zinc-950 border-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.15)]"
                : showNotification.type === "error"
                ? "bg-zinc-950 border-red-500 shadow-[0_0_20px_rgba(239,68,68,0.15)]"
                : "bg-zinc-950 border-blue-500 shadow-[0_0_20px_rgba(59,130,246,0.15)]"
            }`}
          >
            <div
              className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-sm ${
                showNotification.type === "success"
                  ? "bg-emerald-500/15 text-emerald-400"
                  : showNotification.type === "error"
                  ? "bg-red-500/15 text-red-400"
                  : "bg-blue-500/15 text-blue-400"
              }`}
            >
              i
            </div>
            <p className="text-xs font-mono font-medium max-w-sm">
              {showNotification.message}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
