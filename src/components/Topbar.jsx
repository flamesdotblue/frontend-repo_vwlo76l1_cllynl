import { Menu } from 'lucide-react';

export default function Topbar({ onOpenNav, active }) {
  return (
    <header className="md:hidden sticky top-0 z-20 bg-black/70 backdrop-blur border-b border-white/10 text-white">
      <div className="flex items-center justify-between px-4 py-3">
        <button onClick={onOpenNav} className="p-2 rounded-md bg-white/10">
          <Menu className="w-5 h-5" />
        </button>
        <div className="text-sm font-medium">{active === 'history' ? 'Prediction History' : '2D Structure Predictor'}</div>
        <div className="w-9" />
      </div>
    </header>
  );
}
