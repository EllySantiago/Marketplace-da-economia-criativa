"use client";

import type { ReactNode } from "react";

interface ModalProps {
  aberto: boolean;
  titulo?: string;
  onFechar: () => void;
  children: ReactNode;
}

export default function Modal({ aberto, titulo, onFechar, children }: ModalProps) {
  if (!aberto) return null;
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 px-4" role="dialog" aria-modal="true" onClick={onFechar}>
      <div className="w-full max-w-md bg-white p-6 shadow-lg" onClick={(event) => event.stopPropagation()}>
        <div className="mb-4 flex items-center justify-between">
          {titulo && <h2 className="font-display text-xl text-[#2C2C2C]">{titulo}</h2>}
          <button type="button" onClick={onFechar} aria-label="Fechar" className="text-xl leading-none text-[#888] hover:text-[#2C2C2C]">
            ×
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}
