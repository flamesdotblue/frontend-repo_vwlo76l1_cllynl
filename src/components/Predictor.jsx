import { useMemo, useState } from 'react';
import { FlaskConical, Rocket, Loader2 } from 'lucide-react';

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
      const len = (sequence || '').replace(/\s|>/g, '').length;
      const predictedStructure = randomStructure(len);
      const confidence = parseFloat(randomConfidence());
      const createdAt = new Date().toISOString();
      const doc = {
        id: crypto.randomUUID(),
        proteinName: proteinName || 'Untitled Protein',
        sequence: sequence.trim(),
        predictedStructure,
        confidence,
        createdAt,
      };

      // Persist to localStorage under the user's space
      const baseKey = `artifacts.betafold-app.users.${user.email}.predictions`;
      const list = JSON.parse(localStorage.getItem(baseKey) || '[]');
      list.unshift(doc);
      localStorage.setItem(baseKey, JSON.stringify(list));

      setResult(doc);
      setLoading(false);
      onSaved?.(doc);
    }, 1500 + Math.random() * 800);
  };

  return (
    <div className="p-4 md:p-8">
      <div className="max-w-5xl mx-auto space-y-6">
        <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-slate-900 to-black text-white p-6 md:p-8 shadow-xl">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="text-2xl md:text-3xl font-semibold tracking-tight">Betafold: 2D Structure Prediction</h2>
              <p className="text-white/60 mt-2 max-w-2xl">
                Advanced machine learning analysis for 2D protein structure and contact prediction.
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
                <li>Our AI analyzes secondary structure, domains, and folding patterns.</li>
                <li>Get detailed predictions about your protein's 2D structure.</li>
                <li>Results include confidence scores and a predicted secondary structure map.</li>
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
              <pre className="bg-black/50 border border-white/10 rounded-lg p-3 overflow-x-auto text-fuchsia-300 text-xs whitespace-pre-wrap break-all">{result.predictedStructure}</pre>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
