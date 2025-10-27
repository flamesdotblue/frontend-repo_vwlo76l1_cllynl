import { useEffect, useState } from 'react';
import { Clock, ChevronDown, ChevronUp } from 'lucide-react';
import StructureBar from './StructureBar';
import ContactMapCanvas from './ContactMapCanvas';

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

    // Simulate realtime by polling every 1.5s
    const t = setInterval(fetchData, 1500);
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
                  <div className="px-4 pb-4 space-y-4">
                    <div>
                      <div className="text-xs text-white/60 mb-1">Predicted Secondary Structure</div>
                      <StructureBar structure={it.predictedStructure} height={10} />
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <div className="text-xs text-white/60 mb-1">Amino Acid Sequence</div>
                        <pre className="bg-black/50 border border-white/10 rounded-lg p-3 overflow-x-auto text-emerald-300 text-xs whitespace-pre-wrap break-all">{it.sequence}</pre>
                      </div>
                      <div>
                        <div className="text-xs text-white/60 mb-1">2D Contact Map</div>
                        <div className="flex items-center gap-4">
                          <ContactMapCanvas matrix={it.contactMap} size={260} dotSize={2} />
                          <div className="text-xs text-white/60">
                            <div>Dots indicate predicted residue-residue contacts.</div>
                            <div className="mt-1">Diagonal shows sequence index parity.</div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div>
                      <div className="text-sm font-semibold mb-1">Additional Analysis</div>
                      <div className="grid md:grid-cols-3 gap-4 text-sm">
                        <div>
                          <div className="text-white/50">Molecular Weight</div>
                          <div className="font-medium">{it.analysis?.molecularWeight}</div>
                        </div>
                        <div>
                          <div className="text-white/50">Isoelectric Point (pI)</div>
                          <div className="font-medium">{it.analysis?.pI}</div>
                        </div>
                        <div>
                          <div className="text-white/50">Predicted Domains</div>
                          <div className="font-medium space-y-1">
                            {it.analysis?.predictedDomains?.map((d, i) => (
                              <div key={i} className="text-xs text-white/80">• {d}</div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
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
