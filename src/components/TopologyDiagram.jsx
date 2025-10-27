import React from 'react';

// Renders a 2D topology diagram from parsed topology elements
// elements: [{ type: 'H'|'E'|'C', length: number, label: string }]
// We map length to width; helices as rounded rectangles, sheets as arrows, coils as smooth lines
export default function TopologyDiagram({ elements = [], height = 100 }) {
  const laneY = height / 2;
  const unit = 8; // px per residue
  const gap = 16; // gap between elements
  let x = 12; // start padding

  const shapes = elements.map((el, idx) => {
    const w = Math.max(18, el.length * unit);
    const startX = x;
    x += w + gap;

    if (el.type === 'H') {
      return (
        <g key={idx}>
          <rect x={startX} y={laneY - 14} width={w} height={28} rx={14} fill="#e879f9" opacity="0.9" />
          <text x={startX + w / 2} y={laneY + 4} textAnchor="middle" fontSize="12" fill="#0b0b0b" fontWeight="600">{el.label}</text>
        </g>
      );
    }
    if (el.type === 'E') {
      const h = 24;
      const arrowW = Math.min(20, w * 0.35);
      const bodyW = w - arrowW;
      const yTop = laneY - h / 2;
      const yBot = laneY + h / 2;
      const points = [
        [startX, yTop],
        [startX + bodyW, yTop],
        [startX + w, laneY],
        [startX + bodyW, yBot],
        [startX, yBot]
      ].map(p => p.join(',')).join(' ');
      return (
        <g key={idx}>
          <polygon points={points} fill="#34d399" opacity="0.95" />
          <text x={startX + w / 2} y={laneY + 4} textAnchor="middle" fontSize="12" fill="#0b0b0b" fontWeight="600">{el.label}</text>
        </g>
      );
    }
    // Coil
    const amp = 10;
    const segs = Math.max(3, Math.floor(w / 18));
    const dx = w / segs;
    let d = `M ${startX} ${laneY}`;
    for (let i = 0; i < segs; i++) {
      const cx1 = startX + i * dx + dx / 3;
      const cy1 = laneY - amp;
      const cx2 = startX + i * dx + (2 * dx) / 3;
      const cy2 = laneY + amp;
      const ex = startX + (i + 1) * dx;
      const ey = laneY;
      d += ` C ${cx1} ${cy1}, ${cx2} ${cy2}, ${ex} ${ey}`;
    }
    return (
      <g key={idx}>
        <path d={d} stroke="#94a3b8" strokeWidth="3" fill="none" />
        <text x={startX + w / 2} y={laneY - 12} textAnchor="middle" fontSize="12" fill="#cbd5e1" fontWeight="600">{el.label}</text>
      </g>
    );
  });

  const totalWidth = Math.max(320, x + 12);

  return (
    <div className="w-full overflow-x-auto">
      <svg width={totalWidth} height={height} role="img" aria-label="2D topology diagram">
        <defs>
          <linearGradient id="bgGrad" x1="0" x2="1">
            <stop offset="0%" stopColor="#0b1220" />
            <stop offset="100%" stopColor="#0a0a0a" />
          </linearGradient>
        </defs>
        <rect x="0" y="0" width="100%" height="100%" fill="url(#bgGrad)" rx="8" />
        <g>{shapes}</g>
      </svg>
    </div>
  );
}
