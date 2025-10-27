import { useEffect, useState } from 'react';
import { Clock, ChevronDown, ChevronUp } from 'lucide-react';

function loadUserPredictions(email) {
  const key = `artifacts.betafold-app.users.${email}.predictions`;
  const list = JSON.parse(localStorage.getItem(key) || '[]');
  return list;
}

export default function History({ user }) {
  const [items, setItems] = useState([]);
  const [openId, setOpenId] = useState(null);

  useEffect(() => {
    const fetchData = () => setItems(loadUserPredictions(user.email));
    fetchData();

    // Simulate realtime by polling every 2s (placeholder for Firebase onSnapshot)
    const t = setInterval(fetchData, 2000);
    return () => clearInterval(t);
  }, [user.email]);

  return (
    <div className="p-4 md:p-8">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-2xl font-semibold text-white mb-4">Prediction History</h2>
        {items.length === 0 ? (
          <div className="text-white/60 text-sm">No predictions yet. Run your first analysis to see it here.</div>
        ) : (
          <div className="space-y-3">
            {items.map((it) => (
              <div key={it.id} className="rounded-xl border border-white/10 bg-white/5 text-white">
                <button
                  onClick={() => setOpenId(openId === it.id ? null : it.id)}
                  className="w-full px-4 py-3 flex items-center justify-between gap-3"
                >
                  <div className="text-left">
                    <div className="font-medium">{it.proteinName}</div>
                    <div className="text-xs text-white/60 inline-flex items-center gap-2">
                      <span>{it.confidence}% confidence</span>
                      <span className="inline-flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" /> {new Date(it.createdAt).toLocaleString()}
                      </span>
                    </div>
                  </div>
                  {openId === it.id ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>
                {openId === it.id && (
                  <div className="px-4 pb-4">
                    <div className="text-xs text-white/60 mb-1">Amino Acid Sequence</div>
                    <pre className="bg-black/50 border border-white/10 rounded-lg p-3 overflow-x-auto text-emerald-300 text-xs whitespace-pre-wrap break-all">{it.sequence}</pre>
                    <div className="text-xs text-white/60 mt-3 mb-1">Predicted Secondary Structure</div>
                    <pre className="bg-black/50 border border-white/10 rounded-lg p-3 overflow-x-auto text-fuchsia-300 text-xs whitespace-pre-wrap break-all">{it.predictedStructure}</pre>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
