import React, { useEffect, useRef } from 'react';

// Draws a binary contact map matrix (array of arrays of 0/1) on a canvas
export default function ContactMapCanvas({ matrix, size = 240, dotSize = 2, color = '#22d3ee' }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !matrix || !matrix.length) return;
    const n = matrix.length;
    const scale = size / n;
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d');

    // Clear
    ctx.fillStyle = '#0b0b0f';
    ctx.fillRect(0, 0, size, size);

    // Grid background subtle
    ctx.strokeStyle = 'rgba(255,255,255,0.05)';
    ctx.lineWidth = 1;
    for (let i = 0; i <= n; i += Math.max(1, Math.floor(n / 12))) {
      const p = Math.floor(i * scale) + 0.5;
      ctx.beginPath();
      ctx.moveTo(p, 0);
      ctx.lineTo(p, size);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(0, p);
      ctx.lineTo(size, p);
      ctx.stroke();
    }

    // Dots
    ctx.fillStyle = color;
    for (let i = 0; i < n; i++) {
      for (let j = 0; j < n; j++) {
        if (matrix[i][j]) {
          const x = j * scale;
          const y = i * scale;
          ctx.fillRect(x, y, dotSize, dotSize);
        }
      }
    }

    // Diagonal line for reference
    ctx.strokeStyle = 'rgba(255,255,255,0.2)';
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(size, size);
    ctx.stroke();
  }, [matrix, size, dotSize, color]);

  return <canvas ref={canvasRef} className="rounded-lg border border-white/10 bg-black" style={{ width: size, height: size }} />;
}
