import { Product, RepairService, CaseStudy } from "./types";

export const initialProducts: Product[] = [
  {
    id: "prod-1",
    name: "AMD Ryzen 5 3600",
    description: "Procesador de 6 núcleos y 12 hilos, ideal para gaming competitivo y tareas de productividad exigentes.",
    priceArs: 21500,
    category: "procesadores",
    imageUrl: "https://images.unsplash.com/photo-1591488320449-011701bb6704?auto=format&fit=crop&q=80&w=500",
    specs: ["6 Núcleos / 12 Hilos", "Frecuencia: 3.6 GHz a 4.2 GHz", "Socket: AM4", "TDP: 65W"],
    stock: 8
  },
  {
    id: "prod-2",
    name: "GeForce GTX 1060 6GB",
    description: "Placa de video legendaria para gráficos estables full HD, ideal para eSports y diseño gráfico general.",
    priceArs: 48700,
    category: "videos",
    imageUrl: "https://images.unsplash.com/photo-1587202372775-e229f172b9d7?auto=format&fit=crop&q=80&w=500",
    specs: ["Memoria: 6GB GDDR5", "Interfaz: 192-bit", "Puertos: HDMI / DisplayPort / DVI", "Recomendado Fuente: 450W"],
    stock: 3
  },
  {
    id: "prod-3",
    name: "SSD Kingston A400 480GB",
    description: "Unidad de estado sólido ultra rápida para acelerar el arranque del sistema y los tiempos de carga del software.",
    priceArs: 9900,
    category: "almacenamiento",
    imageUrl: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?auto=format&fit=crop&q=80&w=500",
    specs: ["Capacidad: 480 GB", "Factor de forma: 2.5\"", "Velocidad Lectura: hasta 500MB/s", "Velocidad Escritura: hasta 450MB/s"],
    stock: 14
  },
  {
    id: "prod-4",
    name: "Motherboard ASUS ROG STRIX B450-F",
    description: "Placa base de alto rendimiento AM4 con VRMs refrigerados por disipadores de aluminio premium, ideal para overclocking estable.",
    priceArs: 35000,
    category: "motherboards",
    imageUrl: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=500",
    specs: ["Chipset: AMD B450", "Formato: ATX", "Dual M.2 Slots NVMe", "Aura Sync RGB"],
    stock: 5
  },
  {
    id: "prod-5",
    name: "Dual Channel RAM Corsair Vengeance 16GB",
    description: "Módulos de memoria RAM DDR4 de alta velocidad con disipador térmico anodizado de bajo perfil.",
    priceArs: 18400,
    category: "almacenamiento",
    imageUrl: "https://images.unsplash.com/photo-1562976540-1502c2145186?auto=format&fit=crop&q=80&w=500",
    specs: ["Capacidad: 16 GB (2x8GB)", "Tipo: DDR4 3200MHz", "Latencia: CL16", "Soporte XMP 2.0"],
    stock: 11
  },
  {
    id: "prod-6",
    name: "Gigabyte GeForce RTX 3060 Ti",
    description: "Placa gráfica de avanzada con núcleos Ray Tracing de segunda generación para fotogramas masivos y trazado de rayos.",
    priceArs: 125000,
    category: "videos",
    imageUrl: "https://images.unsplash.com/photo-1616440347437-b1c73416efc2?auto=format&fit=crop&q=80&w=500",
    specs: ["Memoria: 8GB GDDR6", "Arquitectura Ampere", "Sistema Windforce 3X", "PCI Express 4.0"],
    stock: 2
  }
];

export const repairServices: RepairService[] = [
  {
    id: "srv-cpus",
    name: "Reparación de CPUs",
    description: "Extracción y soldado térmico selectivo de micro-componentes, transistores de desacople quemados y re-condicionamiento de capas semiconductoras en silicios.",
    basePriceArs: 22000,
    complexity: "Alta",
    duration: "48 - 72 Horas",
    detailedSpecs: [
      "Re-baleo de IHS",
      "Sustitución de capacitores de paso SMT inferiores",
      "Medición de líneas de control secundarias",
      "Limpieza por ultrasonido y compuesto térmico de metal líquido"
    ]
  },
  {
    id: "srv-mothers",
    name: "Reparación de Motherboards",
    description: "Diagnóstico completo de cortocircuitos en rieles de alimentación primarios de 19V/12V, reparación de pistas multicapa cortadas y reconstrucción de pads LGA.",
    basePriceArs: 38000,
    complexity: "Crítica",
    duration: "3 - 5 Días Hábiles",
    detailedSpecs: [
      "Inyección de corriente para detección térmica por micro-cámara FLIR",
      "Reemplazo de MOSFETs y circuitos integrados PWM de fases de alimentación (VRMs)",
      "Programación de BIOS corruptas vía SPI mediante programador TL866II",
      "Limpieza ultrasónica anti-humedad o residuos corrosivos"
    ]
  },
  {
    id: "srv-gpus",
    name: "Mantenimiento de Placas de Video",
    description: "Cambio completo de termal pads de alta conductividad, limpieza profunda de disipador de cobre y re-balling de chips controladores de memoria GDDR.",
    basePriceArs: 18000,
    complexity: "Media",
    duration: "24 - 48 Horas",
    detailedSpecs: [
      "Instalación de pads de silicona con conductividad térmica de 12.8 W/mK",
      "Reemplazo de pasta térmica de fábrica por Arctic MX-6 o Noctua NT-H2",
      "Mantenimiento preventivo e hidráulico de ventiladores ruidosos",
      "Pruebas de estrés y curva térmica en FurMark/Superposition"
    ]
  },
  {
    id: "srv-pins",
    name: "Reparación de Pines de CPU",
    description: "Enderezado microscópico de pines doblados o soldadura de repuesto de pines de bronce fosforoso bañados en oro para procesadores AM4 / AM5 y sockets LGA Intel.",
    basePriceArs: 15000,
    complexity: "Alta",
    duration: "24 Horas",
    detailedSpecs: [
      "Trabajo bajo microscopio trinocular con magnificación 45X",
      "Pines de repuesto recuperados de donantes originales con aleación de plata/estaño",
      "Prueba física de libre inserción en zócalo (Zero Insertion Force)",
      "Testeo de memoria Dual Channel posterior a reparación para asegurar líneas conectadas"
    ]
  }
];

export const caseStudies: CaseStudy[] = [
  {
    id: "case-1",
    title: "Reconstructor de Pines Ryzen 9 5900X",
    description: "Llegó al taller con 14 pines completamente aplastados y 3 pines cortados de raíz debido a una inserción forzada. El procesador no era detectado por la placa base.",
    beforeImage: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=500", // Placeholder representing complex circuit trace
    afterImage: "https://images.unsplash.com/photo-1591488320449-011701bb6704?auto=format&fit=crop&q=80&w=500",  // Clean layout
    microscopeAnalysis: "Soldadura de precisión utilizando microscopio trinocular 40x con hilo de estaño de 0.2mm y aleación plomo-plata para asegurar conductividad perfecta.",
    difficulty: "Extrema"
  },
  {
    id: "case-2",
    title: "Cortocircuito en VRM de RTX 3080",
    description: "Placa de video en corto franco que causaba el bloqueo instantáneo de la fuente de alimentación al intentar encender el equipo.",
    beforeImage: "https://images.unsplash.com/photo-1555664424-778a1e5e1b48?auto=format&fit=crop&q=80&w=500",
    afterImage: "https://images.unsplash.com/photo-1587202372775-e229f172b9d7?auto=format&fit=crop&q=80&w=500",
    microscopeAnalysis: "Estación de calor infrarrojo para retirar el MOSFET quemado. Reconstrucción de máscara antisoldante ultravioleta (UV) y cambio por DrMOS Vishay original.",
    difficulty: "Compleja"
  },
  {
    id: "case-3",
    title: "SOCKET LGA 1200 Re-alineado",
    description: "Placa Z490 con múltiples pines del zócalo de CPU retorcidos por caída accidental del disipador de fábrica, provocando que no use el canal B de RAM.",
    beforeImage: "https://images.unsplash.com/photo-1601524909162-be87252be298?auto=format&fit=crop&q=80&w=500",
    afterImage: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=500",
    microscopeAnalysis: "Enderezado manual con micro pinzas de titanio curva antimagnética 0.02mm, guiados por monitor LCD a 50 FPS para asegurar el ángulo óptimo.",
    difficulty: "Estándar"
  }
];
