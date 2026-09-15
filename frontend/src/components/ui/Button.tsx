import type { ButtonHTMLAttributes } from "react";

type Variante = "primary" | "outline" | "green";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variante?: Variante;
}

const classePorVariante: Record<Variante, string> = {
  primary: "btn-primary",
  outline: "btn-outline",
  green: "btn-green",
};

export default function Button({ variante = "primary", className = "", type = "button", ...props }: ButtonProps) {
  return <button type={type} className={`${classePorVariante[variante]} ${className}`.trim()} {...props} />;
}
