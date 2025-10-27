import { useState } from 'react';
import Spline from '@splinetool/react-spline';
import { Dna, Mail, Lock, LogIn, UserPlus, ArrowRight } from 'lucide-react';

export default function LoginView({ onLogin }) {
  const [mode, setMode] = useState('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleEmailAuth = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      if (!email || !password) {
        setError('Please enter your email and password.');
        return;
      }
      const usersKey = 'betafold_users_v1';
      const users = JSON.parse(localStorage.getItem(usersKey) || '{}');
      if (mode === 'signup') {
        if (users[email]) {
          setError('An account with this email already exists.');
          return;
        }
        users[email] = { email, password };
        localStorage.setItem(usersKey, JSON.stringify(users));
      } else {
        if (!users[email] || users[email].password !== password) {
          setError('Invalid email or password.');
          return;
        }
      }
      localStorage.setItem('betafold_session_v1', JSON.stringify({ email }));
      onLogin({ email });
    }, 700);
  };

  const handleGoogle = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      const email = 'user.google@example.com';
      localStorage.setItem('betafold_session_v1', JSON.stringify({ email }));
      onLogin({ email });
    }, 600);
  };

  return (
    <div className="relative min-h-screen w-full bg-black text-white overflow-hidden">
      <div className="absolute inset-0">
        <Spline scene="https://prod.spline.design/D17NpA0ni2BTjUzp/scene.splinecode" style={{ width: '100%', height: '100%' }} />
      </div>
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/40 to-black pointer-events-none" />

      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4">
        <div className="flex items-center gap-3 mb-8">
          <div className="p-2 rounded-xl bg-white/10 backdrop-blur">
            <Dna className="w-6 h-6 text-fuchsia-400" />
          </div>
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">Betafold</h1>
            <p className="text-sm text-white/60">Predicting protein 2D structure</p>
          </div>
        </div>

        <div className="w-full max-w-md rounded-2xl border border-white/10 bg-black/60 backdrop-blur-xl shadow-xl p-6">
          <div className="mb-6">
            <h2 className="text-xl font-medium">{mode === 'login' ? 'Welcome back' : 'Create your account'}</h2>
            <p className="text-sm text-white/60">Sign {mode === 'login' ? 'in to continue' : 'up to get started'}</p>
          </div>

          <div className="space-y-3">
            <button onClick={handleGoogle} disabled={loading} className="w-full inline-flex items-center justify-center gap-2 rounded-lg bg-white text-black py-2.5 font-medium transition hover:opacity-90">
              <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" className="w-5 h-5" />
              Continue with Google
            </button>

            <div className="relative my-4">
              <div className="absolute inset-0 flex items-center" aria-hidden="true">
                <div className="w-full border-t border-white/10" />
              </div>
              <div className="relative flex justify-center">
                <span className="bg-black px-3 text-xs text-white/50">or with email</span>
              </div>
            </div>

            {error && (
              <div className="text-sm text-red-400 bg-red-400/10 border border-red-400/30 rounded p-2">
                {error}
              </div>
            )}

            <form onSubmit={handleEmailAuth} className="space-y-3">
              <div className="relative">
                <Mail className="w-4 h-4 text-white/40 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  autoComplete="email"
                  required
                  placeholder="Email address"
                  className="w-full bg-white/5 border border-white/10 rounded-lg py-2.5 pl-10 pr-3 outline-none focus:ring-2 focus:ring-fuchsia-400/40"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-white/40 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
                  required
                  placeholder="Password"
                  className="w-full bg-white/5 border border-white/10 rounded-lg py-2.5 pl-10 pr-3 outline-none focus:ring-2 focus:ring-fuchsia-400/40"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <button type="submit" disabled={loading} className="w-full inline-flex items-center justify-center gap-2 rounded-lg bg-fuchsia-500 hover:bg-fuchsia-600 text-white py-2.5 font-medium transition">
                {mode === 'login' ? <LogIn className="w-4 h-4" /> : <UserPlus className="w-4 h-4" />}
                {loading ? 'Please wait…' : mode === 'login' ? 'Sign In' : 'Create Account'}
              </button>
            </form>

            <div className="text-sm text-white/60 flex items-center justify-between pt-2">
              <span>
                {mode === 'login' ? "Don't have an account?" : 'Already have an account?'}
              </span>
              <button onClick={() => setMode(mode === 'login' ? 'signup' : 'login')} className="inline-flex items-center gap-1 text-fuchsia-300 hover:text-fuchsia-200 font-medium">
                {mode === 'login' ? 'Sign up' : 'Sign in'}
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        <p className="mt-6 text-xs text-white/50 max-w-md text-center">
          By continuing you agree to the Terms of Service and acknowledge the Privacy Policy. This demo simulates authentication and predictions for showcasing the Betafold interface.
        </p>
      </div>
    </div>
  );
}
