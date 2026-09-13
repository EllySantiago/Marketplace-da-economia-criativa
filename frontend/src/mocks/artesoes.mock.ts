import type { Artesao } from "../types/artesao";

export const artesoesMock: Artesao[] = [
	{ id: 1, nome: "Maria das Graças Silva", cidade: "Caruaru", regiao: "Agreste", biografia: "Mestra do barro e da cerâmica do Alto do Moura.", fotoUrl: "https://images.unsplash.com/photo-1641338215253-9e9c8cf48a5a?w=240&h=240&fit=crop&auto=format", tecnicas: ["Cerâmica", "Barro cozido"], avaliacaoMedia: 4.9, totalVendas: 248 },
	{ id: 2, nome: "João Ferreira Neto", cidade: "Olinda", regiao: "Zona da Mata", biografia: "Entalhador que transforma madeira em narrativas nordestinas.", fotoUrl: "https://images.unsplash.com/photo-1655138493602-49901f93d250?w=240&h=240&fit=crop&auto=format", tecnicas: ["Entalhamento", "Escultura"], avaliacaoMedia: 4.8, totalVendas: 173 },
	{ id: 3, nome: "Ana Luíza Rodrigues", cidade: "Recife", regiao: "RMR", biografia: "Bordadeira da tradição da renda renascença.", fotoUrl: "https://images.unsplash.com/photo-1628006025173-7c5558fa97c1?w=240&h=240&fit=crop&auto=format", tecnicas: ["Renda", "Bordado"], avaliacaoMedia: 5, totalVendas: 121 },
];
