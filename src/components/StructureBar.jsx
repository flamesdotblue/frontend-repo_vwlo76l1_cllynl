import React from 'react';

// Renders a compact bar visualizing secondary structure string with colors per residue
// H: helix -> fuchsia, E: sheet -> emerald, C: coil -> slate
export default function StructureBar({ structure, height = 8 }) {
  if (!structure) return null;
  const segments = Array.from(structure);
  const colorFor = (ch) => {
    if (ch === 'H') return 'bg-fuchsia-500';
    if (ch === 'E') return 'bg-emerald-500';
    return 'bg-slate-500';
  };
  return (
    <div className="w-full rounded overflow-hidden border border-white/10 bg-black/50">
      <div className="flex w-full">
        {segments.map((ch, idx) => (
          <div key={idx} className={`${colorFor(ch)}`} style={{ height, width: `${100 / segments.length}%` }} />
        ))}
      </div>
      <div className="flex justify-between text-[10px] text-white/40 px-1 py-0.5">
        <span>H = Helix</span>
        <span>E = Sheet</span>
        <span>C = Coil</span>
      </div>
    </div>
  );
}
