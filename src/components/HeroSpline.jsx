import React from 'react';
import Spline from '@splinetool/react-spline';

export default function HeroSpline() {
  return (
    <section className="relative w-full h-[280px] md:h-[360px] overflow-hidden">
      <div className="absolute inset-0">
        <Spline scene="https://prod.spline.design/mWY-FNsBVpRvZHS5/scene.splinecode" style={{ width: '100%', height: '100%' }} />
      </div>
      <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/40 to-black/80 pointer-events-none" />
      <div className="relative h-full max-w-6xl mx-auto flex items-center px-4">
        <div className="text-white">
          <h1 className="text-2xl md:text-4xl font-semibold tracking-tight">Betafold</h1>
          <p className="text-sm md:text-base text-white/70 max-w-xl mt-2">A vibrant 3D hero celebrating protein science. Explore secondary structure with an intuitive 2D topology diagram and rich analysis.</p>
        </div>
      </div>
    </section>
  );
}
