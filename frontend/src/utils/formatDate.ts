export function formatDate(data: string | Date, opcoes?: Intl.DateTimeFormatOptions): string {
  const valor = typeof data === "string" ? new Date(data) : data;
  return valor.toLocaleDateString("pt-BR", opcoes ?? { day: "2-digit", month: "long", year: "numeric" });
}

export function formatDateShort(data: string | Date): string {
  return formatDate(data, { day: "2-digit", month: "2-digit", year: "numeric" });
}
