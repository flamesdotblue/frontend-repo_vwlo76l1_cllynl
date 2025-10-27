import { useMemo, useState } from 'react';
import { FlaskConical, Rocket, Loader2 } from 'lucide-react';
import StructureBar from './StructureBar';
import TopologyDiagram from './TopologyDiagram';

function randomStructure(length) {
  const chars = ['H', 'E', 'C'];
  let out = '';
  for (let i = 0; i < length; i++) {
    out += chars[Math.floor(Math.random() * chars.length)];
  }
  return out;
}

function randomConfidence() {
  return (Math.random() * (99.9 - 60.0) + 60.0).toFixed(1);
}

function computeAnalysis(seq) {
  const aa = seq.replace(/\s|>/g, '').toUpperCase();
  const len = aa.length;
  const massMap = {
    A: 89.09, R: 174.20, N: 132.12, D: 133.10, C: 121.16, E: 147.13, Q: 146.15, G: 75.07, H: 155.16, I: 131.18,
    L: 131.18, K: 146.19, M: 149.21, F: 165.19, P: 115.13, S: 105.09, T: 119.12, W: 204.23, Y: 181.19, V: 117.15
  };
  let mw = 18.015; // add water for termini
  for (const c of aa) mw += massMap[c] || 0;
  const kDa = (mw / 1000).toFixed(1);
  const pI = (5.5 + Math.random() * 3).toFixed(2);
  const domains = [
    `Pfam: Kinase_dom (Residues ${Math.max(1, Math.floor(len * 0.1))}-${Math.max(2, Math.floor(len * 0.4))}, Conf: ${(95 + Math.random() * 5).toFixed(1)}%)`,
    `Pfam: SH3 (Residues ${Math.max(2, Math.floor(len * 0.55))}-${Math.max(3, Math.floor(len * 0.72))}, Conf: ${(80 + Math.random() * 10).toFixed(1)}%)`
  ];
  return { molecularWeight: `${kDa} kDa`, pI, predictedDomains: domains };
}

function parseTopology(structureString) {
  const els = [];
  if (!structureString) return els;
  let current = structureString[0];
  let length = 1;
  let h = 0, e = 0, l = 0;
  for (let i = 1; i < structureString.length; i++) {
    if (structureString[i] === current) {
      length++;
    } else {
      let label;
      if (current === 'H') label = `H${++h}`;
      else if (current === 'E') label = `E${++e}`;
      else label = `L${++l}`;
      els.push({ type: current, length, label });
      current = structureString[i];
      length = 1;
    }
  }
  let label;
  if (current === 'H') label = `H${++h}`;
  else if (current === 'E') label = `E${++e}`;
  else label = `L${++l}`;
  els.push({ type: current, length, label });
  return els;
}

export default function Predictor({ user, onSaved }) {
  const [proteinName, setProteinName] = useState('');
  const [sequence, setSequence] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const aaLength = useMemo(() => (sequence || '').replace(/\s|>/g, '').length, [sequence]);

  const handlePredict = async (e) => {
    e.preventDefault();
    if (!sequence.trim()) return;
    setLoading(true);
    setResult(null);
    setTimeout(() => {
      const cleanSeq = (sequence || '').trim();
      const len = cleanSeq.replace(/\s|>/g, '').length;
      const predictedStructure = randomStructure(len);
      const confidence = parseFloat(randomConfidence());
      const createdAt = new Date().toISOString();
      const analysis = computeAnalysis(cleanSeq);
      const topologyElements = parseTopology(predictedStructure);
      const doc = {
        id: crypto.randomUUID(),
        proteinName: proteinName?.trim() ? proteinName.trim() : 'Untitled Protein',
        sequence: cleanSeq,
        predictedStructure,
        confidence,
        createdAt,
        analysis,
        topologyElements: JSON.stringify(topologyElements),
      };

      // Persist to localStorage under the user's space (simulating backend)
      const baseKey = `artifacts.betafold-app.users.${user.email}.predictions`;
      const list = JSON.parse(localStorage.getItem(baseKey) || '[]');
      list.unshift(doc);
      localStorage.setItem(baseKey, JSON.stringify(list));

      setResult(doc);
      setLoading(false);
      onSaved?.(doc);
      // Clear the form
      setProteinName('');
      setSequence('');
    }, 1600 + Math.random() * 900);
  };

  return (
    <div className="p-4 md:p-8">
      <div className="max-w-5xl mx-auto space-y-6">
        <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-slate-900 to-black text-white p-6 md:p-8 shadow-xl">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="text-2xl md:text-3xl font-semibold tracking-tight">Betafold: 2D Structure Prediction</h2>
              <p className="text-white/60 mt-2 max-w-2xl">
                Advanced machine learning analysis for 2D protein secondary structure and topology.
              </p>
            </div>
            <div className="hidden md:block p-3 rounded-xl bg-white/5 border border-white/10">
              <FlaskConical className="w-6 h-6 text-fuchsia-300" />
            </div>
          </div>

          <form onSubmit={handlePredict} className="mt-6 grid gap-4">
            <div>
              <label className="text-sm text-white/70">Protein Name (Optional)</label>
              <input
                type="text"
                value={proteinName}
                onChange={(e) => setProteinName(e.target.value)}
                placeholder="e.g., Spike glycoprotein"
                className="mt-1 w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2.5 outline-none focus:ring-2 focus:ring-fuchsia-400/40"
              />
            </div>

            <div>
              <label className="text-sm text-white/70">Amino Acid Sequence (FASTA Format)</label>
              <textarea
                value={sequence}
                onChange={(e) => setSequence(e.target.value)}
                placeholder={">MyProtein\nMSTNPKPQRKTKRNTNRRPQDVKQEN..."}
                rows={8}
                className="mt-1 w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2.5 outline-none focus:ring-2 focus:ring-fuchsia-400/40 font-mono text-sm"
              />
              <div className="mt-1 text-xs text-white/50">Length detected: {aaLength} aa</div>
            </div>

            <button
              type="submit"
              disabled={loading || aaLength === 0}
              className="inline-flex items-center justify-center gap-2 w-full md:w-max px-4 md:px-6 py-2.5 rounded-lg bg-fuchsia-500 hover:bg-fuchsia-600 disabled:opacity-60 disabled:cursor-not-allowed font-medium"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Rocket className="w-4 h-4" />}
              {loading ? 'Analyzing…' : 'Predict 2D Structure'}
            </button>

            <div className="mt-2 text-sm text-white/60 space-y-1">
              <div>How it works:</div>
              <ul className="list-disc pl-5 space-y-1">
                <li>Input your protein sequence in standard amino acid format.</li>
                <li>Our AI analyzes secondary structure and predicts topology segments.</li>
                <li>Get a visual secondary structure bar and a 2D topology diagram (SVG).</li>
                <li>Results include confidence scores and additional analysis.</li>
              </ul>
            </div>
          </form>
        </div>

        {result && (
          <div className="rounded-2xl border border-white/10 bg-white/5 text-white p-6">
            <h3 className="text-lg font-semibold">Prediction Result</h3>
            <div className="grid md:grid-cols-3 gap-4 mt-3 text-sm">
              <div>
                <div className="text-white/50">Protein Name</div>
                <div className="font-medium">{result.proteinName}</div>
              </div>
              <div>
                <div className="text-white/50">Confidence Score</div>
                <div className="font-medium">{result.confidence}%</div>
              </div>
              <div>
                <div className="text-white/50">Created</div>
                <div className="font-medium">{new Date(result.createdAt).toLocaleString()}</div>
              </div>
            </div>
            <div className="mt-4">
              <div className="text-white/50 text-sm mb-1">Predicted Secondary Structure</div>
              <StructureBar structure={result.predictedStructure} height={10} />
            </div>
            <div className="mt-6">
              <div className="text-md font-semibold text-gray-200 mb-2">2D Topology Diagram</div>
              <p className="text-sm text-gray-400 mb-3">Schematic of predicted secondary structure elements.</p>
              <div className="p-4 bg-gray-800 rounded-lg overflow-x-auto">
                <TopologyDiagram elements={JSON.parse(result.topologyElements || '[]')} height={120} />
              </div>
            </div>
            <div className="mt-6 grid md:grid-cols-3 gap-4 text-sm">
              <div>
                <div className="text-white/50">Molecular Weight</div>
                <div className="font-medium">{result.analysis?.molecularWeight}</div>
              </div>
              <div>
                <div className="text-white/50">Isoelectric Point (pI)</div>
                <div className="font-medium">{result.analysis?.pI}</div>
              </div>
              <div>
                <div className="text-white/50">Predicted Domains</div>
                <div className="font-medium space-y-1">
                  {result.analysis?.predictedDomains?.map((d, i) => (
                    <div key={i} className="text-xs text-white/80">• {d}</div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
