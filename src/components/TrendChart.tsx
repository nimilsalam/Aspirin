interface Point {
  label: string;
  score: number;
}

interface TrendChartProps {
  points: Point[]; // oldest -> newest
}

/** Minimal SVG line chart of health score over time. */
export function TrendChart({ points }: TrendChartProps) {
  const width = 320;
  const height = 160;
  const pad = { top: 16, right: 16, bottom: 28, left: 28 };
  const innerW = width - pad.left - pad.right;
  const innerH = height - pad.top - pad.bottom;

  const n = points.length;
  const x = (i: number) => pad.left + (n === 1 ? innerW / 2 : (i / (n - 1)) * innerW);
  const y = (score: number) => pad.top + innerH - (score / 100) * innerH;

  const linePath = points
    .map((p, i) => `${i === 0 ? 'M' : 'L'} ${x(i).toFixed(1)} ${y(p.score).toFixed(1)}`)
    .join(' ');

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="w-full" role="img" aria-label="Score trend">
      {[0, 50, 100].map((g) => (
        <g key={g}>
          <line
            x1={pad.left}
            x2={width - pad.right}
            y1={y(g)}
            y2={y(g)}
            stroke="#e8edeb"
            strokeWidth={1}
          />
          <text x={4} y={y(g) + 4} fontSize={10} fill="#8a9690">
            {g}
          </text>
        </g>
      ))}

      {n > 1 && <path d={linePath} fill="none" stroke="#0b8a6f" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" />}

      {points.map((p, i) => (
        <g key={i}>
          <circle cx={x(i)} cy={y(p.score)} r={4} fill="#0b8a6f" />
          <text x={x(i)} y={height - 8} fontSize={10} fill="#5a6b66" textAnchor="middle">
            {p.label}
          </text>
        </g>
      ))}
    </svg>
  );
}
