import { Dna, History, Cog, LogOut, Home } from 'lucide-react';

export default function Sidebar({ user, active, onNavigate, onSignOut }) {
  return (
    <aside className="h-screen w-72 bg-gradient-to-b from-slate-950 to-black text-white border-r border-white/10 hidden md:flex flex-col">
      <div className="flex items-center gap-3 p-5 border-b border-white/10">
        <div className="p-2 rounded-xl bg-white/10">
          <Dna className="w-6 h-6 text-fuchsia-400" />
        </div>
        <div>
          <h2 className="text-lg font-semibold leading-tight">Betafold</h2>
          <p className="text-xs text-white/50">2D Structure Tools</p>
        </div>
      </div>

      <div className="p-5">
        <p className="text-xs text-white/50 mb-2">ANALYSIS TOOLS</p>
        <nav className="space-y-1">
          <button
            onClick={() => onNavigate('predictor')}
            className={`w-full text-left inline-flex items-center gap-2 px-3 py-2 rounded-md transition ${
              active === 'predictor' ? 'bg-white/10 text-white' : 'text-white/70 hover:bg-white/5'
            }`}
          >
            <Home className="w-4 h-4" />
            2D Structure Predictor
          </button>
          <button
            onClick={() => onNavigate('history')}
            className={`w-full text-left inline-flex items-center gap-2 px-3 py-2 rounded-md transition ${
              active === 'history' ? 'bg-white/10 text-white' : 'text-white/70 hover:bg-white/5'
            }`}
          >
            <History className="w-4 h-4" />
            Prediction History
          </button>
        </nav>
      </div>

      <div className="px-5 mt-4">
        <p className="text-xs text-white/50 mb-2">QUICK INFO</p>
        <div className="rounded-lg border border-white/10 bg-white/5 p-3 text-xs text-white/70">
          Betafold estimates secondary structure and residue contacts using advanced AI-inspired heuristics. Results are simulated for demo purposes.
        </div>
      </div>

      <div className="mt-auto p-5 border-t border-white/10">
        <div className="text-xs text-white/50 mb-2">USER</div>
        <div className="flex items-center justify-between bg-white/5 border border-white/10 rounded-lg p-3">
          <div className="truncate">
            <div className="text-xs text-white/50">Signed in as</div>
            <div className="text-sm font-medium truncate" title={user?.email}>{user?.email}</div>
          </div>
          <button onClick={onSignOut} className="inline-flex items-center gap-1 text-sm px-2 py-1 rounded-md bg-white/10 hover:bg-white/20">
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>
        <div className="mt-3 text-[11px] text-white/40 inline-flex items-center gap-1">
          <Cog className="w-3.5 h-3.5" /> v0.1 beta
        </div>
      </div>
    </aside>
  );
}
