import type { HTMLAttributes } from "react";

export default function Badge({ className = "", ...props }: HTMLAttributes<HTMLSpanElement>) {
  return <span className={`technique-badge ${className}`.trim()} {...props} />;
}
