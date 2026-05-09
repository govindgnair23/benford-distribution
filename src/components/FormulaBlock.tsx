import type { ReactNode } from "react";
import { BlockMath } from "react-katex";

interface FormulaBlockProps {
  accessibilityLabel?: string;
  children?: ReactNode;
  formula?: string;
  label?: string;
}

export function FormulaBlock({
  accessibilityLabel,
  children,
  formula,
  label
}: FormulaBlockProps) {
  return (
    <figure className="formula-block">
      {label ? <figcaption>{label}</figcaption> : null}
      {formula ? (
        <div
          className="formula-math"
          aria-label={accessibilityLabel ?? formula}
          role="math"
        >
          <BlockMath math={formula} />
        </div>
      ) : (
        <code>{children}</code>
      )}
    </figure>
  );
}
