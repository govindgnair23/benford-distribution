import type { ReactNode } from "react";

interface ChartFrameProps {
  title: string;
  summary: string;
  children: ReactNode;
}

export function ChartFrame({ title, summary, children }: ChartFrameProps) {
  return (
    <section className="chart-frame" aria-label={title}>
      <div className="chart-heading">
        <h3>{title}</h3>
        <p>{summary}</p>
      </div>
      <div className="chart-canvas">{children}</div>
    </section>
  );
}
