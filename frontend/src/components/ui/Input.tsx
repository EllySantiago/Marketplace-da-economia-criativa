import type { InputHTMLAttributes, ReactNode, TextareaHTMLAttributes } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: ReactNode;
}

export function Input({ label, className = "", id, ...props }: InputProps) {
  const campo = <input id={id} className={`mt-2 w-full border border-[#E8E0D5] bg-white px-4 py-3 text-sm ${className}`.trim()} {...props} />;
  if (!label) return campo;
  return (
    <label htmlFor={id} className="block text-sm font-medium text-[#2C2C2C]">
      {label}
      {campo}
    </label>
  );
}

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: ReactNode;
}

export function Textarea({ label, className = "", id, ...props }: TextareaProps) {
  const campo = <textarea id={id} className={`mt-2 w-full border border-[#E8E0D5] bg-white px-4 py-3 text-sm ${className}`.trim()} {...props} />;
  if (!label) return campo;
  return (
    <label htmlFor={id} className="block text-sm font-medium text-[#2C2C2C]">
      {label}
      {campo}
    </label>
  );
}

export default Input;
