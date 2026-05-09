import type { ReactNode } from "react";

interface FormulaBlockProps {
  children: ReactNode;
  label?: string;
}

export function FormulaBlock({ children, label }: FormulaBlockProps) {
  return (
    <figure className="formula-block">
      {label ? <figcaption>{label}</figcaption> : null}
      <code>{children}</code>
    </figure>
  );
}
