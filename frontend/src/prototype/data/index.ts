export type Page =
  | "home"
  | "catalog"
  | "product"
  | "artisan"
  | "cart"
  | "dashboard"
  | "admin"
  | "login"
  | "confirmation";

export interface Artisan {
  id: number;
  name: string;
  region: string;
  city: string;
  bio: string;
  avatar: string;
  cover: string;
  techniques: string[];
  productsCount: number;
  rating: number;
  since: number;
}

export interface Product {
  id: number;
  title: string;
  artisanId: number;
  artisanName: string;
  technique: string;
  region: string;
  price: number;
  originalPrice?: number;
  stock: number;
  images: string[];
  description: string;
  category: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export const artisans: Artisan[] = [
  {
    id: 1,
    name: "Maria das Graças Silva",
    region: "Agreste",
    city: "Caruaru",
    bio: "Nascida no coração do Alto do Moura, Maria aprendeu a moldar o barro com as mãos de sua avó aos seis anos. Hoje, há mais de trinta anos de ofício, suas peças habitam museus e lares de todo o Brasil. Cada figura carrega a alma do sertão pernambucano.",
    avatar: "https://images.unsplash.com/photo-1641338215253-9e9c8cf48a5a?w=200&h=200&fit=crop&auto=format",
    cover: "https://images.unsplash.com/photo-1641338215253-9e9c8cf48a5a?w=1400&h=400&fit=crop&auto=format",
    techniques: ["Cerâmica", "Barro Cozido", "Alto do Moura"],
    productsCount: 18,
    rating: 4.9,
    since: 1993,
  },
  {
    id: 2,
    name: "João Ferreira Neto",
    region: "Zona da Mata",
    city: "Olinda",
    bio: "Mestre entalhador formado pela tradição olindense, João transforma madeira de lei em narrativas nordestinas. Seus oratórios e figuras de carnaval são reconhecidos pelo IPHAN como patrimônio cultural imaterial.",
    avatar: "https://images.unsplash.com/photo-1659644569209-1c397e64f7c6?w=200&h=200&fit=crop&auto=format",
    cover: "https://images.unsplash.com/photo-1655138493602-49901f93d250?w=1400&h=400&fit=crop&auto=format",
    techniques: ["Entalhamento em Madeira", "Escultura", "Pintura Natural"],
    productsCount: 12,
    rating: 4.8,
    since: 2001,
  },
  {
    id: 3,
    name: "Ana Luíza Rodrigues",
    region: "RMR",
    city: "Recife",
    bio: "Bordadeira da tradição renascença, Ana Luíza preserva a Renda Renascença trazida pelos colonizadores portugueses e reinventada pelas mãos nordestinas. Cada peça leva em média três semanas para ser concluída.",
    avatar: "https://images.unsplash.com/photo-1628006025173-7c5558fa97c1?w=200&h=200&fit=crop&auto=format",
    cover: "https://images.unsplash.com/photo-1628006025173-7c5558fa97c1?w=1400&h=400&fit=crop&auto=format",
    techniques: ["Renda Renascença", "Bordado", "Crochê"],
    productsCount: 9,
    rating: 5.0,
    since: 2008,
  },
  {
    id: 4,
    name: "Sebastião Mendes",
    region: "Sertão",
    city: "Petrolina",
    bio: "Artesão do couro cru, Sebastião aprendeu o ofício com vaqueiros do sertão do São Francisco. Suas bolsas e cintos são trabalhados com técnicas de curtição natural e gravação manual, únicos no mercado.",
    avatar: "https://images.unsplash.com/photo-1603219527847-24c87f552a77?w=200&h=200&fit=crop&auto=format",
    cover: "https://images.unsplash.com/photo-1603219527847-24c87f552a77?w=1400&h=400&fit=crop&auto=format",
    techniques: ["Couro Cru", "Curtição Natural", "Gravação Manual"],
    productsCount: 14,
    rating: 4.7,
    since: 1998,
  },
];

export const products: Product[] = [
  {
    id: 1,
    title: "Cangaceiro de Barro — Lampião e Maria Bonita",
    artisanId: 1,
    artisanName: "Maria das Graças Silva",
    technique: "Cerâmica",
    region: "Agreste",
    price: 285.0,
    originalPrice: 340.0,
    stock: 3,
    images: [
      "https://images.unsplash.com/photo-1641338215253-9e9c8cf48a5a?w=800&h=800&fit=crop&auto=format",
      "https://images.unsplash.com/photo-1786507244330-6ad954c96ef9?w=800&h=800&fit=crop&auto=format",
    ],
    description:
      "Dupla icônica do cangaço nordestino esculpida em barro cozido e pintada à mão com pigmentos naturais. Cada peça é única, com pequenas variações que atestam o trabalho artesanal. Acompanha certificado de autenticidade e embalagem de proteção.",
    category: "Cerâmica",
  },
  {
    id: 2,
    title: "Oratório São Francisco em Cedro",
    artisanId: 2,
    artisanName: "João Ferreira Neto",
    technique: "Entalhamento",
    region: "Zona da Mata",
    price: 620.0,
    stock: 2,
    images: [
      "https://images.unsplash.com/photo-1655138493602-49901f93d250?w=800&h=800&fit=crop&auto=format",
      "https://images.unsplash.com/photo-1721508490084-1b1de5b230d4?w=800&h=800&fit=crop&auto=format",
    ],
    description:
      "Oratório em cedro-rosa entalhado à mão com detalhes em dourado folha. Representa São Francisco de Assis cercado por pássaros do sertão. Peça de colecionador, técnica exclusiva da escola olindense.",
    category: "Madeira",
  },
  {
    id: 3,
    title: "Caminho de Mesa em Renda Renascença",
    artisanId: 3,
    artisanName: "Ana Luíza Rodrigues",
    technique: "Renda",
    region: "RMR",
    price: 380.0,
    stock: 5,
    images: [
      "https://images.unsplash.com/photo-1628006025173-7c5558fa97c1?w=800&h=800&fit=crop&auto=format",
      "https://images.unsplash.com/photo-1655149238677-9b5cb1a0afc6?w=800&h=800&fit=crop&auto=format",
    ],
    description:
      "Caminho de mesa 40×150 cm em renda renascença branca com padrão floral pernambucano. Confeccionado em linha de algodão egípcio, técnica de bilro transmitida por quatro gerações da família Rodrigues.",
    category: "Renda",
  },
  {
    id: 4,
    title: "Bolsa Sertaneja em Couro Cru",
    artisanId: 4,
    artisanName: "Sebastião Mendes",
    technique: "Couro",
    region: "Sertão",
    price: 450.0,
    originalPrice: 520.0,
    stock: 7,
    images: [
      "https://images.unsplash.com/photo-1603219527847-24c87f552a77?w=800&h=800&fit=crop&auto=format",
      "https://images.unsplash.com/photo-1599694522028-65abc96dfd2f?w=800&h=800&fit=crop&auto=format",
    ],
    description:
      "Bolsa crossbody em couro cru curtido naturalmente com noz-de-galha. Gravação geométrica xilográfica inspirada nas cordéis do São Francisco. Forro em algodão cru, alça regulável, fecho magnético.",
    category: "Couro",
  },
  {
    id: 5,
    title: "Família de Bonecos do Alto do Moura",
    artisanId: 1,
    artisanName: "Maria das Graças Silva",
    technique: "Cerâmica",
    region: "Agreste",
    price: 195.0,
    stock: 6,
    images: [
      "https://images.unsplash.com/photo-1786507244330-6ad954c96ef9?w=800&h=800&fit=crop&auto=format",
      "https://images.unsplash.com/photo-1641338215253-9e9c8cf48a5a?w=800&h=800&fit=crop&auto=format",
    ],
    description:
      "Conjunto de cinco bonecos em barro representando família nordestina: pai, mãe, filho, filha e avó. Pintados à mão com cores vibrantes, base antiderrapante.",
    category: "Cerâmica",
  },
  {
    id: 6,
    title: "Escultura Cabra do Sertão em Madeira",
    artisanId: 2,
    artisanName: "João Ferreira Neto",
    technique: "Entalhamento",
    region: "Zona da Mata",
    price: 340.0,
    stock: 4,
    images: [
      "https://images.unsplash.com/photo-1721508490084-1b1de5b230d4?w=800&h=800&fit=crop&auto=format",
      "https://images.unsplash.com/photo-1655138493602-49901f93d250?w=800&h=800&fit=crop&auto=format",
    ],
    description:
      "Cabra do sertão esculpida em umburana, madeira tradicional do Nordeste, com olhos de vidro importados. Peça de 35 cm, acabamento em cera natural.",
    category: "Madeira",
  },
];

export const initialCart: CartItem[] = [
  { product: products[0], quantity: 1 },
  { product: products[2], quantity: 2 },
];
