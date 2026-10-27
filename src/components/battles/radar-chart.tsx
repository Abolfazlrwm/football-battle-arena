export interface RadarSeries {
  label: string;
  color: string;
  /** 0–1 per axis, same order as `axes`. */
  values: number[];
}

/**
 * A pentagon radar: one or two teams overlaid. Pure SVG, no dependencies.
 * Values are pre-normalized by the caller (see radarValues in /lib/league.ts).
 */
export function RadarChart({
  axes,
  series,
  size = 260,
}: {
  axes: string[];
  series: RadarSeries[];
  size?: number;
}) {
  const c = size / 2;
  const radius = size * 0.34;
  const n = axes.length;
  const point = (i: number, v: number) => {
    const angle = (Math.PI * 2 * i) / n - Math.PI / 2;
    return [c + Math.cos(angle) * radius * v, c + Math.sin(angle) * radius * v] as const;
  };
  const ring = (v: number) => axes.map((_, i) => point(i, v).join(",")).join(" ");
  const summary = series
    .map((s) => `${s.label}: ${s.values.map((v, i) => `${axes[i]} ${Math.round(v * 100)}`).join(", ")}`)
    .join(". ");

  return (
    <svg viewBox={`0 0 ${size} ${size}`} role="img" aria-label={`Radar chart. ${summary}`} className="mx-auto h-auto w-full max-w-[300px]">
      {[0.25, 0.5, 0.75, 1].map((v) => (
        <polygon key={v} points={ring(v)} fill="none" stroke="rgba(244,245,247,0.12)" strokeWidth="1" />
      ))}
      {axes.map((label, i) => {
        const [x, y] = point(i, 1);
        const [lx, ly] = point(i, 1.2);
        return (
          <g key={label}>
            <line x1={c} y1={c} x2={x} y2={y} stroke="rgba(244,245,247,0.12)" strokeWidth="1" />
            <text
              x={lx}
              y={ly}
              textAnchor="middle"
              dominantBaseline="middle"
              fill="#9aa0ac"
              style={{ fontSize: 10, fontFamily: "var(--font-body), sans-serif" }}
            >
              {label}
            </text>
          </g>
        );
      })}
      {series.map((s) => (
        <polygon
          key={s.label}
          points={s.values.map((v, i) => point(i, v).join(",")).join(" ")}
          fill={s.color}
          fillOpacity="0.22"
          stroke={s.color}
          strokeWidth="2"
          strokeLinejoin="round"
        />
      ))}
    </svg>
  );
}
