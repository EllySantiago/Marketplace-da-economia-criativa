import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Usuario } from "@/types/usuario";

interface AuthState {
  usuario: Usuario | null;
  autenticar: (usuario: Usuario) => void;
  sair: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      usuario: null,
      autenticar: (usuario) => set({ usuario }),
      sair: () => set({ usuario: null }),
    }),
    { name: "origem:sessao" },
  ),
);
