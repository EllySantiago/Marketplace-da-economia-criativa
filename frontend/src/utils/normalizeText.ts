/** Remove acentos e caixa para permitir busca textual tolerante (ex: "ceramica" encontra "Cerâmica"). */
export function normalizeText(texto: string): string {
  return texto
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .trim();
}
