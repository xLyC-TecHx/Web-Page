import { motion } from "motion/react";
import { Cpu, ShieldAlert, BadgeDollarSign, ChevronDown } from "lucide-react";

export default function Hero() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 100 }
    }
  };

  return (
    <section className="relative min-h-[550px] md:min-h-[640px] flex flex-col justify-center items-center text-center px-4 overflow-hidden bg-black py-16">
      {/* High-tech matrix cyber grid background */}
      <div className="absolute inset-0 z-0 bg-[radial-gradient(circle_at_center,rgba(16,185,129,0.08)_0%,transparent_70%)]" />
      <div className="absolute inset-0 z-0 opacity-[0.03] bg-[linear-gradient(to_right,#808080_1px,transparent_1px),linear-gradient(to_bottom,#808080_1px,transparent_1px)] bg-[size:24px_24px]" />
      
      {/* Floating circuit lines or neon nodes */}
      <div className="absolute top-20 left-10 w-48 h-48 bg-emerald-500/10 rounded-full blur-[100px] animate-pulse" />
      <div className="absolute bottom-20 right-10 w-64 h-64 bg-emerald-400/10 rounded-full blur-[130px] animate-pulse" />

      {/* Hero Outer Wrapper */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative z-10 max-w-4xl max-w-7xl mx-auto flex flex-col items-center gap-6"
      >
        {/* Lab Status Badge */}
        <motion.div
          variants={itemVariants}
          className="flex items-center gap-2 px-3 py-1 bg-zinc-900 border border-emerald-500/30 rounded-full text-emerald-400 text-xs font-mono tracking-wider shadow-[0_0_15px_rgba(16,185,129,0.1)] mb-4"
        >
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          LABORATORIO DE MICRO-SOLDADURA ELECTRÓNICA ABIERTO
        </motion.div>

        {/* Title */}
        <motion.h1
          variants={itemVariants}
          style={{ fontFamily: "'Space Grotesk', sans-serif" }}
          className="text-4xl sm:text-6xl md:text-7xl font-bold tracking-tight text-white mb-2 select-none"
        >
          <span className="text-emerald-400 drop-shadow-[0_0_15px_rgba(52,211,153,0.3)] font-mono">
            LyC.Tech
          </span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          variants={itemVariants}
          className="text-lg sm:text-2xl text-zinc-300 font-sans max-w-2xl leading-relaxed tracking-wide font-normal mb-8"
        >
          Tienda &amp; Laboratorio de Hardware Profesional
        </motion.p>

        {/* Buttons */}
        <motion.div
          variants={itemVariants}
          className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto"
        >
          <button
            onClick={() => document.getElementById("tienda")?.scrollIntoView({ behavior: "smooth" })}
            className="group px-8 py-4 bg-emerald-500 hover:bg-emerald-600 text-black font-bold font-sans text-sm tracking-widest rounded-lg flex items-center justify-center gap-2.5 shadow-[0_0_20px_rgba(16,185,129,0.25)] hover:shadow-[0_0_30px_rgba(16,185,129,0.45)] transition-all cursor-pointer hover:-translate-y-0.5 duration-200"
          >
            VER PRODUCTOS
            <ChevronDown className="h-4 w-4 transform group-hover:translate-y-0.5 transition-transform" />
          </button>
          
          <button
            onClick={() => document.getElementById("diagnostico")?.scrollIntoView({ behavior: "smooth" })}
            className="px-8 py-4 bg-zinc-900 border border-emerald-500/40 hover:border-emerald-550 hover:bg-zinc-800 text-emerald-400 hover:text-emerald-300 font-bold font-sans text-sm tracking-widest rounded-lg flex items-center justify-center gap-2.5 transition-all cursor-pointer hover:-translate-y-0.5 duration-200"
          >
            SOLICITAR DIAGNÓSTICO
            <Cpu className="h-4 w-4 animate-spin-slow text-emerald-400" />
          </button>
        </motion.div>

        {/* Core Laboratory High-Lights */}
        <motion.div
          variants={itemVariants}
          className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-3xl mt-16 w-full text-left"
        >
          <div className="p-5 bg-zinc-950/85 border border-zinc-800/80 rounded-xl flex items-start gap-4">
            <Cpu className="text-emerald-400 h-6 w-6 mt-1 shrink-0" />
            <div>
              <h4 className="text-white text-sm font-bold tracking-wide">Trabajos Microscópicos</h4>
              <p className="text-zinc-400 text-xs mt-1.5 leading-relaxed">
                Micro-soldadura SMD con microscopio de alta definición y aleaciones conductoras certificadas.
              </p>
            </div>
          </div>

          <div className="p-5 bg-zinc-950/85 border border-zinc-800/80 rounded-xl flex items-start gap-4">
            <ShieldAlert className="text-emerald-400 h-6 w-6 mt-1 shrink-0" />
            <div>
              <h4 className="text-white text-sm font-bold tracking-wide">Garantía Escrita</h4>
              <p className="text-zinc-400 text-xs mt-1.5 leading-relaxed">
                Cada chip re-soldado o procesador con pines reconstruidos cuenta con testeos térmicos de 24hs.
              </p>
            </div>
          </div>

          <div className="p-5 bg-zinc-950/85 border border-zinc-800/80 rounded-xl flex items-start gap-4">
            <BadgeDollarSign className="text-emerald-400 h-6 w-6 mt-1 shrink-0" />
            <div>
              <h4 className="text-white text-sm font-bold tracking-wide">Optimización ARS / USD</h4>
              <p className="text-zinc-400 text-xs mt-1.5 leading-relaxed">
                Flexibilidad total con cotizaciones transparentes e importación express de repuestos originales.
              </p>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}
