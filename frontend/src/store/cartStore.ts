import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { ItemCarrinho } from "@/types/carrinho";
import type { Produto } from "@/types/produto";

interface CartState {
  itens: ItemCarrinho[];
  adicionarItem: (produto: Produto, quantidade?: number) => void;
  removerItem: (produtoId: number) => void;
  alterarQuantidade: (produtoId: number, quantidade: number) => void;
  limparCarrinho: () => void;
}

export const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      itens: [],

      adicionarItem: (produto, quantidade = 1) =>
        set((state) => {
          const existente = state.itens.find((item) => item.produto.id === produto.id);
          if (existente) {
            return {
              itens: state.itens.map((item) =>
                item.produto.id === produto.id ? { ...item, quantidade: item.quantidade + quantidade } : item,
              ),
            };
          }
          return { itens: [...state.itens, { produto, quantidade }] };
        }),

      removerItem: (produtoId) =>
        set((state) => ({ itens: state.itens.filter((item) => item.produto.id !== produtoId) })),

      alterarQuantidade: (produtoId, quantidade) =>
        set((state) => {
          if (quantidade <= 0) {
            return { itens: state.itens.filter((item) => item.produto.id !== produtoId) };
          }
          return {
            itens: state.itens.map((item) => (item.produto.id === produtoId ? { ...item, quantidade } : item)),
          };
        }),

      limparCarrinho: () => set({ itens: [] }),
    }),
    { name: "origem:carrinho" },
  ),
);
