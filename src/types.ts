export interface Product {
  id: string;
  name: string;
  description: string;
  priceArs: number;
  category: "procesadores" | "videos" | "almacenamiento" | "motherboards";
  imageUrl: string;
  specs: string[];
  stock: number;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface RepairService {
  id: string;
  name: string;
  description: string;
  basePriceArs: number;
  complexity: "Baja" | "Media" | "Alta" | "Crítica";
  duration: string;
  detailedSpecs: string[];
}

export interface CaseStudy {
  id: string;
  title: string;
  description: string;
  beforeImage: string;
  afterImage: string;
  microscopeAnalysis: string;
  difficulty: "Extrema" | "Compleja" | "Estándar";
}

export interface Ticket {
  id: string;
  clientName: string;
  email: string;
  phone: string;
  componentType: string;
  symptom: string;
  notes: string;
  status: string;
  createdAt: string;
}

export interface ChatMessage {
  role: "user" | "model";
  text: string;
  timestamp: string;
}
